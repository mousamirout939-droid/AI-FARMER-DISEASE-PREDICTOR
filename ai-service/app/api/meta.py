import torch
from fastapi import APIRouter

from app.core.config import settings
from app.ml.crops import SUPPORTED_CROPS
from app.models.schemas import ClassListResponse, HealthResponse
from app.services.inference_service import get_inference_service

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="AI service health check")
def health():
    service = get_inference_service()
    return HealthResponse(
        status="ok",
        model_status=service.model_status,
        num_classes=service.num_classes,
        device=str(service.device),
    )


@router.get("/classes", response_model=ClassListResponse, summary="List supported disease classes and crops")
def list_classes():
    service = get_inference_service()
    return ClassListResponse(
        classes=list(service.idx_to_class.values()),
        crops=SUPPORTED_CROPS,
    )
