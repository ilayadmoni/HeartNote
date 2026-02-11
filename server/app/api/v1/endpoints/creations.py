"""
Creations API Endpoint
Handles creation of user greeting cards and retrieval.
Aligned with the new `creations` table schema (005_destructive_reset).

Security: Authenticated endpoints use ``get_rls_client`` so every Supabase
query runs under the user's JWT (Postgres RLS enforced).
"""

from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from supabase import Client

from app.core import CurrentUser, get_settings, verify_user, get_rls_client
from app.core.color_palette import ALLOWED_COLORS

router = APIRouter()

# Maximum length for a URL stored in metadata (guard against base64)
MAX_URL_LENGTH = 2048


# =============================================================================
# VALIDATION HELPERS
# =============================================================================

def validate_metadata(
    metadata: dict[str, Any],
    config_schema: dict[str, Any],
) -> list[str]:
    """
    Validate metadata against the template's config_schema.
    Returns a list of validation error strings (empty = valid).
    """
    errors: list[str] = []
    fields = config_schema.get("fields", [])

    for field_def in fields:
        if not isinstance(field_def, dict):
            continue

        key = field_def.get("key", "")
        field_type = field_def.get("type", "")
        value = metadata.get(key)

        # Required check
        if field_def.get("required") and (value is None or value == "" or value == []):
            errors.append(f"Field '{key}' is required.")
            continue

        if value is None:
            continue

        # Color validation
        if field_type == "color":
            if not isinstance(value, str) or value.upper() not in ALLOWED_COLORS:
                errors.append(
                    f"Field '{key}' value '{value}' is not in the allowed color palette."
                )

        # Image URL validation — reject base64 blobs
        if field_type == "image_url":
            if not isinstance(value, str):
                errors.append(f"Field '{key}' must be a string URL.")
            elif len(value) > MAX_URL_LENGTH:
                errors.append(
                    f"Field '{key}' value is too long ({len(value)} chars). "
                    f"Max {MAX_URL_LENGTH}. Do not embed base64 data."
                )
            elif value.startswith("data:"):
                errors.append(
                    f"Field '{key}' must be a URL, not an inline data URI."
                )

    return errors


# =============================================================================
# REQUEST / RESPONSE MODELS
# =============================================================================

class CreateCreationRequest(BaseModel):
    """Request to create a new creation (greeting card)."""
    template_id: str
    metadata: dict[str, Any]


class CreateCreationResponse(BaseModel):
    """Response after creating a creation."""
    id: str
    expires_at: str | None


class CreationListItem(BaseModel):
    """Creation item for listing user's creations."""
    id: str
    template_slug: str
    template_name: str
    is_paid: bool | None
    expires_at: str | None
    is_deleted: bool
    created_at: str


class CreationDetailResponse(BaseModel):
    """Public creation detail response."""
    id: str
    template_slug: str
    template_name: str
    metadata: dict[str, Any]
    is_paid: bool | None
    expires_at: str | None
    created_at: str


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.post("", response_model=CreateCreationResponse)
async def create_creation(
    request: CreateCreationRequest,
    current_user: CurrentUser = Depends(verify_user),
    supabase: Client = Depends(get_rls_client),
):
    """
    Create a new creation (greeting card).

    - Fetches template to get config_schema & expiration_policy
    - Validates metadata against config_schema
    - Checks creations_left quota based on user tier
    - Decrements creations_left inside a transaction-like sequence
    - Calculates expires_at from template expiration_policy
    - Inserts into creations table
    """
    settings = get_settings()

    # 1. Get template info
    template_result = (
        supabase.table("templates")
        .select("id, slug, name, is_premium, config_schema, expiration_policy")
        .eq("id", request.template_id)
        .eq("is_active", True)
        .single()
        .execute()
    )

    if not template_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    template = template_result.data

    # 2. Validate metadata against config_schema
    config_schema = template.get("config_schema") or {}
    validation_errors = validate_metadata(request.metadata, config_schema)
    if validation_errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation errors: {'; '.join(validation_errors)}",
        )

    # 3. Get user profile to check quota
    profile_result = (
        supabase.table("profiles")
        .select("subscription_tier, creations_count, creations_left_free, creations_left_pro")
        .eq("id", current_user.id)
        .single()
        .execute()
    )

    if not profile_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete registration.",
        )

    profile = profile_result.data
    user_tier = profile.get("subscription_tier", "free")

    # 4. Premium template check
    if template.get("is_premium", False) and user_tier == "free":
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="TEMPLATE_NOT_ALLOWED",
        )

    # 5. Check creations_left quota
    if user_tier == "free":
        creations_left = profile.get("creations_left_free", 0)
        if creations_left <= 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="QUOTA_EXCEEDED",
            )
    elif user_tier == "premium":
        creations_left = profile.get("creations_left_pro")
        # NULL means unlimited for premium
        if creations_left is not None and creations_left <= 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="QUOTA_EXCEEDED",
            )

    # 6. Calculate expiry
    is_paid = user_tier == "premium"
    expiration_policy = template.get("expiration_policy") or {}
    if is_paid:
        expiry_days = expiration_policy.get("paid_days", 14)
    else:
        expiry_days = expiration_policy.get("free_days", 1)

    expires_at = datetime.now(timezone.utc) + timedelta(days=int(expiry_days))

    # 7. Insert creation
    creation_result = (
        supabase.table("creations")
        .insert({
            "user_id": current_user.id,
            "template_id": request.template_id,
            "metadata": request.metadata,
            "is_paid": is_paid,
            "expires_at": expires_at.isoformat(),
        })
        .execute()
    )

    if not creation_result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create card",
        )

    creation = creation_result.data[0]

    # 8. Decrement creations_left and increment creations_count
    update_dict: dict[str, Any] = {
        "creations_count": (profile.get("creations_count", 0) + 1),
    }
    if user_tier == "free":
        update_dict["creations_left_free"] = max(profile.get("creations_left_free", 0) - 1, 0)
    elif user_tier == "premium" and profile.get("creations_left_pro") is not None:
        update_dict["creations_left_pro"] = max(profile.get("creations_left_pro", 0) - 1, 0)

    supabase.table("profiles").update(update_dict).eq("id", current_user.id).execute()

    return CreateCreationResponse(
        id=creation["id"],
        expires_at=creation.get("expires_at"),
    )


