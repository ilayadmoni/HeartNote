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

/* ─── Return type shared with the client ────────────────────────── */
interface ActionResult {
  success?: string;
  error?: string;
}

const MAX_RESET_ATTEMPTS = 3;

/* ================================================================
 * 1. Request Password Reset
 * ================================================================ */
export async function requestPasswordReset(
  formData: FormData,
): Promise<ActionResult> {
  console.log("[requestPasswordReset] Server action invoked");
  const email = formData.get("email")?.toString().trim().toLowerCase();
  console.log("[requestPasswordReset] Email:", email);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "נא להזין כתובת אימייל תקינה." };
  }

  // ── Admin client (bypasses RLS) for profile lookup ─────────────
  // The user is NOT authenticated at this point (they forgot their
  // password), so the normal anon-key client can't read profiles.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error("[requestPasswordReset] SUPABASE_SERVICE_ROLE_KEY is NOT set in .env");
    return { error: "DEBUG: SUPABASE_SERVICE_ROLE_KEY is missing from .env file" };
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { persistSession: false } },
  );

  // ── 1a. Look up the user's profile by email ────────────────────
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, reset_attempts")
    .eq("email", email)
    .maybeSingle();

  console.log("[requestPasswordReset] Profile lookup:", { profile, profileError });

  if (profileError) {
    console.error("[requestPasswordReset] Real Supabase Error:", profileError);
    return { error: `DEBUG Profile lookup: ${profileError.message}` };
  }

  // If no profile found, still return success-like response (security)
  if (!profile) {
    return { success: "אם הכתובת רשומה במערכת, נשלח אליך קישור לאיפוס הסיסמה." };
  }

  // ── 1b. Enforce 3-strike limit ─────────────────────────────────
  if (profile.reset_attempts >= MAX_RESET_ATTEMPTS) {
    return {
      error:
        "החשבון ננעל זמנית בשל יותר מדי ניסיונות איפוס. נא לפנות לתמיכה.",
    };
  }

  // ── 1c. Increment the counter (admin client – bypasses RLS) ────
  const { error: updateError } = await admin
    .from("profiles")
    .update({ reset_attempts: profile.reset_attempts + 1 })
    .eq("id", profile.id);

  if (updateError) {
    console.error("[requestPasswordReset] Real Supabase Error:", updateError);
    return { error: `DEBUG Counter update: ${updateError.message}` };
  }

  // ── 1d. Determine origin & send recovery email ─────────────────
  // Use the normal server client for the auth API call
  const supabase = await createClient();
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ||
    headerStore.get("x-forwarded-host") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  // The callback route will exchange the PKCE code, then redirect
  // the user to /?modal=reset-password so the modal opens.
  const redirectTo = `${origin}/auth/callback?next=/?modal=reset-password`;

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email,
    { redirectTo },
  );

  if (resetError) {
    console.error("[requestPasswordReset] Real Supabase Error:", resetError);
    return { error: `DEBUG resetPasswordForEmail: ${resetError.message}` };
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

  // ── 2a. Set the new password ───────────────────────────────────
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    console.error("[updatePassword] Supabase updateUser error:", updateError);
    return { error: "עדכון הסיסמה נכשל. נסו שוב מאוחר יותר." };
  }

  // ── 2b. Reset the attempts counter ─────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error: resetError } = await supabase
      .from("profiles")
      .update({ reset_attempts: 0 })
      .eq("id", user.id);

    if (resetError) {
      // Non-fatal: the password was changed, counter just didn't reset
      console.error("[updatePassword] Counter reset error:", resetError);
    }
  }

  return { success: "הסיסמה עודכנה בהצלחה!" };
}
