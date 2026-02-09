"""
Supabase Authentication Utilities

Helper functions for extracting user info from decoded JWT payloads
and (optionally) verifying tokens via the Supabase Auth REST API.

NOTE: Primary JWT verification now uses RS256 + JWKS via ``app.core.jwks``.
      The functions here are supplementary helpers only.
"""

from typing import Any, Optional
import httpx

from app.core.config import get_settings
from app.core.jwks import verify_supabase_jwt


class SupabaseAuthError(Exception):
    """Custom exception for Supabase auth errors."""
    pass


def decode_supabase_token(token: str) -> Optional[dict[str, Any]]:
    """
    Decode and verify a Supabase JWT token using RS256 + JWKS.

    Returns the decoded payload dict on success, or ``None`` on any error.
    """
    try:
        return verify_supabase_jwt(token)
    except Exception:
        return None


def extract_user_info(token_payload: dict[str, Any]) -> dict[str, Any]:
    """
    Extract user information from a decoded Supabase token payload.
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
    Verify a Supabase access token via the Supabase Auth REST API.

    This is a **fallback** — the primary verification path is local
    RS256/JWKS (see ``app.core.jwks``).  This function is only useful
    when you need the full ``user_metadata`` blob that the REST endpoint
    returns.
    """
    settings = get_settings()
    async with httpx.AsyncClient() as client:
        try:
            apikey = settings.supabase_anon_key or settings.supabase_service_role_key
            response = await client.get(
                f"{settings.supabase_url}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "apikey": apikey,
                },
            )

            if response.status_code == 200:
                user_data = response.json()
                return {
                    "supabase_id": user_data.get("id"),
                    "email": user_data.get("email"),
                    "role": user_data.get("role", "authenticated"),
                    "full_name": user_data.get("user_metadata", {}).get("full_name"),
                    "email_verified": user_data.get("email_confirmed_at") is not None,
                }
            return None
        except httpx.HTTPError:
            return None
