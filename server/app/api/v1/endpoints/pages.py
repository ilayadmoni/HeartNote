"""
Pages API Endpoint
Handles creation and retrieval of user-generated pages with business logic limits.

Security: Authenticated endpoints use ``get_rls_client`` so that every Supabase
query runs under the user's JWT and Postgres RLS is enforced.
"""

from datetime import datetime, timedelta, timezone
from typing import Any
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from supabase import Client

from app.core import CurrentUser, get_settings, verify_user, get_rls_client
from app.core.color_palette import ALLOWED_COLORS
from app.db.supabase import get_user_supabase_client, get_admin_supabase_client

router = APIRouter(redirect_slashes=True)

# Maximum length for a URL stored in custom_settings (guard against base64)
MAX_URL_LENGTH = 2048


# =============================================================================
# VALIDATION HELPERS
# =============================================================================

def validate_custom_settings(
    custom_settings: dict[str, Any],
    config_schema: dict[str, Any],
) -> list[str]:
    """
    Validate custom_settings against the template's config_schema.
    Returns a list of validation error strings (empty = valid).

    Key rules:
      - Fields of type "color" must be in the ALLOWED_COLORS palette.
      - Fields of type "image_url" must be a valid-length URL (not base64).
    """
    errors: list[str] = []
    for field_key, schema_def in config_schema.items():
        if not isinstance(schema_def, dict):
            continue
        field_type = schema_def.get("type")

        # Color validation
        if field_type == "color":
            value = custom_settings.get(field_key)
            if value is None:
                continue
            if not isinstance(value, str) or value.upper() not in ALLOWED_COLORS:
                errors.append(
                    f"Field '{field_key}' value '{value}' is not in the allowed color palette."
                )

        # Image URL validation — reject base64 blobs
        if field_type == "image_url":
            value = custom_settings.get(field_key)
            if value is None or value == "":
                continue
            if not isinstance(value, str):
                errors.append(f"Field '{field_key}' must be a string URL.")
                continue
            if len(value) > MAX_URL_LENGTH:
                errors.append(
                    f"Field '{field_key}' value is too long ({len(value)} chars). "
                    f"Max {MAX_URL_LENGTH}. Do not embed base64 data."
                )
            if value.startswith("data:"):
                errors.append(
                    f"Field '{field_key}' must be a URL, not an inline data URI."
                )

    return errors


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class CreatePageRequest(BaseModel):
    """Request to create a new page"""
    template_id: str
    custom_settings: dict[str, Any]


class CreatePageResponse(BaseModel):
    """Response after creating a page"""
    id: str
    route_slug: str
    expires_at: str


class PageResponse(BaseModel):
    """Public page data response"""
    id: str
    slug: str
    template_key: str
    template_title: str
    content_data: dict[str, Any]
    expires_at: str | None
    created_at: str


class PageListItem(BaseModel):
    """Page item for listing user's pages"""
    id: str
    route_slug: str
    title: str | None
    template_name: str
    expires_at: str | None
    view_count: int
    created_at: str


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.post("", response_model=CreatePageResponse)
async def create_page(
    request: CreatePageRequest,
    current_user: CurrentUser = Depends(verify_user),
    supabase: Client = Depends(get_rls_client),
):
    """
    Create a new page.
    
    - Checks active page limit (MAX_ACTIVE_PAGES)
    - Enforces per-template subscription policies (allowed_subscriptions)
    - Calculates expiry from template.time_expired_config[user_tier]
    - Validates image URLs are not base64 blobs
    - All queries run under the user's JWT (RLS enforced)
    """
    settings = get_settings()

    # 1. Check active page limit
    active_count_result = supabase.table("user_pages").select(
        "id", count="exact"
    ).eq(
        "user_id", current_user.id
    ).eq(
        "is_deleted", False
    ).gt(
        "expires_at", datetime.now(timezone.utc).isoformat()
    ).execute()

    active_count = active_count_result.count or 0

    if active_count >= settings.max_active_pages:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="QUOTA_EXCEEDED",
        )

    # 2. Get template info (include new policy columns)
    template_result = supabase.table("templates").select(
        "id, name_he, is_premium, config_schema, allowed_subscriptions, time_expired_config"
    ).eq("id", request.template_id).single().execute()

    if not template_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    template = template_result.data

    # 3. Validate custom_settings against config_schema (color + image_url checks)
    config_schema = template.get("config_schema", {})
    validation_errors = validate_custom_settings(request.custom_settings, config_schema)
    if validation_errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation errors: {'; '.join(validation_errors)}",
        )

    # 4. Per-template subscription check
    # Fetch user profile to get subscription tier
    profile_result = supabase.table("profiles").select(
        "subscription_type"
    ).eq("id", current_user.id).single().execute()

    user_tier = "free"
    if profile_result.data:
        user_tier = profile_result.data.get("subscription_type", "free")

    # allowed_subscriptions is stored as JSONB array: ["free", "pro", "premium"]
    allowed_subs_raw = template.get("allowed_subscriptions")
    if isinstance(allowed_subs_raw, list):
        allowed_subs = allowed_subs_raw
    elif isinstance(allowed_subs_raw, str):
        import json
        try:
            allowed_subs = json.loads(allowed_subs_raw)
        except (json.JSONDecodeError, TypeError):
            allowed_subs = ["free", "pro", "premium"]
    else:
        allowed_subs = ["free", "pro", "premium"]

    if user_tier not in allowed_subs:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="TEMPLATE_NOT_ALLOWED",
        )

    # 5. Calculate expiry from per-template config (falls back to global setting)
    time_expired_config = template.get("time_expired_config") or {}
    expiry_seconds = time_expired_config.get(user_tier)
    if expiry_seconds is not None:
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=int(expiry_seconds))
    else:
        # Fallback to global setting
        expires_at = datetime.now(timezone.utc) + timedelta(hours=settings.page_expiry_hours)

    # 6. Generate slug and insert page
    route_slug = secrets.token_urlsafe(6)  # ~8 chars

    page_result = supabase.table("user_pages").insert({
        "user_id": current_user.id,
        "template_id": request.template_id,
        "route_slug": route_slug,
        "title": template.get("name_he", "כרטיס"),
        "custom_settings": request.custom_settings,
        "is_published": True,
        "expires_at": expires_at.isoformat(),
    }).execute()

    if not page_result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create page",
        )

    page = page_result.data[0]

    # 7. Log action
    try:
        supabase.table("user_actions").insert({
            "user_id": current_user.id,
            "action_type": "page_created",
            "resource_type": "page",
            "resource_id": page["id"],
            "metadata": {
                "template_id": request.template_id,
                "user_tier": user_tier,
            },
        }).execute()
    except Exception:
        pass  # Non-critical, don't fail the request

    return CreatePageResponse(
        id=page["id"],
        route_slug=page["route_slug"],
        expires_at=page["expires_at"],
    )


