"""
Inference service: loads the trained model checkpoint (if present) and runs
predictions on uploaded images, including GradCAM heatmap generation.

If no trained checkpoint exists at settings.model_checkpoint_path, the
service still runs end-to-end using a freshly-initialized (untrained)
network so the full API/pipeline can be exercised in development. In that
case every response is clearly flagged with "model_status":
"untrained_demo_mode" so callers never mistake demo output for a real
diagnosis. Train a real model with app/ml/train.py to get genuine
predictions.
"""

import base64
import io
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image

from app.core.config import settings
from app.ml.crops import infer_crop_from_label
from app.ml.dataset import build_transforms, load_class_map
from app.ml.gradcam import GradCAM, overlay_heatmap_on_image
from app.ml.model import build_model


class InferenceService:
    def __init__(self):
        self.device = torch.device(settings.device if torch.cuda.is_available() or settings.device == "cpu" else "cpu")
        self.image_size = settings.image_size
        self.transform = build_transforms(self.image_size, train=False)

        self.class_to_idx, self.idx_to_class, self.model_status = self._load_class_map()
        self.num_classes = len(self.idx_to_class)

        self.model = self._load_model()
        self.gradcam = GradCAM(self.model, self.model.get_feature_extractor())

    def _load_class_map(self):
        class_map_path = Path(settings.base_dir) / settings.class_map_path
        if not class_map_path.exists():
            class_map_path = Path(settings.class_map_path)

        idx_to_class = load_class_map(str(class_map_path))
        class_to_idx = {v: k for k, v in idx_to_class.items()}
        return class_to_idx, idx_to_class, "loaded_class_map"

    def _load_model(self):
        checkpoint_path = Path(settings.base_dir) / settings.model_checkpoint_path
        if not checkpoint_path.exists():
            checkpoint_path = Path(settings.model_checkpoint_path)

        if checkpoint_path.exists():
            checkpoint = torch.load(checkpoint_path, map_location=self.device)
            num_classes = checkpoint["num_classes"]
            model = build_model(num_classes=num_classes, pretrained=False)
            model.load_state_dict(checkpoint["model_state_dict"])
            model.to(self.device).eval()

            # Trained checkpoint may define its own class map; prefer it.
            if "class_to_idx" in checkpoint:
                self.class_to_idx = checkpoint["class_to_idx"]
                self.idx_to_class = {v: k for k, v in self.class_to_idx.items()}

            self.model_status = "trained"
            print(f"[Inference] Loaded trained checkpoint from {checkpoint_path} (val_acc={checkpoint.get('val_acc', 'n/a')})")
            return model

        # No trained checkpoint available -- fall back to an untrained model
        # so the API remains fully functional for development/demo purposes.
        print(
            f"[Inference] WARNING: no checkpoint found at {checkpoint_path}. "
            "Running in untrained_demo_mode. Train a model with `python -m app.ml.train` "
            "to enable real predictions."
        )
        self.model_status = "untrained_demo_mode"
        model = build_model(num_classes=self.num_classes, pretrained=True)
        model.to(self.device).eval()
        return model

    def _read_image(self, image_bytes: bytes):
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        return pil_image, cv_image

    def assess_image_quality(self, cv_image: np.ndarray) -> dict:
        """Blur detection using the variance of the Laplacian, plus basic
        brightness checks, so poor-quality uploads can prompt a retake."""
        gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        brightness = float(np.mean(gray))

        is_blurry = laplacian_var < 80
        is_too_dark = brightness < 40
        is_too_bright = brightness > 230

        suggestions = []
        if is_blurry:
            suggestions.append("Image appears blurry. Hold the camera steady and ensure the leaf is in focus.")
        if is_too_dark:
            suggestions.append("Image is too dark. Take the photo in better lighting.")
        if is_too_bright:
            suggestions.append("Image is overexposed. Avoid direct harsh sunlight or flash glare.")

        return {
            "sharpness_score": round(float(laplacian_var), 2),
            "brightness_score": round(brightness, 2),
            "is_acceptable": not (is_blurry or is_too_dark or is_too_bright),
            "suggestions": suggestions,
        }

    def predict(self, image_bytes: bytes) -> dict:
        pil_image, cv_image = self._read_image(image_bytes)
        quality = self.assess_image_quality(cv_image)

        input_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
        input_tensor.requires_grad_(True)

        heatmap, predicted_idx = self.gradcam.generate(input_tensor)

        with torch.no_grad():
            logits = self.model(input_tensor)
            probabilities = F.softmax(logits, dim=1)[0].cpu().numpy()

        predicted_class = self.idx_to_class.get(predicted_idx, "unknown")
        confidence = float(probabilities[predicted_idx])

        all_probabilities = [
            {"label": self.idx_to_class.get(i, str(i)), "probability": float(p)}
            for i, p in enumerate(probabilities)
        ]
        all_probabilities.sort(key=lambda x: x["probability"], reverse=True)

        overlaid = overlay_heatmap_on_image(cv_image, heatmap)
        heatmap_b64 = self._encode_image_to_base64(overlaid)

        severity_score = self._estimate_severity(predicted_class, confidence, heatmap)
        bounding_boxes = self._estimate_bounding_box(heatmap, cv_image.shape)

        return {
            "predicted_class": predicted_class,
            "crop": infer_crop_from_label(predicted_class),
            "confidence": round(confidence, 4),
            "severity_score": severity_score,
            "all_probabilities": all_probabilities[:10],
            "bounding_boxes": bounding_boxes,
            "heatmap_base64": heatmap_b64,
            "image_quality": quality,
            "model_status": self.model_status,
        }

    def _estimate_severity(self, predicted_class: str, confidence: float, heatmap: np.ndarray) -> int:
        if predicted_class == "healthy":
            return 0
        affected_ratio = float(np.mean(heatmap > 0.5))
        severity = min(100, int((affected_ratio * 70 + confidence * 30) * 100) // 1)
        return max(1, min(severity, 100))

    def _estimate_bounding_box(self, heatmap: np.ndarray, image_shape) -> list:
        h, w = image_shape[:2]
        heatmap_resized = cv2.resize(heatmap, (w, h))
        mask = (heatmap_resized > 0.6).astype(np.uint8)

        if mask.sum() == 0:
            return []

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        boxes = []
        for c in contours:
            x, y, bw, bh = cv2.boundingRect(c)
            if bw * bh < 0.01 * w * h:
                continue
            boxes.append({"x": int(x), "y": int(y), "width": int(bw), "height": int(bh), "label": "affected_region", "confidence": 0.0})

        return boxes[:5]

    @staticmethod
    def _encode_image_to_base64(cv_image: np.ndarray) -> str:
        success, buffer = cv2.imencode(".jpg", cv_image)
        if not success:
            return ""
        return "data:image/jpeg;base64," + base64.b64encode(buffer).decode("utf-8")


# Singleton instance loaded once at process startup.
inference_service: Optional[InferenceService] = None


def get_inference_service() -> InferenceService:
    global inference_service
    if inference_service is None:
        inference_service = InferenceService()
    return inference_service
