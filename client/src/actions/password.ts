"use server";

/**
 * Password Reset Server Actions
 * ─────────────────────────────
 * requestPasswordReset – sends the recovery email (with 3-strike limit)
 * updatePassword       – saves the new password and resets the counter
 *
 * Both use the server-side Supabase client created via @supabase/ssr.
 *
 * SEC-2 COMPLIANT: All detailed errors are logged server-side only.
 *   Client responses use generic Hebrew strings — no internal details leak.
 */

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

interface ActionResult {
  success?: string;
  error?: string;
}

const MAX_RESET_ATTEMPTS = 3;

/* ── Generic client-facing error messages (Hebrew) ────────── */
const ERR_INTERNAL =
  "אירעה שגיאה פנימית במערכת. אנא נסה שוב מאוחר יותר.";
const ERR_USER_VERIFICATION =
  "לא הצלחנו לאמת את פרטי המשתמש. אנא פנה לתמיכה.";
const ERR_RESET_PROCESS =
  "שגיאה בתהליך איפוס הסיסמה. ייתכן שהקישור פג תוקף.";

/** Create a service-role admin client that bypasses RLS */
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error(
      "[getAdminClient] Missing env vars — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
    return null;
  }

  return createAdminClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/** Build the recovery redirect URL from request headers */
async function getRedirectUrl(): Promise<string> {
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ||
    headerStore.get("x-forwarded-host") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  return `${origin}/auth/callback?next=/?modal=reset-password`;
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

  const admin = getAdminClient();
  if (!admin) {
    // env-var issue already logged inside getAdminClient()
    return { error: ERR_INTERNAL };
  }

  // Look up the user's profile by email
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, reset_attempts")
    .eq("email", email)
    .maybeSingle();

  if (profileError) {
    console.error("[requestPasswordReset] Profile lookup error:", profileError);
    return { error: ERR_USER_VERIFICATION };
  }

  // Security: don't reveal whether the email exists
  if (!profile) {
    return { success: "אם הכתובת רשומה במערכת, נשלח אליך קישור לאיפוס הסיסמה." };
  }

  // Enforce 3-strike limit
  if (profile.reset_attempts >= MAX_RESET_ATTEMPTS) {
    return { error: "החשבון ננעל זמנית בשל יותר מדי ניסיונות איפוס. נא לפנות לתמיכה." };
  }

  // Increment counter
  const { error: updateError } = await admin
    .from("profiles")
    .update({ reset_attempts: profile.reset_attempts + 1 })
    .eq("id", profile.id);

  if (updateError) {
    console.error("[requestPasswordReset] Counter update error:", updateError);
    return { error: ERR_USER_VERIFICATION };
  }

  // Send recovery email
  const supabase = await createClient();
  const redirectTo = await getRedirectUrl();
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email,
    { redirectTo },
  );

  if (resetError) {
    console.error("[requestPasswordReset] resetPasswordForEmail error:", resetError);
    return { error: ERR_RESET_PROCESS };
  }

  return { success: "אם הכתובת רשומה במערכת, נשלח אליך קישור לאיפוס הסיסמה." };
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
    return { error: ERR_RESET_PROCESS };
  }

  // Reset the attempts counter (non-fatal if it fails)
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error: resetError } = await supabase
      .from("profiles")
      .update({ reset_attempts: 0 })
      .eq("id", user.id);

    if (resetError) {
      console.error("[updatePassword] Counter reset error:", resetError);
    }
  }

  return { success: "הסיסמה עודכנה בהצלחה!" };
}
