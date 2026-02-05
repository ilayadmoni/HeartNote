"""Auth Service - Authentication business logic"""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.auth import Token, LoginRequest, RegisterRequest
from app.services.user_service import UserService
from app.core.security import create_access_token, create_refresh_token, decode_token


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_service = UserService(db)

    async def login(self, credentials: LoginRequest) -> Optional[Token]:
        user = await self.user_service.authenticate(credentials.email, credentials.password)
        if not user:
            return None
        return Token(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    async def register(self, data: RegisterRequest) -> Optional[User]:
        existing = await self.user_service.get_by_email(data.email)
        if existing:
            return None
        from app.schemas.user import UserCreate
        return await self.user_service.create(UserCreate(
            email=data.email, password=data.password, full_name=data.full_name
        ))

    async def refresh_tokens(self, refresh_token: str) -> Optional[Token]:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            return None
        user = await self.user_service.get(payload["sub"])
        if not user:
            return None
        return Token(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )
