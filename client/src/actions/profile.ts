/**
 * Profile Server Actions
 *
 * Port of:
 *   server/app/api/v1/endpoints/profile.py   (routes)
 *   server/app/services/profile_service.py    (business logic)
 *
 * DB columns (profiles table – 005_destructive_reset.sql):
 *   id, email, first_name, last_name, date_of_birth, avatar_url,
 *   created_at, updated_at, subscription_tier, creations_count,
 *   creations_left_pro, creations_left_free, premium_start, premium_expiry
 */

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  ProfileUpdateSchema,
  type ProfileResponse,
  type ProfileUpdateInput,
  AVATAR_OPTIONS,
} from "@/lib/validations";

// ---------------------------------------------------------------------------
// Helpers (ported from ProfileService._is_subscription_active / _parse_*)
// ---------------------------------------------------------------------------

function isSubscriptionActive(data: Record<string, unknown>): boolean {
  const tier = (data.subscription_tier as string) ?? "free";
  if (tier === "free") return true;

  const premiumExpiry = data.premium_expiry;
  if (!premiumExpiry) return true;

  try {
    const expiryStr = String(premiumExpiry).replace("Z", "+00:00");
    const expiry = new Date(expiryStr);
    return expiry > new Date();
  } catch {
    return true;
  }
}

function buildProfileResponse(
  data: Record<string, unknown>,
): ProfileResponse {
  return {
    id: data.id as string,
    email: (data.email as string) ?? null,
    first_name: (data.first_name as string) ?? null,
    last_name: (data.last_name as string) ?? null,
    date_of_birth: (data.date_of_birth as string) ?? null,
    avatar_url: (data.avatar_url as string) ?? null,
    created_at: (data.created_at as string) ?? null,
    updated_at: (data.updated_at as string) ?? null,
    subscription: {
      tier: ((data.subscription_tier as string) ?? "free") as "free" | "premium",
      creations_count: (data.creations_count as number) ?? 0,
      creations_left_free: (data.creations_left_free as number) ?? 3,
      creations_left_pro: (data.creations_left_pro as number) ?? null,
      premium_start: (data.premium_start as string) ?? null,
      premium_expiry: (data.premium_expiry as string) ?? null,
      is_active: isSubscriptionActive(data),
    },
  };
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * GET /profile/me → getMyProfile()
 *
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
 * PATCH /profile/me → updateMyProfile(input)
 *
 * Partially updates the authenticated user's profile.
 * Only modifies fields that are explicitly provided.
 * RLS enforces that the user can only update their own row.
 */
export async function updateMyProfile(
  input: ProfileUpdateInput,
): Promise<{ data: ProfileResponse } | { error: string; status: number }> {
  try {
    // Validate input with Zod (mirrors Pydantic validation)
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

    // Build update dict – only include provided fields (mirrors Python logic)
    const updateDict: Record<string, unknown> = {};
    if (parsed.data.first_name !== undefined) updateDict.first_name = parsed.data.first_name;
    if (parsed.data.last_name !== undefined) updateDict.last_name = parsed.data.last_name;
    if (parsed.data.date_of_birth !== undefined) updateDict.date_of_birth = parsed.data.date_of_birth;
    if (parsed.data.avatar_url !== undefined) updateDict.avatar_url = parsed.data.avatar_url;

    // If nothing to update, just return current profile
    if (Object.keys(updateDict).length === 0) {
      return getMyProfile();
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

    // Revalidate cached data so header/profile reflect changes instantly
    revalidatePath("/profile");
    revalidatePath("/", "layout");

    // Re-fetch after update (mirrors Python service pattern)
    return getMyProfile();
  } catch (e) {
    return {
      error: `Failed to update profile: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

/**
 * DELETE /profile/me → deleteMyAccount()
 *
 * Permanently deletes the authenticated user's account.
 * Uses admin-level auth deletion which cascades to the profiles row
 * (ON DELETE CASCADE on profiles.id → auth.users.id).
 *
 * NOTE: In the Next.js context we cannot use admin client from the browser.
 * This should call a Supabase Edge Function or a protected API route that
 * uses the service_role key. For now we soft-signal the intent.
 */
export async function deleteMyAccount(): Promise<
  { success: true } | { error: string; status: number }
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

    // Admin deletion requires service_role — call via Supabase Edge Function
    // or a dedicated API route. The anon-key client cannot delete auth users.
    // For reference: admin_client.auth.admin.delete_user(user.id)
    //
    // Workaround: call a server-side admin endpoint or Edge Function.
    // Below we use the admin API directly via fetch as the server action
    // runs server-side and can safely use SUPABASE_SERVICE_ROLE_KEY.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return {
        error: "Account deletion is not configured. Contact support.",
        status: 500,
      };
    }

    const res = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${user.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
      },
    );

    if (!res.ok) {
      return {
        error: `Failed to delete account (status ${res.status})`,
        status: 500,
      };
    }

    return { success: true };
  } catch (e) {
    return {
      error: `Failed to delete account: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

/**
 * GET /profile/avatars → getAvatarOptions()
 *
 * Returns the list of Netflix-style avatar URLs.
 * Public — no auth required.
 */
export async function getAvatarOptions(): Promise<{ avatars: string[] }> {
  return { avatars: [...AVATAR_OPTIONS] };
}
