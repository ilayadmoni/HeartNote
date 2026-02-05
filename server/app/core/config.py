"""
Application Configuration

Centralized configuration management using Pydantic Settings.
Supports environment variables and .env files.
"""

from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings with environment variable support.
    Uses Pydantic v2 settings management.
    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "HeartNote"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://heartnote:heartnote_secret@localhost:5432/heartnote"

    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    JWT_SECRET_KEY: str = "your-jwt-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        """Parse CORS origins from comma-separated string to list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        """Ensure database URL uses asyncpg driver."""
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v


@lru_cache
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses LRU cache for performance.
    """
    return Settings()


# Global settings instance
settings = get_settings()
