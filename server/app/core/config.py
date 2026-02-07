"""
HeartNote Core Configuration
Loads environment variables and provides typed settings
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Server
    port: int = 8000
    debug: bool = False
    cors_origins: str = "http://localhost:3000,http://localhost:3001"

    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""

    # Business Logic
    max_active_pages: int = 3
    page_expiry_hours: int = 1

    # Database (optional - for direct SQLAlchemy connection)
    database_url: str | None = None

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins as list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

