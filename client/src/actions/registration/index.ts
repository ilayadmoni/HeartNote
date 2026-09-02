"use server";

/**
 * Registration Server Action
 * registerUser – 3-step registration logic:
 *
 *   1. Banned check   → explicit "invalid email" error
 *   2. Existing user  → generic success + "already have account" email via Resend
 *   3. New user       → create account + generic success
 *
 * SEC-2: Steps 2 & 3 return the SAME generic success string
 *   so attackers can't enumerate registered emails.
 *   Only banned emails get an explicit rejection.
 * SEC-HIGH-1: Uses logger for PII-safe logging.
 * SEC-HIGH-2: CSRF origin validation for state-changing operation.
 * SEC-CRIT-2: Redis-based rate limiting for serverless environments.
 */

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";
import { validateOrigin } from "@/lib/utils/csrf";
import { registrationLimiter } from "@/lib/utils/rate-limiters";
import { HAPPY_AVATAR_OPTIONS } from "@/components/profile/types";
import { logAudit } from "@/lib/audit-logger";
import { RegisterFormSchema } from "@/lib/validations/auth";
import { createProfileForUser } from "@/lib/auth/onboarding";
import { createVerificationToken } from "@/lib/auth/tokens";
import { sendVerificationEmail, sendAlreadyRegisteredEmail } from "@/lib/email/authEmails";
import { getActionT } from "@/lib/i18n/server";
import { getClientIp, mapRegistrationZodError } from "./helpers";

export interface RegistrationResult {
  success?: string;
  error?: string;
}

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  dateOfBirth?: string,
): Promise<RegistrationResult> {
  const t = await getActionT("errors");
  try {
    /* ── SEC-HIGH-2: CSRF validation ─────────────────────────────── */
    if (!await validateOrigin()) {
      logger.warn("[registerUser] CSRF validation failed");
      return { error: t("csrf.invalidRequest") };
    }

    /* ── SEC-CRIT-2: Redis rate limiting ─────────────────────────── */
    const clientIp = await getClientIp();
    const rateLimitResult = await registrationLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      logger.warn("[registerUser] Rate limited", {
        ip: clientIp,
        remaining: rateLimitResult.remaining,
      });
      return { error: t("registration.rateLimited") };
    }

    /* ── Zod validation ──────────────────────────────────────────── */
    const formParsed = RegisterFormSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
    });

    if (!formParsed.success) {
      return { error: await mapRegistrationZodError(formParsed.error.issues[0], t) };
    }

    const {
      firstName: fn,
      lastName: ln,
      email: trimmedEmail,
      password: validPassword,
      dateOfBirth: dob,
    } = formParsed.data;

    const genericSuccess = t("registration.genericSuccess");

    /* ── Step 1: Banned check → explicit error ───────────────────── */
    const banned = await prisma.bannedUser.findUnique({ where: { email: trimmedEmail } });
    if (banned) {
      logger.info("[registerUser] Banned email rejected", { email: trimmedEmail });
      return { error: t("registration.bannedEmail") };
    }

    /* ── Step 2: Existing user → generic success + notify email ──── */
    const existingUser = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existingUser) {
      logger.info("[registerUser] Existing user — sending notification", {
        email: trimmedEmail,
      });
      const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.heartnote.co.il"}/?modal=login`;
      await sendAlreadyRegisteredEmail(trimmedEmail, loginUrl);
      return { success: genericSuccess };
    }

    /* ── Step 3: New user → create account ───────────────────────── */
    const defaultAvatar =
      HAPPY_AVATAR_OPTIONS[Math.floor(Math.random() * HAPPY_AVATAR_OPTIONS.length)].url;
    const passwordHash = await bcrypt.hash(validPassword, 12);

    let newUserId: string;
    try {
      const user = await prisma.user.create({
        data: { email: trimmedEmail, name: `${fn} ${ln}`.trim(), passwordHash },
      });
      newUserId = user.id;
      await createProfileForUser({
        userId: user.id,
        email: trimmedEmail,
        firstName: fn,
        lastName: ln,
        avatarUrl: defaultAvatar,
        dateOfBirth: dob ? new Date(dob) : null,
      });
    } catch (err) {
      logger.error("[registerUser] User creation failed", { error: err });
      return { error: t("registration.internal") };
    }

    const verifyToken = await createVerificationToken(trimmedEmail, "email_verification");
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/verify?token=${verifyToken}`;
    await sendVerificationEmail(trimmedEmail, verifyUrl);

    await logAudit({
      eventType: "user.registered",
      userId: newUserId,
      metadata: { email: trimmedEmail, first_name: fn, last_name: ln },
    });

    return { success: genericSuccess };
  } catch (err) {
    // SEC: Log full error server-side, return generic message to client
    logger.error("[registerUser] Unexpected error", { error: err });
    return { error: t("registration.internal") };
  }
}
