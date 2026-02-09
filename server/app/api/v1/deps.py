"""API Dependencies - Authentication and authorization"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.core.security import decode_jwt
from app.core.supabase_auth import extract_user_info
from app.services.user_service import UserService

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Dependency to get current authenticated user.
    
    Verifies the Supabase JWT (RS256 + JWKS), then looks up or auto-creates
    the user in the local database.
    """
    token = credentials.credentials
    user_service = UserService(db)

    # Verify JWT via RS256 + JWKS (raises HTTPException on failure)
    token_payload = decode_jwt(token)

    supabase_id = token_payload.sub
    email = token_payload.email

    if not supabase_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user ID",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Try to find existing user by supabase_id or email
    user = await user_service.get_by_supabase_id(supabase_id)
    if not user and email:
        user = await user_service.get_by_email(email)

    if user:
        # Update supabase_id if not set
        if not user.supabase_id:
            user = await user_service.update_supabase_id(user.id, supabase_id)
        if user and user.is_active:
            return user
    else:
        # Auto-create user from Supabase token
        from app.schemas.user import UserCreate
        user = await user_service.create_from_supabase(
            supabase_id=supabase_id,
            email=email or "",
            full_name=email.split("@")[0] if email else "User",
        )
        if user:
            return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_active_superuser(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to require superuser role."""
    from app.core.constants import UserRole
    if current_user.role != UserRole.SUPER_ADMIN.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return current_user
