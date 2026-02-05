"""API v1 Router - Aggregates all route modules"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, cards, tags

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(cards.router, prefix="/cards", tags=["Cards"])
api_router.include_router(tags.router, prefix="/tags", tags=["Tags"])
