/**
 * Profile GET Actions
 *
 * GET /profile/me → getMyProfile()
 * GET /profile/avatars → getAvatarOptions()
 */

"use server";

import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { type ProfileResponse, AVATAR_OPTIONS } from "@/lib/validations";
import { buildProfileResponse } from "./helpers";

/**
 * Fetches the authenticated user's profile including subscription status.
 * Supabase RLS ensures only the owner row is returned.
 */
export async function getMyProfile(): Promise<ActionResult<ProfileResponse>> {
  return protectedAction(async (user, supabase) => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, email, first_name, last_name, date_of_birth, avatar_url, " +
        "created_at, updated_at, subscription_tier, creations_count_free, " +
        "creations_count_pro, additional_creation_free, additional_creation_pro, " +
        "premium_start, premium_expiry",
      )
      .eq("id", user.id)
      .single();

    if (error || !data) {
      throw new ActionError(
        "Profile not found. Please complete registration.",
        404,
      );
    }

    return buildProfileResponse(data as unknown as Record<string, unknown>, supabase);
  });
}

/**
 * Returns the list of Netflix-style avatar URLs.
 * Public — no auth required.
 */
export async function getAvatarOptions(): Promise<{ avatars: string[] }> {
  return { avatars: [...AVATAR_OPTIONS] };
}
