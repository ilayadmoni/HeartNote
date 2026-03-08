/**
 * Profile DELETE Action
 *
 * deleteMyAccount()
 *
 * 1. Records the email in public.banned_users (persists after cascade).
 * 2. Deletes the auth user via Supabase Admin API.
 *    The ON DELETE CASCADE on profiles.id → auth.users.id automatically
 *    removes the profile and all related rows.
 * 3. Signs the user out so the client session is invalidated.
 *
 * A BEFORE INSERT trigger on auth.users (see migration 016) prevents
 * any future sign-up from the same email address.
 */

"use server";

import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { createAdminClient } from "@/lib/supabase/admin";

export async function deleteMyAccount(): Promise<ActionResult<null>> {
  return protectedAction(async (user, supabase) => {
    console.log(`[deleteMyAccount] Deleting user: ${user.id}, email: ${user.email}`);

    // Service-role client — bypasses RLS for admin operations
    let admin;
    try {
      admin = createAdminClient();
    } catch (err) {
      console.error("[deleteMyAccount] Failed to create admin client:", err);
      throw new ActionError(
        "Account deletion is not configured. Contact support.",
        500,
      );
    }

    // --- 1. Ban the email permanently ---
    const { error: banError } = await admin
      .from("banned_users")
      .upsert(
        { email: user.email!, reason: "self_deletion" },
        { onConflict: "email" },
      );

    if (banError) {
      console.error("[deleteMyAccount] Ban insert failed:", banError);
      throw new ActionError(`Failed to ban email: ${banError.message}`, 500);
    }

    // --- 2. Delete the auth user (cascades to profiles + user_pages) ---
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      // Rollback the ban record if auth deletion failed
      await admin.from("banned_users").delete().eq("email", user.email!);
      throw new ActionError(
        `Failed to delete account: ${deleteError.message}`,
        500,
      );
    }

    // --- 3. Sign out current session ---
    await supabase.auth.signOut();
    console.log("[deleteMyAccount] Deletion complete.");

    return null;
  });
}
