from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schemas import PredictionResponse
from app.services.inference_service import get_inference_service

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


@router.post("/predict", response_model=PredictionResponse, summary="Predict crop disease from an uploaded image")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Upload JPEG, PNG, or WEBP.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    service = get_inference_service()
    try:
        result = service.predict(image_bytes)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Inference failed: {exc}") from exc

    return PredictionResponse(
        predicted_class=result["predicted_class"],
        crop=result["crop"],
        confidence=result["confidence"],
        severity_score=result["severity_score"],
        all_probabilities=result["all_probabilities"],
        bounding_boxes=result["bounding_boxes"],
        heatmap_url=result["heatmap_base64"],
        image_quality=result["image_quality"],
        model_status=result["model_status"],
    )
