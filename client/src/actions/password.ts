"use server";

/**
 * Password Server Actions
 * ───────────────────────
 * requestPasswordReset – sends recovery email with:
 *   • Redis-based IP rate limiting (3 attempts per 15 min)
 *   • banned_users check (silent abort)
 *   • 3-strike auto-ban via password_reset_attempts table
 *   • Anti-enumeration: always returns the same generic success string
 *
 * updatePassword – verifies the emailed token and saves the new password.
 *
 * SEC-2 COMPLIANT: All detailed errors are logged server-side only.
 *   Client responses use generic Hebrew strings — no internal details leak.
 * SEC-HIGH-1: Uses logger for PII-safe logging.
 * SEC-CRIT-2: Uses Redis rate limiting for serverless environments.
 */

import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";
import { validateOrigin } from "@/lib/utils/csrf";
import { passwordResetLimiter } from "@/lib/utils/rate-limiters";
import { logAudit } from "@/lib/audit-logger";
import { createVerificationToken, consumeVerificationToken } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/email/authEmails";

interface ActionResult {
  success?: string;
  error?: string;
}

const MAX_RESET_ATTEMPTS = 3;
const RATE_WINDOW_HOURS = 24;

/** Generic success message — shown regardless of email status */
const GENERIC_SUCCESS =
  "אם הכתובת רשומה ופעילה במערכת, נשלח אליך קישור לאיפוס הסיסמה. אם אינך רואה אותו בתיבת הדואר הנכנס, בדוק גם בתיקיית הספאם.";

const ERR_INTERNAL = "אירעה שגיאה פנימית במערכת. אנא נסה שוב מאוחר יותר.";
const ERR_RESET_PROCESS = "שגיאה בתהליך איפוס הסיסמה. ייתכן שהקישור פג תוקף.";
const ERR_RATE_LIMITED = "יותר מדי ניסיונות. אנא נסה שוב בעוד 15 דקות.";

/** Extract client IP from request headers */
async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    headerStore.get("cf-connecting-ip") || // Cloudflare
    "unknown"
  );
}

/* ================================================================
 * 1. Request Password Reset
 * ================================================================ */
export async function requestPasswordReset(
  formData: FormData,
): Promise<ActionResult> {
  try {
    if (!await validateOrigin()) {
      logger.warn("[requestPasswordReset] CSRF validation failed");
      return { error: "בקשה לא חוקית. נא לרענן את הדף ולנסות שוב." };
    }

    const email = formData.get("email")?.toString().trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "נא להזין כתובת אימייל תקינה." };
    }

    const clientIp = await getClientIp();
    const rateLimitResult = await passwordResetLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      logger.warn("[requestPasswordReset] Rate limited", {
        ip: clientIp,
        remaining: rateLimitResult.remaining,
      });
      return { error: ERR_RATE_LIMITED };
    }

    // ── Check if email is banned → silent abort ───────────────────────
    const banned = await prisma.bannedUser.findUnique({ where: { email } });
    if (banned) {
      logger.info("[requestPasswordReset] Banned email silently aborted", { email });
      return { success: GENERIC_SUCCESS };
    }

    // ── Count attempts in the last 24 hours (DB-level backup) ───────────
    const windowStart = new Date(Date.now() - RATE_WINDOW_HOURS * 60 * 60 * 1000);
    const attempts = await prisma.passwordResetAttempt.count({
      where: { email, createdAt: { gte: windowStart } },
    });

    // ── 3-strike auto-ban ─────────────────────────────────────────────
    if (attempts >= MAX_RESET_ATTEMPTS) {
      logger.warn("[requestPasswordReset] Auto-banning after max attempts", { email, attempts });
      await prisma.bannedUser.upsert({
        where: { email },
        create: { email, reason: "password_reset_abuse" },
        update: { reason: "password_reset_abuse" },
      });
      return { success: GENERIC_SUCCESS };
    }

    // ── Record this attempt ───────────────────────────────────────────
    await prisma.passwordResetAttempt.create({ data: { email, ipAddress: clientIp } });

    // ── Check if user actually exists (silent if not) ─────────────────
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      // Also silent for OAuth-only accounts — nothing to reset.
      return { success: GENERIC_SUCCESS };
    }

    // ── Send recovery email ───────────────────────────────────────────
    const token = await createVerificationToken(email, "password_reset");
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/?modal=reset-password&token=${token}`;
    await sendPasswordResetEmail(email, resetUrl);

    await logAudit({
      eventType: "user.password_reset_requested",
      userId: null,
      metadata: { email, attempts },
    });

    return { success: GENERIC_SUCCESS };
  } catch (err) {
    logger.error("[requestPasswordReset] Unexpected error", { error: err });
    return { error: ERR_INTERNAL };
  }
}

/* ================================================================
 * 2. Update Password (after clicking the recovery link)
 * ================================================================ */
export async function updatePassword(
  token: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    if (!(await validateOrigin())) {
      logger.warn("[updatePassword] CSRF validation failed");
      return { error: "בקשה לא חוקית. נא לרענן את הדף ולנסות שוב." };
    }

    const newPassword = formData.get("password")?.toString();
    if (!newPassword || newPassword.length < 8) {
      return { error: "הסיסמה חייבת להכיל לפחות 8 תווים." };
    }

    const email = await consumeVerificationToken(token, "password_reset");
    if (!email) {
      return { error: ERR_RESET_PROCESS };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    try {
      const user = await prisma.user.update({ where: { email }, data: { passwordHash } });
      await prisma.profile.update({ where: { id: user.id }, data: { resetAttempts: 0 } });
      await passwordResetLimiter.reset(await getClientIp());
    } catch (err) {
      logger.error("[updatePassword] Update failed", { error: err });
      return { error: ERR_RESET_PROCESS };
    }

    return { success: "הסיסמה עודכנה בהצלחה!" };
  } catch (err) {
    logger.error("[updatePassword] Unexpected error", { error: err });
    return { error: ERR_RESET_PROCESS };
  }
}
