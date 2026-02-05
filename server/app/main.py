"""
HeartNote - Main FastAPI Application Entry Point

This module initializes the FastAPI application with:
- CORS middleware configuration
- Health check endpoints
- API router mounting
- Lifespan events for startup/shutdown
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.session import engine, init_db


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    print("🚀 Starting HeartNote API...")
    await init_db()
    print("✅ Database initialized")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down HeartNote API...")
    await engine.dispose()
    print("✅ Database connections closed")


def create_application() -> FastAPI:
    """
    Factory function to create and configure the FastAPI application.
    Follows the factory pattern for better testability.
    """
    app = FastAPI(
        title=settings.APP_NAME,
        description="HeartNote - A modern note-taking application with card-based organization",
        version="0.1.0",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json" if settings.DEBUG else None,
        docs_url=f"{settings.API_V1_PREFIX}/docs" if settings.DEBUG else None,
        redoc_url=f"{settings.API_V1_PREFIX}/redoc" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS_LIST,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API router
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    return app


# Create the application instance
app = create_application()


# ===========================================
# Health Check Endpoints
# ===========================================

@app.get("/health", tags=["Health"])
async def health_check() -> JSONResponse:
    """
    Basic health check endpoint.
    Returns 200 OK if the server is running.
    """
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": "healthy",
            "service": settings.APP_NAME,
            "version": "0.1.0",
        }
    )


@app.get("/health/ready", tags=["Health"])
async def readiness_check() -> JSONResponse:
    """
    Readiness check endpoint.
    Verifies database connectivity and other dependencies.
    """
    from app.db.session import check_db_connection
    
    db_healthy = await check_db_connection()
    
    if db_healthy:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": "ready",
                "database": "connected",
            }
        )
    
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "status": "not_ready",
            "database": "disconnected",
        }
    )


@app.get("/", tags=["Root"])
async def root() -> JSONResponse:
    """
    Root endpoint with API information.
    """
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": f"Welcome to {settings.APP_NAME} API",
            "version": "0.1.0",
            "docs": f"{settings.API_V1_PREFIX}/docs" if settings.DEBUG else "Disabled in production",
        }
    )
