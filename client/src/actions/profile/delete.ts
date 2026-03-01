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

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function deleteMyAccount(): Promise<
  { success: true } | { error: string; status: number }
> {
  try {
    console.log("[deleteMyAccount] Starting account deletion...");
    
    // Regular client — only used to identify the caller & sign out
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[deleteMyAccount] Auth error or no user:", authError);
      return { error: "Unauthorized", status: 401 };
    }

    console.log(`[deleteMyAccount] Deleting user: ${user.id}, email: ${user.email}`);

    // Service-role client — bypasses RLS for admin operations
    let admin;
    try {
      admin = createAdminClient();
    } catch (err) {
      console.error(
        "[deleteMyAccount] Failed to create admin client:",
        err instanceof Error ? err.message : String(err)
      );
      return {
        error: "Account deletion is not configured. Contact support.",
        status: 500,
      };
    }

    // --- 1. Ban the email permanently ---
    console.log(`[deleteMyAccount] Banning email: ${user.email}`);
    const { error: banError } = await admin
      .from("banned_users")
      .upsert(
        { email: user.email!, reason: "self_deletion" },
        { onConflict: "email" },
      );

    if (banError) {
      console.error("[deleteMyAccount] Ban insert failed:", banError);
      return {
        error: `Failed to ban email: ${banError.message}`,
        status: 500,
      };
    }

    console.log("[deleteMyAccount] Email banned successfully");

    // --- 2. Delete the auth user (cascades to profiles + user_pages) ---
    console.log(`[deleteMyAccount] Deleting auth user: ${user.id}`);
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      // Rollback the ban record if auth deletion failed
      console.error("[deleteMyAccount] Auth delete failed:", deleteError);
      await admin.from("banned_users").delete().eq("email", user.email!);
      return {
        error: `Failed to delete account: ${deleteError.message}`,
        status: 500,
      };
    }

    console.log("[deleteMyAccount] Auth user deleted successfully");

    // --- 3. Sign out current session ---
    await supabase.auth.signOut();
    console.log("[deleteMyAccount] Session signed out. Deletion complete.");

    return { success: true };
  } catch (e) {
    console.error(
      "[deleteMyAccount] Unexpected error:",
      e instanceof Error ? e.message : String(e),
      e
    );
    return {
      error: `Failed to delete account: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}
