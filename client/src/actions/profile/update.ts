/**
 * Profile UPDATE Action
 *
 * PATCH /profile/me → updateMyProfile(input)
 */

"use server";

import { revalidatePath } from "next/cache";
import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { ProfileUpdateSchema, type ProfileUpdateInput } from "@/lib/validations";
import type { ProfileResponse } from "@/lib/validations";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildProfileResponse } from "./helpers";

/**
 * Partially updates the authenticated user's profile.
 * Only modifies fields that are explicitly provided.
 * RLS enforces that the user can only update their own row.
 */
export async function updateMyProfile(
  input: ProfileUpdateInput,
): Promise<ActionResult<ProfileResponse>> {
  return protectedAction(async (user, supabase) => {
    const parsed = ProfileUpdateSchema.safeParse(input);
    if (!parsed.success) {
      throw new ActionError(
        parsed.error.issues.map((i) => i.message).join("; "),
        422,
      );
    }

    // Build update dict – only include provided fields
    const updateDict: Record<string, unknown> = {};
    if (parsed.data.first_name !== undefined) updateDict.first_name = parsed.data.first_name;
    if (parsed.data.last_name !== undefined) updateDict.last_name = parsed.data.last_name;
    if (parsed.data.date_of_birth !== undefined) updateDict.date_of_birth = parsed.data.date_of_birth;
    if (parsed.data.avatar_url !== undefined) updateDict.avatar_url = parsed.data.avatar_url;

    // If nothing to update, just return current profile
    if (Object.keys(updateDict).length === 0) {
      return fetchProfileInternal(supabase, user.id);
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateDict)
      .eq("id", user.id);

    if (updateError) {
      throw new ActionError(
        `Failed to update profile: ${updateError.message}`,
        500,
      );
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return fetchProfileInternal(supabase, user.id);
  });
}

/**
 * Internal re-fetch after update (avoids re-authenticating).
 */
async function fetchProfileInternal(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileResponse> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new ActionError("Profile not found.", 404);
  }

  return buildProfileResponse(data, supabase);
}
