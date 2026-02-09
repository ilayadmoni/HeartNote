"""
JWKS-based JWT Verification for Supabase RS256 tokens.

Supabase's new JWT Signing Keys use RS256 with a JWKS endpoint.
This module:
  1. Fetches the JWKS from the project's well-known endpoint and caches it.
  2. Selects the correct RSA public key by matching the token's ``kid`` header.
  3. Verifies the JWT signature, expiry, audience, and issuer.
  4. Handles key rotation by automatically re-fetching JWKS on ``kid`` mismatch.

Usage::

    from app.core.jwks import verify_supabase_jwt

    payload = verify_supabase_jwt(raw_token)
    # payload = {"sub": "uuid", "email": "...", "role": "authenticated", ...}
"""

from __future__ import annotations

import time
import threading
from typing import Any

import httpx
import jwt
from jwt import PyJWK, PyJWKSet

from app.core.config import get_settings

# ---------------------------------------------------------------------------
# JWKS Cache
# ---------------------------------------------------------------------------

_jwks_cache: dict[str, Any] = {
    "keys": None,          # PyJWKSet instance
    "fetched_at": 0.0,     # timestamp of last fetch
    "lock": threading.Lock(),
}

# Re-fetch JWKS at most once every 5 minutes (unless a kid miss forces it)
_JWKS_CACHE_TTL_SECONDS = 300


def _get_jwks_url() -> str:
    """Build the JWKS URL from SUPABASE_URL."""
    settings = get_settings()
    base = settings.supabase_url.rstrip("/")
    return f"{base}/auth/v1/.well-known/jwks.json"


def _fetch_jwks(force: bool = False) -> PyJWKSet:
    """
    Fetch (or return cached) JWKS key-set from Supabase.

    Thread-safe.  Will only hit the network once every ``_JWKS_CACHE_TTL_SECONDS``
    unless ``force=True`` (used on kid mismatch / key rotation).
    """
    now = time.time()
    with _jwks_cache["lock"]:
        if (
            not force
            and _jwks_cache["keys"] is not None
            and (now - _jwks_cache["fetched_at"]) < _JWKS_CACHE_TTL_SECONDS
        ):
            return _jwks_cache["keys"]

        url = _get_jwks_url()
        try:
            resp = httpx.get(url, timeout=10.0)
            resp.raise_for_status()
            jwks_data = resp.json()
        except httpx.HTTPError as exc:
            # If we have a stale cache, use it rather than failing hard
            if _jwks_cache["keys"] is not None:
                print(f"⚠️  JWKS fetch failed ({exc}), using stale cache")
                return _jwks_cache["keys"]
            raise RuntimeError(
                f"Cannot fetch JWKS from {url}: {exc}"
            ) from exc

        key_set = PyJWKSet.from_dict(jwks_data)
        _jwks_cache["keys"] = key_set
        _jwks_cache["fetched_at"] = now
        return key_set


def _get_signing_key(token: str, allow_retry: bool = True) -> PyJWK:
    """
    Extract the ``kid`` from the token header and find the matching key
    in the cached JWKS.  On miss, re-fetch JWKS once (key rotation).
    """
    try:
        header = jwt.get_unverified_header(token)
    except jwt.DecodeError as exc:
        raise jwt.InvalidTokenError(f"Cannot decode token header: {exc}") from exc

    kid = header.get("kid")
    if not kid:
        raise jwt.InvalidTokenError("Token header missing 'kid' claim")

    key_set = _fetch_jwks()

    # Search for matching kid
    for key in key_set.keys:
        if key.key_id == kid:
            return key

    # kid not found – maybe keys rotated; force re-fetch once
    if allow_retry:
        print(f"🔄 kid '{kid}' not in JWKS cache, re-fetching…")
        key_set = _fetch_jwks(force=True)
        for key in key_set.keys:
            if key.key_id == kid:
                return key

    raise jwt.InvalidTokenError(
        f"No JWKS key found for kid='{kid}'. "
        "Possible causes: token from a different Supabase project, or key rotation in progress."
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def verify_supabase_jwt(token: str) -> dict[str, Any]:
    """
    Verify a Supabase JWT using RS256 + JWKS.

    Steps:
      1. Read the ``kid`` from the token header.
      2. Look up the matching RSA public key in the (cached) JWKS.
      3. Verify signature (RS256), expiry, audience, and issuer.

    Returns:
        Decoded JWT payload dict on success.

    Raises:
        jwt.ExpiredSignatureError: Token has expired.
        jwt.InvalidTokenError: Any other validation failure.
    """
    settings = get_settings()
    signing_key = _get_signing_key(token)

    # Build expected issuer: https://<project-ref>.supabase.co/auth/v1
    issuer = f"{settings.supabase_url.rstrip('/')}/auth/v1"

    payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256", "ES256"],
        audience="authenticated",
        issuer=issuer,
        options={
            "verify_exp": True,
            "verify_aud": True,
            "verify_iss": True,
            "require": ["sub", "exp", "iat", "aud", "iss"],
        },
    )

    return payload
