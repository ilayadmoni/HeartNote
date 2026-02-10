"""
Dashboard API Endpoint
Serves user statistics and page history for the Profile Dashboard.

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
    """Quota usage statistics"""
    used: int
    limit: int
    remaining: int


class DashboardPage(BaseModel):
    """Single page item in the dashboard list"""
    slug: str
    title: str | None
    template_name: str | None = None
    created_at: str
    expires_at: str | None
    is_expired: bool
    view_count: int = 0


class DashboardResponse(BaseModel):
    """Full dashboard payload"""
    stats: DashboardStats
    pages: list[DashboardPage]


# =============================================================================
# ENDPOINT
# =============================================================================

@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    current_user: CurrentUser = Depends(verify_user),
    supabase: Client = Depends(get_rls_client),
):
    """
    User Dashboard — returns quota stats and page history.

    Stats:
      • ``used``  — count of *active* (non-deleted, non-expired) pages
      • ``limit`` — max active pages for the user's tier (hardcoded 3 for now)
      • ``remaining`` — limit − used

    Pages:
      • All non-deleted pages for this user, sorted newest-first.
      • ``is_expired`` is computed server-side.
    """
    settings = get_settings()
    now = datetime.now(timezone.utc)
    page_limit = settings.max_active_pages  # default: 3

    # ── Fetch all non-deleted pages for this user ────────────────────
    result = supabase.table("user_pages").select(
        "id, route_slug, title, expires_at, view_count, created_at, "
        "templates!inner(name_he)"
    ).eq(
        "user_id", current_user.id
    ).eq(
        "is_deleted", False
    ).order(
        "created_at", desc=True
    ).execute()

    all_pages: list[dict[str, Any]] = result.data or []

    # ── Build page list and count active ─────────────────────────────
    dashboard_pages: list[DashboardPage] = []
    active_count = 0

    for page in all_pages:
        expires_at_str = page.get("expires_at")
        is_expired = False

        if expires_at_str:
            try:
                if "Z" in expires_at_str:
                    exp_dt = datetime.fromisoformat(
                        expires_at_str.replace("Z", "+00:00")
                    )
                else:
                    exp_dt = datetime.fromisoformat(expires_at_str)
                is_expired = exp_dt < now
            except (ValueError, TypeError):
                is_expired = False

        if not is_expired:
            active_count += 1

        template = page.get("templates", {})

        dashboard_pages.append(DashboardPage(
            slug=page["route_slug"],
            title=page.get("title"),
            template_name=template.get("name_he"),
            created_at=page["created_at"],
            expires_at=expires_at_str,
            is_expired=is_expired,
            view_count=page.get("view_count", 0),
        ))

    # ── Build response ───────────────────────────────────────────────
    remaining = max(page_limit - active_count, 0)

    return DashboardResponse(
        stats=DashboardStats(
            used=active_count,
            limit=page_limit,
            remaining=remaining,
        ),
        pages=dashboard_pages,
    )
