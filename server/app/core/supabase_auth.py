"""
Supabase Authentication Utilities

Verify Supabase JWT tokens and extract user information.
"""

from typing import Any, Optional
import httpx
from jose import JWTError, jwt

from app.core.config import settings


class SupabaseAuthError(Exception):
    """Custom exception for Supabase auth errors."""
    pass


def decode_supabase_token(token: str) -> Optional[dict[str, Any]]:
    """
    Decode and verify a Supabase JWT token.
    
    Supabase tokens are signed with the JWT secret from your project settings.
    The token payload contains:
    - sub: Supabase user ID (UUID)
    - email: User's email
    - user_metadata: Custom user data (e.g., display_name)
    - aud: Audience (usually "authenticated")
    - role: User role (usually "authenticated")
    
    Args:
        token: The Supabase JWT token (access_token)
    
    Returns:
        Decoded token payload or None if invalid
    """
    if not settings.SUPABASE_JWT_SECRET:
        # If no JWT secret configured, try to decode without verification (dev mode)
        try:
            # Decode without verification - NOT RECOMMENDED FOR PRODUCTION
            payload = jwt.decode(token, options={"verify_signature": False})
            return payload
        except JWTError:
            return None
    
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except JWTError as e:
        print(f"Supabase JWT decode error: {e}")
        return None


def extract_user_info(token_payload: dict[str, Any]) -> dict[str, Any]:
    """
    Extract user information from a decoded Supabase token.
    
    Args:
        token_payload: Decoded JWT payload
    
    Returns:
        Dictionary with user info (id, email, full_name)
    """
    user_metadata = token_payload.get("user_metadata", {})
    
    return {
        "supabase_id": token_payload.get("sub"),
        "email": token_payload.get("email"),
        "full_name": user_metadata.get("full_name") or user_metadata.get("display_name"),
        "email_verified": token_payload.get("email_confirmed_at") is not None,
    }


async def verify_supabase_user(access_token: str) -> Optional[dict[str, Any]]:
    """
    Verify a Supabase access token and get user info.
    
    This uses the Supabase Auth API to verify the token is valid
    and get the current user's information.
    
    Args:
        access_token: Supabase access token
    
    Returns:
        User info dict or None if invalid
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{settings.SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "apikey": access_token,  # Supabase requires apikey header
                },
            )
            
            if response.status_code == 200:
                user_data = response.json()
                return {
                    "supabase_id": user_data.get("id"),
                    "email": user_data.get("email"),
                    "full_name": user_data.get("user_metadata", {}).get("full_name"),
                    "email_verified": user_data.get("email_confirmed_at") is not None,
                }
            return None
        except httpx.HTTPError:
            return None
