"""
JWT Authentication & Authorization Dependencies

Verifies Supabase JWT tokens using **RS256 + JWKS** (the new Supabase signing
key format) and provides FastAPI dependencies that inject both the authenticated
user AND an RLS-bound Supabase client into endpoint handlers.

Architecture
------------
Client  ──Bearer token──►  FastAPI  ──RS256/JWKS verify──►  decode payload
                                     ──forward token──►  Supabase client (RLS)

Key points:
  • No shared ``jwt_secret`` / HS256 – we fetch the public key set from
    ``https://<project>.supabase.co/auth/v1/.well-known/jwks.json``
  • Keys are cached and automatically re-fetched on ``kid`` miss (rotation).
  • The raw JWT is preserved on ``CurrentUser`` so it can be forwarded to
    the Supabase PostgREST client for RLS enforcement.
"""

from datetime import datetime, timezone
from typing import Annotated, Any, Optional

import jwt as pyjwt                       # PyJWT (RS256 verification)
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from passlib.context import CryptContext
from supabase import Client

from app.core.config import get_settings
from app.core.jwks import verify_supabase_jwt
from app.db.supabase import get_user_supabase_client

# ---------------------------------------------------------------------------
# FastAPI security scheme
# ---------------------------------------------------------------------------
security = HTTPBearer(auto_error=False)

# ---------------------------------------------------------------------------
# Password hashing (legacy – kept for non-Supabase flows)
# ---------------------------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class TokenPayload(BaseModel):
    """Decoded JWT payload from a Supabase RS256 token."""
    sub: str                    # User ID (Supabase auth.users.id)
    email: str | None = None
    role: str | None = None
    exp: int
    iat: int


class CurrentUser(BaseModel):
    """Authenticated user data returned by ``verify_user`` dependency."""
    id: str
    email: str | None = None
    role: str | None = None
    access_token: str           # ← raw JWT kept for forwarding to Supabase


# ---------------------------------------------------------------------------
# Core JWT verification  (RS256 + JWKS)
# ---------------------------------------------------------------------------

def decode_jwt(token: str) -> TokenPayload:
    """
    Decode and verify a Supabase JWT using **RS256 + JWKS**.

    • Fetches (cached) JWKS from the Supabase project endpoint.
    • Matches the ``kid`` in the token header to the correct RSA key.
    • Verifies signature, expiry, audience (``authenticated``), and issuer.

    Raises ``HTTPException(401)`` on any failure.
    """
    try:
        payload = verify_supabase_jwt(token)
        return TokenPayload(**payload)

    except pyjwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except pyjwt.InvalidAudienceError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token audience (expected 'authenticated')",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except pyjwt.InvalidIssuerError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token issuer – is the token from the correct Supabase project?",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except pyjwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except RuntimeError as e:
        # JWKS fetch failure
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Auth service temporarily unavailable: {e}",
        )


# ---------------------------------------------------------------------------
# FastAPI Dependencies
# ---------------------------------------------------------------------------

async def verify_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)]
) -> CurrentUser:
    """
    **Primary auth dependency.**

    Extracts the Bearer token from the ``Authorization`` header, verifies it
    via RS256/JWKS, and returns a ``CurrentUser`` that includes the raw
    ``access_token`` for downstream RLS forwarding.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    raw_token = credentials.credentials
    token_payload = decode_jwt(raw_token)

    return CurrentUser(
        id=token_payload.sub,
        email=token_payload.email,
        role=token_payload.role,
        access_token=raw_token,          # ← preserved for RLS forwarding
    )


async def verify_user_optional(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)]
) -> CurrentUser | None:
    """
    Optional user verification – returns ``None`` if no token is provided,
    instead of raising 401.
    """
    if credentials is None:
        return None
    try:
        return await verify_user(credentials)
    except HTTPException:
        return None


# ---------------------------------------------------------------------------
# Composed dependency: verify user → build RLS-bound Supabase client
# ---------------------------------------------------------------------------

async def get_rls_client(
    current_user: CurrentUser = Depends(verify_user),
) -> Client:
    """
    FastAPI dependency that returns a Supabase client running **as the
    authenticated user** (RLS enforced).

    Usage in an endpoint::

        @router.get("/my-stuff")
        async def my_stuff(db: Client = Depends(get_rls_client)):
            return db.table("stuff").select("*").execute()
    """
    return get_user_supabase_client(current_user.access_token)
