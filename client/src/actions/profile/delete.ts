/**
 * Profile DELETE Action
 *
 * DELETE /profile/me → deleteMyAccount()
 *
 * Permanently deletes the authenticated user's account.
 * Uses admin-level auth deletion which cascades to the profiles row
 * (ON DELETE CASCADE on profiles.id → auth.users.id).
 */

"use server";

import { createClient } from "@/lib/supabase/server";

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
