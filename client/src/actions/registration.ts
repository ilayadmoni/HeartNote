"use server";

/**
 * Registration Server Action
 * registerUser – 3-step registration logic:
 *
 *   1. Banned check   → explicit error "מייל לא חוקי"
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

import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";
import { validateOrigin } from "@/lib/utils/csrf";
import { registrationLimiter } from "@/lib/utils/rate-limiter";
import { HAPPY_AVATAR_OPTIONS } from "@/components/profile/types";
import { logAudit } from "@/lib/audit-logger";
import { RegisterFormSchema } from "@/lib/validations/auth";
import { createProfileForUser } from "@/lib/auth/onboarding";
import { createVerificationToken } from "@/lib/auth/tokens";
import { sendVerificationEmail } from "@/lib/email/authEmails";

interface RegistrationResult {
  success?: string;
  error?: string;
}

/** Shown for both existing-user and new-user outcomes */
const GENERIC_SUCCESS =
  "אם האימייל תקין, שלחנו אליכם הודעה. אם אינכם רואים אותה בתיבת הנכנס, בדקו גם בתיקיית הספאם/דואר זבל.";

const ERR_INTERNAL =
  "אירעה שגיאה פנימית במערכת. אנא נסו שוב מאוחר יותר.";

const ERR_RATE_LIMITED =
  "יותר מדי ניסיונות הרשמה. אנא נסו שוב מאוחר יותר.";

/** Resend client (lazy init) */
let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!resend && process.env.RESEND_KEY) {
    resend = new Resend(process.env.RESEND_KEY);
  }
  return resend;
}

/** Extract client IP from request headers */
async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}

/** Send "you already have an account" email via Resend */
async function sendAlreadyRegisteredEmail(email: string): Promise<void> {
  const r = getResend();
  if (!r) {
    logger.warn("[registerUser] RESEND_API_KEY not configured — skipping email");
    return;
  }

  try {
    await r.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "HeartNote <noreply@heartnote.co.il>",
      to: email,
      subject: "התחברות לחשבון הקיים שלך",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #faf7f5; padding: 40px 20px; margin: 0;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <h1 style="color: #2e3c52; font-size: 24px; margin: 0 0 16px; text-align: center;">
              🎉יש לך כבר חשבון
            </h1>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
              זיהינו שניסית להירשם עם אימייל זה, אך כבר קיים חשבון פעיל במערכת.
            </p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px; text-align: center;">
              אנא היכנס לחשבון שלך או בצע איפוס סיסמה אם שכחת אותה.
            </p>
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://www.heartnote.co.il"}/?modal=login"
                 style="display: inline-block; background: #2e3c52; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                כניסה לחשבון
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 32px 0 0; text-align: center;">
              אם לא ניסית להירשם, תוכלו להתעלם מהודעה זו.
            </p>
          </div>
        </body>
        </html>
      `,
    });
    logger.info("[registerUser] Sent already-registered email", { email });
  } catch (err) {
    logger.error("[registerUser] Resend email error", { error: err });
    // Non-fatal — continue returning generic success
  }
}

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  dateOfBirth?: string,
): Promise<RegistrationResult> {
  try {
    /* ── SEC-HIGH-2: CSRF validation ─────────────────────────────── */
    if (!await validateOrigin()) {
      logger.warn("[registerUser] CSRF validation failed");
      return { error: "בקשה לא חוקית. נא לרענן את הדף ולנסות שוב." };
    }

    /* ── SEC-CRIT-2: Redis rate limiting ─────────────────────────── */
    const clientIp = await getClientIp();
    const rateLimitResult = await registrationLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      logger.warn("[registerUser] Rate limited", {
        ip: clientIp,
        remaining: rateLimitResult.remaining,
      });
      return { error: ERR_RATE_LIMITED };
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
      const issue = formParsed.error.issues[0];
      const field = String(issue.path[0] ?? "");
      if (field === "email") return { error: "נא להזין כתובת אימייל תקינה." };
      if (field === "password") return { error: issue.message };
      if (field === "firstName" || field === "lastName") return { error: "נא להזין שם פרטי ושם משפחה." };
      return { error: "נא למלא את כל השדות הנדרשים." };
    }

    const {
      firstName: fn,
      lastName: ln,
      email: trimmedEmail,
      password: validPassword,
      dateOfBirth: dob,
    } = formParsed.data;

    /* ── Step 1: Banned check → explicit error ───────────────────── */
    const banned = await prisma.bannedUser.findUnique({ where: { email: trimmedEmail } });
    if (banned) {
      logger.info("[registerUser] Banned email rejected", { email: trimmedEmail });
      return { error: "מייל לא חוקי" };
    }

    /* ── Step 2: Existing user → generic success + notify email ──── */
    const existingUser = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existingUser) {
      logger.info("[registerUser] Existing user — sending notification", {
        email: trimmedEmail,
      });
      await sendAlreadyRegisteredEmail(trimmedEmail);
      return { success: GENERIC_SUCCESS };
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
      return { error: ERR_INTERNAL };
    }

    const verifyToken = await createVerificationToken(trimmedEmail, "email_verification");
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/verify?token=${verifyToken}`;
    await sendVerificationEmail(trimmedEmail, verifyUrl);

    await logAudit({
      eventType: "user.registered",
      userId: newUserId,
      metadata: { email: trimmedEmail, first_name: fn, last_name: ln },
    });

    return { success: GENERIC_SUCCESS };
  } catch (err) {
    // SEC: Log full error server-side, return generic message to client
    logger.error("[registerUser] Unexpected error", { error: err });
    return { error: ERR_INTERNAL };
  }
}
