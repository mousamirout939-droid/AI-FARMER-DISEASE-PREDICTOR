from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    environment: str = "development"
    app_name: str = "AI Farmer Disease Predictor - AI Service"

    model_checkpoint_path: str = "checkpoints/best_model.pt"
    class_map_path: str = "app/ml/class_map.json"
    device: str = "cpu"
    image_size: int = 224
    confidence_threshold: float = 0.4

    cors_origins: str = "http://localhost:5173,http://localhost:5000"

    dataset_dir: str = "dataset/raw"
    checkpoints_dir: str = "checkpoints"

    class Config:
        env_file = ".env"

    @property
    def cors_origin_list(self):
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def base_dir(self) -> Path:
        return Path(__file__).resolve().parent.parent.parent


settings = Settings()
