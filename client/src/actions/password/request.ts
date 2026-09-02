"use server";

/**
 * requestPasswordReset – sends recovery email with:
 *   • Redis-based IP rate limiting (3 attempts per 15 min)
 *   • banned_users check (silent abort)
 *   • 3-strike auto-ban via password_reset_attempts table
 *   • Anti-enumeration: always returns the same generic success string
 *
 * SEC-2 COMPLIANT: All detailed errors are logged server-side only.
 *   Client responses use a translated, generic message — no internal details leak.
 * SEC-HIGH-1: Uses logger for PII-safe logging.
 * SEC-CRIT-2: Uses Redis rate limiting for serverless environments.
 */

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";
import { validateOrigin } from "@/lib/utils/csrf";
import { passwordResetLimiter } from "@/lib/utils/rate-limiters";
import { logAudit } from "@/lib/audit-logger";
import { createVerificationToken } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/email/authEmails";
import { getActionT } from "@/lib/i18n/server";
import { MAX_RESET_ATTEMPTS, RATE_WINDOW_HOURS, getClientIp, type PasswordActionResult } from "./shared";

export async function requestPasswordReset(
  formData: FormData,
): Promise<PasswordActionResult> {
  const t = await getActionT("errors");
  try {
    if (!await validateOrigin()) {
      logger.warn("[requestPasswordReset] CSRF validation failed");
      return { error: t("csrf.invalidRequest") };
    }

    const email = formData.get("email")?.toString().trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: t("password.emailInvalid") };
    }

    const clientIp = await getClientIp();
    const rateLimitResult = await passwordResetLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      logger.warn("[requestPasswordReset] Rate limited", {
        ip: clientIp,
        remaining: rateLimitResult.remaining,
      });
      return { error: t("password.rateLimited") };
    }

    const genericSuccess = t("password.genericSuccess");

    // ── Check if email is banned → silent abort ───────────────────────
    const banned = await prisma.bannedUser.findUnique({ where: { email } });
    if (banned) {
      logger.info("[requestPasswordReset] Banned email silently aborted", { email });
      return { success: genericSuccess };
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
      return { success: genericSuccess };
    }

    // ── Record this attempt ───────────────────────────────────────────
    await prisma.passwordResetAttempt.create({ data: { email, ipAddress: clientIp } });

    // ── Check if user actually exists (silent if not) ─────────────────
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      // Also silent for OAuth-only accounts — nothing to reset.
      return { success: genericSuccess };
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

    return { success: genericSuccess };
  } catch (err) {
    logger.error("[requestPasswordReset] Unexpected error", { error: err });
    return { error: t("password.internal") };
  }
}
