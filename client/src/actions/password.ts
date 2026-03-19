"use server";

/**
 * Password Server Actions
 * ───────────────────────
 * requestPasswordReset – sends recovery email with:
 *   • banned_users check (silent abort)
 *   • 3-strike auto-ban via password_reset_attempts table
 *   • Anti-enumeration: always returns the same generic success string
 *
 * updatePassword – saves the new password after clicking the recovery link
 *
 * SEC-2 COMPLIANT: All detailed errors are logged server-side only.
 *   Client responses use generic Hebrew strings — no internal details leak.
 */

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

/**
 * Build the recovery redirect URL from request headers.
 * 
 * NOTE: In Token Hash (OTP) flow, this redirectTo is NOT used by Supabase.
 * Instead, the email template itself contains the full URL with token_hash.
 * This is kept for backward compatibility with any old PKCE-based emails
 * that might still be in flight.
 * 
 * For Token Hash flow, configure the email template in Supabase Dashboard:
 *   https://www.heartnote.co.il/auth/confirm?token_hash={{ .TokenHash }}&type=recovery
 */
async function getRedirectUrl(): Promise<string> {
  const headerStore = await headers();
  let origin =
    headerStore.get("origin") ||
    headerStore.get("x-forwarded-host") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  // x-forwarded-host omits the protocol — add it so URL() doesn't throw
  if (!origin.startsWith("http")) origin = `https://${origin}`;

  // Point to the new Token Hash confirm route (backward compatible)
  const url = new URL("/auth/confirm", origin);
  // Note: In actual Token Hash flow, type and token_hash come from email template
  // This redirectTo is only used as fallback for old PKCE emails
  return url.toString();
}

/** Extract client IP from request headers */
async function getClientIp(): Promise<string | null> {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    null
  );
}

/* ================================================================
 * 1. Request Password Reset
 * ================================================================ */
export async function requestPasswordReset(
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "נא להזין כתובת אימייל תקינה." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    console.error("[requestPasswordReset] Failed to create admin client");
    return { error: ERR_INTERNAL };
  }

  // ── Check if email is banned → silent abort ───────────────────────
  const { data: banned } = await admin
    .from("banned_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (banned) {
    console.log(`[requestPasswordReset] Banned email silently aborted: ${email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
    return { success: GENERIC_SUCCESS };
  }

  // ── Count attempts in the last 24 hours ───────────────────────────
  const windowStart = new Date(
    Date.now() - RATE_WINDOW_HOURS * 60 * 60 * 1000,
  ).toISOString();

  const { count, error: countError } = await admin
    .from("password_reset_attempts")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", windowStart);

  if (countError) {
    console.error("[requestPasswordReset] Count query error:", countError);
    return { error: ERR_INTERNAL };
  }

  const attempts = count ?? 0;

  // ── 3-strike auto-ban ─────────────────────────────────────────────
  if (attempts >= MAX_RESET_ATTEMPTS) {
    console.warn(
      `[requestPasswordReset] Auto-banning ${email.replace(/(.{2}).*(@.*)/, '$1***$2')} after ${attempts} attempts`,
    );

    await admin
      .from("banned_users")
      .upsert(
        { email, reason: "password_reset_abuse" },
        { onConflict: "email" },
      );

    // Silent abort — same generic success
    return { success: GENERIC_SUCCESS };
  }

  // ── Record this attempt ───────────────────────────────────────────
  const clientIp = await getClientIp();

  const { error: insertError } = await admin
    .from("password_reset_attempts")
    .insert({ email, ip_address: clientIp });

  if (insertError) {
    console.error("[requestPasswordReset] Attempt insert error:", insertError);
    // Non-fatal — continue sending the email
  }

  // ── Check if user actually exists (silent if not) ─────────────────
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    // Email not registered — return generic success (anti-enumeration)
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
    console.error("[requestPasswordReset] resetPasswordForEmail error:", resetError);
    // Still return generic success to avoid enumeration
    return { success: GENERIC_SUCCESS };
  }

  return { success: GENERIC_SUCCESS };
}

/* ================================================================
 * 2. Update Password (after clicking the recovery link)
 * ================================================================ */
export async function updatePassword(
  formData: FormData,
): Promise<ActionResult> {
  const newPassword = formData.get("password")?.toString();
  if (!newPassword || newPassword.length < 8) {
    return { error: "הסיסמה חייבת להכיל לפחות 8 תווים." };
  }

  const supabase = await createClient();

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    console.error("[updatePassword] updateUser error:", updateError);

    // Supabase returns code "same_password" when new password matches old
    if (
      "code" in updateError &&
      updateError.code === "same_password"
    ) {
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
    } catch (err) {
      console.error("[updatePassword] Counter reset error:", err);
    }
  }

  return { success: "הסיסמה עודכנה בהצלחה!" };
}
