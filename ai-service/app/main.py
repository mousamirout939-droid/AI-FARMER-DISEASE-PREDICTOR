from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import meta, predict
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description=(
        "AI microservice for the AI Farmer Disease Predictor platform. "
        "Provides crop disease classification, GradCAM visual explanations, "
        "image quality assessment, and supported-class metadata. "
        "See /docs for interactive Swagger documentation."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meta.router, prefix="/api/v1", tags=["Meta"])
app.include_router(predict.router, prefix="/api/v1", tags=["Prediction"])


@app.get("/", tags=["Meta"])
def root():
    return {
        "service": settings.app_name,
        "status": "running",
        "docs": "/docs",
        "health": "/api/v1/health",
    }
