"use server";

/**
 * Password Reset Server Actions
 * ─────────────────────────────
 * requestPasswordReset – sends the recovery email (with 3-strike limit)
 * updatePassword       – saves the new password and resets the counter
 *
 * Both use the server-side Supabase client created via @supabase/ssr.
 */

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

interface ActionResult {
  success?: string;
  error?: string;
}

const MAX_RESET_ATTEMPTS = 3;

/** Create a service-role admin client that bypasses RLS */
function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return null;
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { persistSession: false } },
  );
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
    console.error("[requestPasswordReset] SUPABASE_SERVICE_ROLE_KEY missing");
    return { error: "שגיאה בשרת. נסו שוב מאוחר יותר." };
  }

  // Look up the user's profile by email
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, reset_attempts")
    .eq("email", email)
    .maybeSingle();

  if (profileError) {
    console.error("[requestPasswordReset] Profile lookup error:", profileError);
    return { error: "שגיאה בשרת. נסו שוב מאוחר יותר." };
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
    return { error: "שגיאה בשרת. נסו שוב מאוחר יותר." };
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
    return { error: "שגיאה בשרת. נסו שוב מאוחר יותר." };
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
    return { error: "עדכון הסיסמה נכשל. נסו שוב מאוחר יותר." };
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
