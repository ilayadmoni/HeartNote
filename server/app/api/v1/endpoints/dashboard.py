"""
Dashboard API Endpoint
Serves user statistics and creation history for the Profile Dashboard.
Aligned with the new `creations` + `profiles` table schema (005_destructive_reset).

Security: Uses ``get_rls_client`` so every Supabase query runs under the
user's JWT with Postgres RLS enforced.
"""

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from supabase import Client

from app.core import CurrentUser, get_settings, verify_user, get_rls_client

router = APIRouter()


# =============================================================================
# RESPONSE MODELS
# =============================================================================

class DashboardStats(BaseModel):
    """Quota usage statistics derived from profiles columns."""
    creations_count: int
    creations_left_free: int
    creations_left_pro: int | None
    subscription_tier: str


class DashboardCreation(BaseModel):
    """Single creation item in the dashboard list."""
    id: str
    template_slug: str
    template_name: str
    created_at: str
    expires_at: str | None
    is_expired: bool
    is_paid: bool | None


class DashboardResponse(BaseModel):
    """Full dashboard payload."""
    stats: DashboardStats
    creations: list[DashboardCreation]


# =============================================================================
# ENDPOINT
# =============================================================================

@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    current_user: CurrentUser = Depends(verify_user),
    supabase: Client = Depends(get_rls_client),
):
    """
    User Dashboard — returns quota stats and creation history.
    """
    now = datetime.now(timezone.utc)

    # ── Fetch profile for quota stats ────────────────────────────────
    profile_result = (
        supabase.table("profiles")
        .select(
            "subscription_tier, creations_count, "
            "creations_left_free, creations_left_pro"
        )
        .eq("id", current_user.id)
        .single()
        .execute()
    )

    profile = profile_result.data or {}

    stats = DashboardStats(
        creations_count=profile.get("creations_count", 0),
        creations_left_free=profile.get("creations_left_free", 3),
        creations_left_pro=profile.get("creations_left_pro"),
        subscription_tier=profile.get("subscription_tier", "free"),
    )

    # ── Fetch all non-deleted creations for this user ────────────────
    result = (
        supabase.table("creations")
        .select(
            "id, is_paid, expires_at, created_at, "
            "templates!inner(slug, name)"
        )
        .eq("user_id", current_user.id)
        .eq("is_deleted", False)
        .order("created_at", desc=True)
        .execute()
    )

    all_creations: list[dict[str, Any]] = result.data or []

    dashboard_creations: list[DashboardCreation] = []

    for c in all_creations:
        expires_at_str = c.get("expires_at")
        is_expired = False

        if expires_at_str:
            try:
                if "Z" in expires_at_str:
                    exp_dt = datetime.fromisoformat(expires_at_str.replace("Z", "+00:00"))
                else:
                    exp_dt = datetime.fromisoformat(expires_at_str)
                is_expired = exp_dt < now
            except (ValueError, TypeError):
                is_expired = False

        tmpl = c.get("templates") or {}

        dashboard_creations.append(DashboardCreation(
            id=c["id"],
            template_slug=tmpl.get("slug", ""),
            template_name=tmpl.get("name", "כרטיס"),
            created_at=c["created_at"],
            expires_at=expires_at_str,
            is_expired=is_expired,
            is_paid=c.get("is_paid"),
        ))

    return DashboardResponse(
        stats=stats,
        creations=dashboard_creations,
    )