@router.get("/my", response_model=list[PageListItem])
async def get_my_pages(
    current_user: CurrentUser = Depends(verify_user),
    supabase: Client = Depends(get_rls_client),
):
    """Get current user's pages (RLS enforced)"""

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

    pages = []
    for page in result.data or []:
        template = page.get("templates", {})
        pages.append(PageListItem(
            id=page["id"],
            route_slug=page["route_slug"],
            title=page.get("title"),
            template_name=template.get("name_he", "תבנית"),
            expires_at=page.get("expires_at"),
            view_count=page.get("view_count", 0),
            created_at=page["created_at"],
        ))

    return pages


@router.get("/{slug}", response_model=PageResponse)
async def get_page(slug: str):
    """
    Get a page by slug (PUBLIC endpoint).
    
    Uses anon-key client (no user token).  RLS policies on user_pages
    should allow SELECT for published pages via an anon role policy.
    """
    from app.core.config import get_settings as _get_settings
    _settings = _get_settings()
    from supabase import create_client
    supabase = create_client(_settings.supabase_url, _settings.supabase_anon_key)

    # Fetch page with template info
    result = supabase.table("user_pages").select(
        "id, route_slug, title, custom_settings, expires_at, is_deleted, created_at, "
        "templates!inner(component_key, name_he)"
    ).eq("route_slug", slug).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found",
        )

    page = result.data[0]
    template = page.get("templates", {})

    # Check if deleted
    if page.get("is_deleted"):
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="This page has been deleted",
        )

    # Check if expired
    if page.get("expires_at"):
        expires_at_str = page["expires_at"]
        if "Z" in expires_at_str:
            expires_at = datetime.fromisoformat(expires_at_str.replace("Z", "+00:00"))
        else:
            expires_at = datetime.fromisoformat(expires_at_str)

        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="This page has expired",
            )

    # Convert component_key to template_key format (DateInvite -> date-invite)
    component_key = template.get("component_key", "")
    template_key = ""
    for i, char in enumerate(component_key):
        if i > 0 and char.isupper():
            template_key += "-"
        template_key += char.lower()

    # Increment view count (fire and forget)
    try:
        supabase.table("user_pages").update({
            "view_count": page.get("view_count", 0) + 1
        }).eq("id", page["id"]).execute()
    except Exception:
        pass

    return PageResponse(
        id=page["id"],
        slug=page["route_slug"],
        template_key=template_key,
        template_title=template.get("name_he") or page.get("title") or "כרטיס",
        content_data=page.get("custom_settings", {}),
        expires_at=page.get("expires_at"),
        created_at=page["created_at"],
    )


@router.delete("/{page_id}")
async def delete_page(
    page_id: str,
    current_user: CurrentUser = Depends(verify_user),
    supabase: Client = Depends(get_rls_client),
):
    """Soft delete a page (owner only, RLS enforced)"""

    # Verify ownership
    result = supabase.table("user_pages").select("id").eq(
        "id", page_id
    ).eq(
        "user_id", current_user.id
    ).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found",
        )

    # Soft delete
    supabase.table("user_pages").update({
        "is_deleted": True
    }).eq("id", page_id).execute()

    # Log action
    try:
        supabase.table("user_actions").insert({
            "user_id": current_user.id,
            "action_type": "page_deleted",
            "resource_type": "page",
            "resource_id": page_id,
        }).execute()
    except Exception:
        pass

    return {"message": "Page deleted successfully"}
