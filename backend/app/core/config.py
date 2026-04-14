import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


def parse_cors_origins(value: str | None) -> list[str]:
    if not value:
        return [
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]

    return [origin.strip().rstrip("/") for origin in value.split(",") if origin.strip()]

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgroLink"
    API_V1_STR: str = "/api/v1"
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "agrolink")
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL") or f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-it-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    BACKEND_CORS_ORIGINS: list[str] = parse_cors_origins(os.getenv("BACKEND_CORS_ORIGINS"))

settings = Settings()
