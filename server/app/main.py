"""
HeartNote FastAPI Application
Main entry point for the API server
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    settings = get_settings()
    print(f"🚀 HeartNote API starting on port {settings.port}")
    print(f"📊 Max active pages: {settings.max_active_pages}")
    print(f"⏰ Page expiry: {settings.page_expiry_hours} hours")
    print(f"🌐 CORS Origins: {settings.cors_origins_list}")
    yield
    print("👋 HeartNote API shutting down")


def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    settings = get_settings()

    app = FastAPI(
        title="HeartNote API",
        description="Interactive greeting cards platform API",
        version="1.0.0",
        docs_url="/docs",  # Always enable for debugging
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # =========================================================================
    # CORS Middleware - CRITICAL for Frontend-Backend communication
    # =========================================================================
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,  # Explicit origins
        allow_credentials=True,  # Required for Authorization headers
        allow_methods=["*"],  # Allow all HTTP methods
        allow_headers=["*"],  # Allow all headers including Authorization
        expose_headers=["*"],  # Expose all response headers to client
    )

    # Mount API routes at /api/v1
    app.include_router(api_router, prefix="/api/v1")

    # =========================================================================
    # Health Check Endpoint - Layer 4
    # =========================================================================
    @app.get("/health", tags=["Health"])
    async def health_check():
        """
        Public health check endpoint.
        Tests basic connectivity and optionally database connection.
        Uses admin client intentionally — health probes are not user-facing.
        """
        from app.db.supabase import get_admin_supabase_client
        
        db_status = "not_configured"
        
        try:
            client = get_admin_supabase_client()
            # Test Supabase connection by fetching a simple query
            response = client.table("profiles").select("id").limit(1).execute()
            db_status = "connected"
        except ValueError as e:
            db_status = f"config_error: {str(e)}"
        except Exception as e:
            db_status = f"error: {str(e)}"
        
        return {
            "status": "ok",
            "service": "heartnote-api",
            "version": "1.0.0",
            "db": db_status,
            "cors_origins": settings.cors_origins_list,
        }

    # Simple ping endpoint (no DB check)
    @app.get("/ping", tags=["Health"])
    async def ping():
        """Ultra-simple ping endpoint for basic connectivity test."""
        return {"pong": True}

    return app


# Create app instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    # Run on 0.0.0.0 to accept external connections
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.debug
    )
