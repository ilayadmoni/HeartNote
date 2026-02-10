"""API v1 Router - Aggregates all route modules"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, dashboard, pages, templates, profile

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
api_router.include_router(pages.router, prefix="/pages", tags=["Pages"])
api_router.include_router(templates.router, prefix="/templates", tags=["Templates"])
api_router.include_router(dashboard.router, prefix="/user", tags=["Dashboard"])

