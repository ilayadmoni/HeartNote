"""
HeartNote FastAPI Application
Main entry point for the API server
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    settings = get_settings()
    print(f"🚀 HeartNote API starting on port {settings.port}")
    print(f"📊 Max active pages: {settings.max_active_pages}")
    print(f"⏰ Page expiry: {settings.page_expiry_hours} hours")
    yield
    print("👋 HeartNote API shutting down")


def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    settings = get_settings()

    app = FastAPI(
        title="HeartNote API",
        description="Interactive greeting cards platform API",
        version="1.0.0",
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
        lifespan=lifespan,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API routes
    app.include_router(api_router, prefix="/api")

    # Health check
    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "service": "heartnote-api",
            "version": "1.0.0",
        }

    return app


# Create app instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=settings.debug)
