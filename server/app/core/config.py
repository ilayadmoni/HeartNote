"""
HeartNote Core Configuration
Loads environment variables and provides typed settings
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Application
    app_name: str = "HeartNote"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # Server
    port: int = 8000

    # CORS - comma-separated list of origins
    cors_origins: str = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://192.168.1.22:3000,http://localhost:8000,http://localhost"

    # Supabase
    supabase_url: str = ""       # REQUIRED – e.g. https://xxxx.supabase.co
    supabase_anon_key: str = ""  # REQUIRED
    supabase_service_role_key: str = ""

    # Legacy – no longer required for RS256+JWKS auth.  Kept only so
    # existing .env files that still set it won't cause startup errors.
    supabase_jwt_secret: str = ""

    # Business Logic
    max_active_pages: int = 3
    page_expiry_hours: int = 1

    # Database (optional - for direct SQLAlchemy connection)
    database_url: str | None = None

    # Legacy JWT settings (not used for Supabase RS256 auth)
    secret_key: str = "dev-secret-key"
    jwt_secret_key: str = "dev-jwt-secret"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins as list"""
        if not self.cors_origins:
            return ["http://localhost:3000"]
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

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


# Module-level settings instance for convenience
settings = get_settings()
