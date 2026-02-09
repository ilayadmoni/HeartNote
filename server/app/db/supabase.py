"""
Supabase Client Factory

Provides two types of Supabase clients:

1. **User client** (`get_user_supabase_client`):
   Created per-request with the user's JWT so that Postgres Row Level Security
   (RLS) policies are enforced.  This is what every user-facing endpoint must use.

2. **Admin client** (`get_admin_supabase_client`):
   Uses the SERVICE_ROLE_KEY to bypass RLS.  Reserved ONLY for:
   - Health-check / DB-connectivity probes
   - Account deletion (auth.admin.delete_user)
   - Background jobs or migrations that operate across all users

⚠️  Never use the admin client in a user-facing request handler unless the
    operation explicitly requires admin privileges.
"""

from functools import lru_cache

from supabase import Client, create_client

from app.core.config import get_settings


class SupabaseClientError(Exception):
    """Custom exception for Supabase client errors."""
    pass


# ---------------------------------------------------------------------------
# Validation helper
# ---------------------------------------------------------------------------

def _validate_supabase_config() -> None:
    """Raise early if the essential Supabase env vars are missing."""
    settings = get_settings()
    if not settings.supabase_url:
        raise ValueError(
            "SUPABASE_URL is not set.  "
            "Please add it to your .env file."
        )
    if not settings.supabase_anon_key:
        raise ValueError(
            "SUPABASE_ANON_KEY is not set.  "
            "Please add it to your .env file."
        )


# ---------------------------------------------------------------------------
# 1.  Per-request user client  (RLS enforced)
# ---------------------------------------------------------------------------

def get_user_supabase_client(access_token: str) -> Client:
    """
    Create a Supabase client that acts **on behalf of the authenticated user**.

    The client is initialised with the project's **ANON key** and then the
    user's JWT is injected via PostgREST headers so that every query runs
    through Postgres RLS as if the user issued it directly.

    This function is intentionally **not cached** – each request gets its own
    short-lived client bound to the caller's token.

    Args:
        access_token: The user's Supabase JWT (from the Authorization header).

    Returns:
        A Supabase ``Client`` whose every query respects RLS.
    """
    _validate_supabase_config()
    settings = get_settings()

    client = create_client(settings.supabase_url, settings.supabase_anon_key)

    # Inject the user's JWT so PostgREST switches to that user's context.
    # This makes RLS "see" the correct `auth.uid()`.
    client.postgrest.auth(access_token)

    return client


# ---------------------------------------------------------------------------
# 2.  Admin / service-role client  (RLS bypassed – use sparingly)
# ---------------------------------------------------------------------------

@lru_cache()
def get_admin_supabase_client() -> Client:
    """
    Get the **admin** Supabase client (cached singleton).

    Uses the SERVICE_ROLE_KEY which bypasses Row Level Security.

    ⚠️  Only use this for:
        - Health checks / connectivity probes
        - ``auth.admin`` operations (e.g. deleting a user)
        - Background / cron jobs

    Raises:
        ValueError: If SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.
    """
    _validate_supabase_config()
    settings = get_settings()

    if not settings.supabase_service_role_key:
        raise ValueError(
            "SUPABASE_SERVICE_ROLE_KEY is not set.  "
            "The admin client requires this key."
        )

    print("📦 Supabase ADMIN client initialised (service-role key – RLS bypassed)")
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


# ---------------------------------------------------------------------------
# Legacy alias – will be removed; grep for usage to migrate
# ---------------------------------------------------------------------------

def get_supabase_client() -> Client:
    """
    **DEPRECATED** – use ``get_admin_supabase_client`` or
    ``get_user_supabase_client`` instead.

    Kept temporarily so that callers that have not been migrated yet
    continue to work (they will use the admin client).
    """
    import warnings
    warnings.warn(
        "get_supabase_client() is deprecated.  "
        "Use get_user_supabase_client(token) for user-facing endpoints "
        "or get_admin_supabase_client() for admin operations.",
        DeprecationWarning,
        stacklevel=2,
    )
    return get_admin_supabase_client()


# ---------------------------------------------------------------------------
# Connectivity check  (admin-level – no user token needed)
# ---------------------------------------------------------------------------

def verify_supabase_connection() -> dict:
    """
    Verify that we can reach Supabase from the backend.

    Uses the admin client intentionally (health probes are not user-facing).
    """
    try:
        client = get_admin_supabase_client()
        client.table("profiles").select("id").limit(1).execute()
        return {"connected": True, "table_accessible": True, "error": None}
    except ValueError as e:
        return {
            "connected": False,
            "table_accessible": False,
            "error": f"Configuration error: {str(e)}",
        }
    except Exception as e:
        return {
            "connected": False,
            "table_accessible": False,
            "error": f"Connection error: {str(e)}",
        }