@router.get("/my", response_model=list[CreationListItem])
async def get_my_creations(
    current_user: CurrentUser = Depends(verify_user),
    supabase: Client = Depends(get_rls_client),
):
    """Get current user's creations (RLS enforced)."""
    result = (
        supabase.table("creations")
        .select("id, is_paid, expires_at, is_deleted, created_at, templates!inner(slug, name)")
        .eq("user_id", current_user.id)
        .eq("is_deleted", False)
        .order("created_at", desc=True)
        .execute()
    )

    items = []
    for c in result.data or []:
        tmpl = c.get("templates") or {}
        items.append(CreationListItem(
            id=c["id"],
            template_slug=tmpl.get("slug", ""),
            template_name=tmpl.get("name", "כרטיס"),
            is_paid=c.get("is_paid"),
            expires_at=c.get("expires_at"),
            is_deleted=c.get("is_deleted", False),
            created_at=c["created_at"],
        ))

    return items


@router.get("/{creation_id}", response_model=CreationDetailResponse)
async def get_creation(creation_id: str):
    """
    Get a creation by ID (PUBLIC endpoint for shared links).
    Uses anon client — RLS allows SELECT on non-deleted creations.
    """
    from supabase import create_client
    settings = get_settings()
    supabase = create_client(settings.supabase_url, settings.supabase_anon_key)

    result = (
        supabase.table("creations")
        .select("id, metadata, is_paid, expires_at, is_deleted, created_at, templates!inner(slug, name)")
        .eq("id", creation_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creation not found",
        )

    c = result.data

    if c.get("is_deleted"):
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="This creation has been deleted",
        )

    # Check expiry
    if c.get("expires_at"):
        exp_str = c["expires_at"]
        try:
            if "Z" in exp_str:
                exp_dt = datetime.fromisoformat(exp_str.replace("Z", "+00:00"))
            else:
                exp_dt = datetime.fromisoformat(exp_str)
            if exp_dt < datetime.now(timezone.utc):
                raise HTTPException(
                    status_code=status.HTTP_410_GONE,
                    detail="This creation has expired",
                )
        except (ValueError, TypeError):
            pass

    tmpl = c.get("templates") or {}

    return CreationDetailResponse(
        id=c["id"],
        template_slug=tmpl.get("slug", ""),
        template_name=tmpl.get("name", "כרטיס"),
        metadata=c.get("metadata") or {},
        is_paid=c.get("is_paid"),
        expires_at=c.get("expires_at"),
        created_at=c["created_at"],
    )


@router.delete("/{creation_id}")
async def delete_creation(
    creation_id: str,
    current_user: CurrentUser = Depends(verify_user),
    supabase: Client = Depends(get_rls_client),
):
    """Soft delete a creation (owner only, RLS enforced)."""
    result = (
        supabase.table("creations")
        .select("id")
        .eq("id", creation_id)
        .eq("user_id", current_user.id)
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creation not found",
        )

    supabase.table("creations").update({"is_deleted": True}).eq("id", creation_id).execute()

    return {"message": "Creation deleted successfully"}
