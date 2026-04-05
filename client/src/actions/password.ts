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
 * updatePassword – saves the new password after clicking the recovery link
 *
 * SEC-2 COMPLIANT: All detailed errors are logged server-side only.
 *   Client responses use generic Hebrew strings — no internal details leak.
 * SEC-HIGH-1: Uses logger for PII-safe logging.
 * SEC-CRIT-2: Uses Redis rate limiting for serverless environments.
 */

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";
import { validateOrigin } from "@/lib/utils/csrf";
import { passwordResetLimiter } from "@/lib/utils/rate-limiter";

interface ActionResult {
  success?: string;
  error?: string;
}

const MAX_RESET_ATTEMPTS = 3;
const RATE_WINDOW_HOURS = 24;

/** Generic success message — shown regardless of email status */
const GENERIC_SUCCESS =
  "אם הכתובת רשומה ופעילה במערכת, נשלח אליך קישור לאיפוס הסיסמה. אם אינך רואה אותו בתיבת הדואר הנכנס, בדוק גם בתיקיית הספאם.";

/** Generic internal error */
const ERR_INTERNAL =
  "אירעה שגיאה פנימית במערכת. אנא נסה שוב מאוחר יותר.";
const ERR_RESET_PROCESS =
  "שגיאה בתהליך איפוס הסיסמה. ייתכן שהקישור פג תוקף.";
const ERR_RATE_LIMITED =
  "יותר מדי ניסיונות. אנא נסה שוב בעוד 15 דקות.";

/**
 * Build the recovery redirect URL from request headers.
 */
async function getRedirectUrl(): Promise<string> {
  const headerStore = await headers();
  let origin =
    headerStore.get("origin") ||
    headerStore.get("x-forwarded-host") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  if (!origin.startsWith("http")) origin = `https://${origin}`;

  const url = new URL("/auth/confirm", origin);
  return url.toString();
}

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
    // ── SEC-HIGH-2: CSRF validation ───────────────────────────────────
    if (!await validateOrigin()) {
      logger.warn("[requestPasswordReset] CSRF validation failed");
      return { error: "בקשה לא חוקית. נא לרענן את הדף ולנסות שוב." };
    }

    const email = formData.get("email")?.toString().trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "נא להזין כתובת אימייל תקינה." };
    }

    // ── SEC-CRIT-2: Redis-based IP rate limiting ────────────────────────
    const clientIp = await getClientIp();
    const rateLimitResult = await passwordResetLimiter.check(clientIp);
    
    if (!rateLimitResult.success) {
      logger.warn("[requestPasswordReset] Rate limited", { 
        ip: clientIp, 
        remaining: rateLimitResult.remaining,
        resetAt: new Date(rateLimitResult.reset).toISOString()
      });
      return { error: ERR_RATE_LIMITED };
    }

    let admin;
    try {
      admin = createAdminClient();
    } catch (err) {
      logger.error("[requestPasswordReset] Failed to create admin client", { error: err });
      return { error: ERR_INTERNAL };
    }

    // ── Check if email is banned → silent abort ───────────────────────
    const { data: banned } = await admin
      .from("banned_users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (banned) {
      logger.info("[requestPasswordReset] Banned email silently aborted", { email });
      return { success: GENERIC_SUCCESS };
    }

    // ── Count attempts in the last 24 hours (DB-level backup) ───────────
    const windowStart = new Date(
      Date.now() - RATE_WINDOW_HOURS * 60 * 60 * 1000,
    ).toISOString();

    const { count, error: countError } = await admin
      .from("password_reset_attempts")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", windowStart);

    if (countError) {
      logger.error("[requestPasswordReset] Count query error", { error: countError });
      return { error: ERR_INTERNAL };
    }

    const attempts = count ?? 0;

    // ── 3-strike auto-ban ─────────────────────────────────────────────
    if (attempts >= MAX_RESET_ATTEMPTS) {
      logger.warn("[requestPasswordReset] Auto-banning after max attempts", { 
        email, 
        attempts 
      });

      await admin
        .from("banned_users")
        .upsert(
          { email, reason: "password_reset_abuse" },
          { onConflict: "email" },
        );

      return { success: GENERIC_SUCCESS };
    }

    // ── Record this attempt ───────────────────────────────────────────
    const { error: insertError } = await admin
      .from("password_reset_attempts")
      .insert({ email, ip_address: clientIp });

    if (insertError) {
      logger.error("[requestPasswordReset] Attempt insert error", { error: insertError });
      // Non-fatal — continue sending the email
    }

    // ── Check if user actually exists (silent if not) ─────────────────
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return { success: GENERIC_SUCCESS };
    }

    // ── Send recovery email ───────────────────────────────────────────
    const supabase = await createClient();
    const redirectTo = await getRedirectUrl();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo },
    );

    if (resetError) {
      logger.error("[requestPasswordReset] resetPasswordForEmail error", { error: resetError });
      return { success: GENERIC_SUCCESS };
    }

    return { success: GENERIC_SUCCESS };
  } catch (err) {
    // SEC: Log error details server-side, return generic message to client
    logger.error("[requestPasswordReset] Unexpected error", { error: err });
    return { error: ERR_INTERNAL };
  }
}

/* ================================================================
 * 2. Update Password (after clicking the recovery link)
 * ================================================================ */
export async function updatePassword(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const newPassword = formData.get("password")?.toString();
    if (!newPassword || newPassword.length < 8) {
      return { error: "הסיסמה חייבת להכיל לפחות 8 תווים." };
    }

    const supabase = await createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      logger.error("[updatePassword] updateUser error", { error: updateError });

      if ("code" in updateError && updateError.code === "same_password") {
        return { error: "סיסמא ישנה, אנא הכנס סיסמא חדשה" };
      }

      return { error: ERR_RESET_PROCESS };
    }

    // Reset the attempt counter on profiles (non-fatal if it fails)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      try {
        const admin = createAdminClient();
        await admin
          .from("profiles")
          .update({ reset_attempts: 0 })
          .eq("id", user.id);
        
        // Also reset the rate limiter for this user's IP
        const clientIp = await getClientIp();
        await passwordResetLimiter.reset(clientIp);
      } catch (err) {
        logger.error("[updatePassword] Counter reset error", { error: err });
      }
    }

    return { success: "הסיסמה עודכנה בהצלחה!" };
  } catch (err) {
    // SEC: Log error details server-side, return generic message to client
    logger.error("[updatePassword] Unexpected error", { error: err });
    return { error: ERR_RESET_PROCESS };
  }
}
