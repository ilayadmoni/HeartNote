"""
Profile Service
Handles all profile-related database operations via Supabase.
Aligned with the new `profiles` table schema (005_destructive_reset).

Security model:
- Read / update operations receive an RLS-bound client (user's JWT)
  so that Postgres enforces row-level access automatically.
- Account deletion requires admin privileges (auth.admin.delete_user)
  and uses the admin client explicitly.
"""

from datetime import datetime, date
from typing import Optional, Any

from supabase import Client

from app.db.supabase import get_admin_supabase_client
from app.schemas.profile import (
    ProfileResponse,
    ProfileUpdate,
    SubscriptionInfo,
    SubscriptionTier,
)


class ProfileServiceError(Exception):
    """Custom exception for profile service errors."""
    pass


class ProfileService:
    """
    Service for profile CRUD operations via Supabase.

    The caller is responsible for passing the correct ``Client``:
    - user-facing operations → RLS client (``get_user_supabase_client``)
    - admin operations → admin client (``get_admin_supabase_client``)
    """
    
    def __init__(self, client: Client):
        self.client = client
        self.table = "profiles"
    
    # ------------------------------------------------------------------
    # READ
    # ------------------------------------------------------------------

    async def get_profile(self, user_id: str) -> Optional[ProfileResponse]:
        """
        Fetch user profile by Supabase user ID.
        
        Returns:
            ProfileResponse or None if not found
        """
        try:
            response = (
                self.client.table(self.table)
                .select("*")
                .eq("id", user_id)
                .single()
                .execute()
            )
            
            if not response.data:
                return None
            
            data = response.data
            
            # Build subscription info from flat columns
            subscription = SubscriptionInfo(
                tier=SubscriptionTier(data.get("subscription_tier", "free")),
                creations_count=data.get("creations_count", 0),
                creations_left_free=data.get("creations_left_free", 3),
                creations_left_pro=data.get("creations_left_pro"),
                premium_start=self._parse_datetime(data.get("premium_start")),
                premium_expiry=self._parse_datetime(data.get("premium_expiry")),
                is_active=self._is_subscription_active(data),
            )
            
            return ProfileResponse(
                id=data["id"],
                email=data.get("email"),
                first_name=data.get("first_name"),
                last_name=data.get("last_name"),
                date_of_birth=self._parse_date(data.get("date_of_birth")),
                avatar_url=data.get("avatar_url"),
                created_at=self._parse_datetime(data.get("created_at")),
                updated_at=self._parse_datetime(data.get("updated_at")),
                subscription=subscription,
            )
            
        except Exception as e:
            raise ProfileServiceError(f"Failed to fetch profile: {str(e)}")
    
    # ------------------------------------------------------------------
    # UPDATE
    # ------------------------------------------------------------------

    async def update_profile(
        self,
        user_id: str,
        update_data: ProfileUpdate,
    ) -> ProfileResponse:
        """Update user profile (first_name, last_name, avatar_url, date_of_birth)."""
        try:
            update_dict: dict[str, Any] = {}
            
            if update_data.first_name is not None:
                update_dict["first_name"] = update_data.first_name
            if update_data.last_name is not None:
                update_dict["last_name"] = update_data.last_name
            if update_data.date_of_birth is not None:
                update_dict["date_of_birth"] = update_data.date_of_birth.isoformat()
            if update_data.avatar_url is not None:
                update_dict["avatar_url"] = update_data.avatar_url
            
            if not update_dict:
                profile = await self.get_profile(user_id)
                if not profile:
                    raise ProfileServiceError("Profile not found")
                return profile
            
            self.client.table(self.table).update(update_dict).eq("id", user_id).execute()
            
            updated_profile = await self.get_profile(user_id)
            if not updated_profile:
                raise ProfileServiceError("Profile not found after update")
            return updated_profile
            
        except ProfileServiceError:
            raise
        except Exception as e:
            raise ProfileServiceError(f"Failed to update profile: {str(e)}")
    
    # ------------------------------------------------------------------
    # DELETE
    # ------------------------------------------------------------------

    async def delete_account(self, user_id: str) -> bool:
        """
        Delete user account via auth.admin (cascades to profiles).
        Always uses admin client.
        """
        try:
            admin_client = get_admin_supabase_client()
            admin_client.auth.admin.delete_user(user_id)
            return True
        except Exception as e:
            raise ProfileServiceError(f"Failed to delete account: {str(e)}")
    
    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _is_subscription_active(data: dict) -> bool:
        """Check if the user's subscription is still active."""
        tier = data.get("subscription_tier", "free")
        if tier == "free":
            return True
        premium_expiry = data.get("premium_expiry")
        if not premium_expiry:
            return True
        try:
            expiry = datetime.fromisoformat(str(premium_expiry).replace("Z", "+00:00"))
            return expiry > datetime.now(expiry.tzinfo)
        except (ValueError, AttributeError):
            return True
    
    @staticmethod
    def _parse_datetime(dt_str: Optional[str]) -> Optional[datetime]:
        """Parse ISO datetime string."""
        if not dt_str:
            return None
        try:
            return datetime.fromisoformat(str(dt_str).replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            return None
    
    @staticmethod
    def _parse_date(date_str: Optional[str]) -> Optional[date]:
        """Parse ISO date string."""
        if not date_str:
            return None
        try:
            return date.fromisoformat(str(date_str))
        except (ValueError, AttributeError):
            return None
