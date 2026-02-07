"""
JWT Authentication Module
Verifies Supabase JWT tokens locally for performance
"""

from datetime import datetime, timezone
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.core.config import get_settings

# Security scheme
security = HTTPBearer(auto_error=False)


class TokenPayload(BaseModel):
    """JWT Token payload structure"""
    sub: str  # User ID
    email: str | None = None
    role: str | None = None
    exp: int
    iat: int


class CurrentUser(BaseModel):
    """Authenticated user data"""
    id: str
    email: str | None = None
    role: str | None = None


def decode_jwt(token: str) -> TokenPayload:
    """
    Decode and verify JWT token using Supabase JWT secret.
    Does NOT call Supabase API - verifies signature locally.
    """
    settings = get_settings()

    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return TokenPayload(**payload)

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def verify_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)]
) -> CurrentUser:
    """
    FastAPI dependency that extracts and verifies JWT from Authorization header.
    Returns CurrentUser with user_id extracted from token.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_payload = decode_jwt(credentials.credentials)

    # Check expiration
    now = datetime.now(timezone.utc).timestamp()
    if token_payload.exp < now:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return CurrentUser(
        id=token_payload.sub,
        email=token_payload.email,
        role=token_payload.role,
    )


async def verify_user_optional(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)]
) -> CurrentUser | None:
    """
    Optional user verification - returns None if no token provided.
    """
    if credentials is None:
        return None

    try:
        return await verify_user(credentials)
    except HTTPException:
        return None
