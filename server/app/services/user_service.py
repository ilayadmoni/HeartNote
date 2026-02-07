"""User Service - User business logic"""

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.base import BaseService
from app.core.security import get_password_hash, verify_password


class UserService(BaseService[User, UserCreate, UserUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
        )
        self.db.add(db_obj)
        await self.db.flush()
        await self.db.refresh(db_obj)
        return db_obj

    async def authenticate(self, email: str, password: str) -> Optional[User]:
        user = await self.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    async def get_by_supabase_id(self, supabase_id: str) -> Optional[User]:
        """Get user by Supabase ID."""
        result = await self.db.execute(
            select(User).where(User.supabase_id == supabase_id)
        )
        return result.scalar_one_or_none()

    async def update_supabase_id(self, user_id: str, supabase_id: str) -> Optional[User]:
        """Update user's Supabase ID."""
        user = await self.get(user_id)
        if user:
            user.supabase_id = supabase_id
            await self.db.flush()
            await self.db.refresh(user)
        return user

    async def create_from_supabase(
        self,
        supabase_id: str,
        email: str,
        full_name: Optional[str] = None,
    ) -> User:
        """Create a new user from Supabase auth data."""
        import secrets
        
        # Generate a random password hash (user can't login with password, only Supabase)
        random_password = secrets.token_urlsafe(32)
        
        db_obj = User(
            email=email,
            hashed_password=get_password_hash(random_password),
            full_name=full_name,
            supabase_id=supabase_id,
            is_verified=True,  # Supabase handles email verification
        )
        self.db.add(db_obj)
        await self.db.flush()
        await self.db.refresh(db_obj)
        return db_obj
