"""
Auth Service - Legacy authentication business logic

NOTE: This service implements non-Supabase login/register/refresh flows.
      With the RS256+JWKS migration, all authentication goes through Supabase Auth.
      This module is kept for backwards compatibility but is NOT actively used by
      any mounted API router.
"""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.auth import Token, LoginRequest, RegisterRequest
from app.services.user_service import UserService


class AuthService:
    """Legacy auth service — not used in the Supabase auth flow."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_service = UserService(db)

    async def login(self, credentials: LoginRequest) -> Optional[Token]:
        """Legacy login — prefer Supabase Auth ``/auth/v1/token``."""
        raise NotImplementedError(
            "Direct login is disabled — authenticate via Supabase Auth instead."
        )

    async def register(self, data: RegisterRequest) -> Optional[User]:
        """Legacy register — prefer Supabase Auth ``/auth/v1/signup``."""
        raise NotImplementedError(
            "Direct registration is disabled — sign up via Supabase Auth instead."
        )

    async def refresh_tokens(self, refresh_token: str) -> Optional[Token]:
        """Legacy token refresh — prefer Supabase Auth ``/auth/v1/token?grant_type=refresh_token``."""
        raise NotImplementedError(
            "Token refresh is handled by Supabase Auth — use the Supabase client."
        )
