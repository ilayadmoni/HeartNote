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
 *
 * SEC-HIGH-1: Uses logger instead of console for PII-safe logging.
 * SEC-HIGH-2: CSRF origin validation before destructive operation.
 */

"use server";

import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateOrigin, csrfError } from "@/lib/utils/csrf";
import { logger } from "@/lib/utils/logger";

export async function deleteMyAccount(): Promise<ActionResult<null>> {
  // SEC-HIGH-2: CSRF protection for destructive action
  if (!await validateOrigin()) {
    return csrfError() as ActionResult<null>;
  }

  return protectedAction(async (user, supabase) => {
    logger.info("[deleteMyAccount] Deleting user", { 
      userId: user.id.slice(0, 8), 
      email: user.email 
    });

    // Service-role client — bypasses RLS for admin operations
    let admin;
    try {
      admin = createAdminClient();
    } catch (err) {
      logger.error("[deleteMyAccount] Failed to create admin client", { error: err });
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
      logger.error("[deleteMyAccount] Ban insert failed", { error: banError });
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
    logger.info("[deleteMyAccount] Deletion complete");

    return null;
  });
}
