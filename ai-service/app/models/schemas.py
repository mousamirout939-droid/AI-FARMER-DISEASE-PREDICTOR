from typing import List, Optional
from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    label: str
    confidence: float = 0.0


class ClassProbability(BaseModel):
    label: str
    probability: float


class ImageQuality(BaseModel):
    sharpness_score: float
    brightness_score: float
    is_acceptable: bool
    suggestions: List[str] = []


class PredictionResponse(BaseModel):
    predicted_class: str
    crop: str
    confidence: float
    severity_score: int
    all_probabilities: List[ClassProbability]
    bounding_boxes: List[BoundingBox]
    heatmap_url: str = Field(default="", description="Base64 data URL of the GradCAM heatmap overlay")
    image_quality: ImageQuality
    model_status: str


class HealthResponse(BaseModel):
    status: str
    model_status: str
    num_classes: int
    device: str


class ClassListResponse(BaseModel):
    classes: List[str]
    crops: List[str]
