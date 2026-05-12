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
import { logAudit } from "@/lib/audit-logger";
import { validateOrigin } from "@/lib/utils/csrf";

/**
 * Partially updates the authenticated user's profile.
 * Only modifies fields that are explicitly provided.
 * RLS enforces that the user can only update their own row.
 */
export async function updateMyProfile(
  input: ProfileUpdateInput,
): Promise<ActionResult<ProfileResponse>> {
  return protectedAction(async (user, supabase) => {
    // ── SEC-HIGH-4: CSRF validation ───────────────────────────────────
    if (!(await validateOrigin())) {
      throw new ActionError("Invalid origin", 403);
    }

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

    const changedFields = Object.keys(updateDict);

    await logAudit({
      eventType: "user.profile_updated",
      userId: user.id,
      metadata: { changed_fields: changedFields },
    });

    if (
      updateDict.first_name !== undefined ||
      updateDict.last_name !== undefined
    ) {
      await logAudit({
        eventType: "user.name_changed",
        userId: user.id,
        metadata: {
          first_name: updateDict.first_name,
          last_name: updateDict.last_name,
        },
      });
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
    .select(
      "id, email, first_name, last_name, date_of_birth, avatar_url, " +
      "created_at, updated_at, subscription_tier, creations_count_free, " +
      "creations_count_pro, additional_creation_free, additional_creation_pro, " +
      "premium_start, premium_expiry",
    )
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new ActionError("Profile not found.", 404);
  }

  return buildProfileResponse(data as unknown as Record<string, unknown>, supabase);
}
