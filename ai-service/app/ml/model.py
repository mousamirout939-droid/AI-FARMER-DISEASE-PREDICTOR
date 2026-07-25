"""
Model architecture for the AI Farmer Disease Predictor.

Uses a MobileNetV3-Small backbone (torchvision) with a custom classification
head. MobileNetV3 is chosen for its strong accuracy/speed tradeoff, making it
suitable for both server inference and eventual edge/offline deployment.
"""

import torch
import torch.nn as nn
from torchvision.models import mobilenet_v3_small, MobileNet_V3_Small_Weights


class CropDiseaseClassifier(nn.Module):
    """
    Transfer-learning based crop disease classifier.

    Args:
        num_classes: number of disease/healthy classes to predict.
        pretrained: whether to initialize the backbone with ImageNet weights.
        freeze_backbone: whether to freeze feature-extractor weights
            (useful for fast fine-tuning on small datasets).
    """

    def __init__(self, num_classes: int, pretrained: bool = True, freeze_backbone: bool = False):
        super().__init__()

        weights = MobileNet_V3_Small_Weights.DEFAULT if pretrained else None
        backbone = mobilenet_v3_small(weights=weights)

        # Replace the final classifier layer with a head sized for our classes.
        in_features = backbone.classifier[-1].in_features
        backbone.classifier[-1] = nn.Identity()
        self.backbone = backbone

        if freeze_backbone:
            for param in self.backbone.parameters():
                param.requires_grad = False

        self.head = nn.Sequential(
            nn.Linear(in_features, 256),
            nn.Hardswish(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes),
        )

        self.num_classes = num_classes

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        features = self.backbone(x)
        logits = self.head(features)
        return logits

    def get_feature_extractor(self):
        """Returns the backbone's last convolutional block, used for GradCAM."""
        return self.backbone.features[-1]


def build_model(num_classes: int, pretrained: bool = True, freeze_backbone: bool = False) -> CropDiseaseClassifier:
    return CropDiseaseClassifier(num_classes=num_classes, pretrained=pretrained, freeze_backbone=freeze_backbone)
