/**
 * Profile UPDATE Action
 *
 * PATCH /profile/me → updateMyProfile(input)
 */

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ProfileUpdateSchema, type ProfileUpdateInput } from "@/lib/validations";
import type { ProfileResponse } from "@/lib/validations";
import { buildProfileResponse } from "./helpers";

/**
 * Partially updates the authenticated user's profile.
 * Only modifies fields that are explicitly provided.
 * RLS enforces that the user can only update their own row.
 */
export async function updateMyProfile(
  input: ProfileUpdateInput,
): Promise<{ data: ProfileResponse } | { error: string; status: number }> {
  try {
    const parsed = ProfileUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues.map((i) => i.message).join("; "),
        status: 422,
      };
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized", status: 401 };
    }

    // Build update dict – only include provided fields
    const updateDict: Record<string, unknown> = {};
    if (parsed.data.first_name !== undefined) updateDict.first_name = parsed.data.first_name;
    if (parsed.data.last_name !== undefined) updateDict.last_name = parsed.data.last_name;
    if (parsed.data.date_of_birth !== undefined) updateDict.date_of_birth = parsed.data.date_of_birth;
    if (parsed.data.avatar_url !== undefined) updateDict.avatar_url = parsed.data.avatar_url;

    // If nothing to update, just return current profile
    if (Object.keys(updateDict).length === 0) {
      return getMyProfileInternal(supabase, user.id);
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateDict)
      .eq("id", user.id);

    if (updateError) {
      return {
        error: `Failed to update profile: ${updateError.message}`,
        status: 500,
      };
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return getMyProfileInternal(supabase, user.id);
  } catch (e) {
    return {
      error: `Failed to update profile: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

/**
 * Internal re-fetch after update (avoids re-authenticating).
 */
async function getMyProfileInternal(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
): Promise<{ data: ProfileResponse } | { error: string; status: number }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return { error: "Profile not found.", status: 404 };
  }

  return { data: await buildProfileResponse(data, supabase) };
}
