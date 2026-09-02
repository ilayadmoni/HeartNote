/**
 * Profile DELETE Action
 *
 * deleteMyAccount()
 *
 * 1. Records the email in banned_users (persists after cascade).
 * 2. Deletes the User row. ON DELETE CASCADE on profiles.id -> users.id
 *    automatically removes the profile and all related creations.
 * 3. Signs the user out so the client session is invalidated.
 *
 * The banned_users check in registerUser()/authorizeCredentials() prevents
 * any future sign-up from the same email address.
 *
 * SEC-HIGH-1: Uses logger instead of console for PII-safe logging.
 * SEC-HIGH-2: CSRF origin validation before destructive operation.
 */

"use server";

import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/lib/auth";
import { validateOrigin, csrfError } from "@/lib/utils/csrf";
import { logger } from "@/lib/utils/logger";
import { logAudit } from "@/lib/audit-logger";

export async function deleteMyAccount(): Promise<ActionResult<null>> {
  // SEC-HIGH-2: CSRF protection for destructive action
  if (!await validateOrigin()) {
    return (await csrfError()) as ActionResult<null>;
  }

  return protectedAction(async (user) => {
    logger.info("[deleteMyAccount] Deleting user", {
      userId: user.id.slice(0, 8),
      email: user.email,
    });

    // --- 1. Ban the email permanently, then delete the user (cascades to
    //        profiles + creations). If deletion fails, roll back the ban. ---
    try {
      await prisma.bannedUser.upsert({
        where: { email: user.email },
        create: { email: user.email, reason: "self_deletion" },
        update: { reason: "self_deletion" },
      });
      await prisma.user.delete({ where: { id: user.id } });
    } catch (err) {
      await prisma.bannedUser.deleteMany({ where: { email: user.email } }).catch(() => {});
      logger.error("[deleteMyAccount] Deletion failed", { error: err });
      throw new ActionError("Failed to delete account.", 500);
    }

    await logAudit({
      eventType: "user.account_deleted",
      userId: user.id,
      metadata: { email: user.email, reason: "self_deletion" },
    });

    // --- 2. Sign out current session ---
    await signOut({ redirect: false });
    logger.info("[deleteMyAccount] Deletion complete");

    return null;
  });
}
