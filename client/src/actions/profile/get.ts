/**
 * Profile GET Actions
 *
 * GET /profile/me → getMyProfile()
 * GET /profile/avatars → getAvatarOptions()
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { type ProfileResponse, AVATAR_OPTIONS } from "@/lib/validations";
import { buildProfileResponse } from "./helpers";

/**
 * Fetches the authenticated user's profile including subscription status.
 * Supabase RLS ensures only the owner row is returned.
 */
export async function getMyProfile(): Promise<
  { data: ProfileResponse } | { error: string; status: number }
> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized", status: 401 };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      return {
        error: "Profile not found. Please complete registration.",
        status: 404,
      };
    }

    return { data: buildProfileResponse(data) };
  } catch (e) {
    return {
      error: `Failed to fetch profile: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

/**
 * Returns the list of Netflix-style avatar URLs.
 * Public — no auth required.
 */
export async function getAvatarOptions(): Promise<{ avatars: string[] }> {
  return { avatars: [...AVATAR_OPTIONS] };
}
