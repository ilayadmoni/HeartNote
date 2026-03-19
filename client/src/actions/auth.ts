"use server";

/**
 * Auth Server Actions
 * Handles authentication via Supabase on the server side.
 * SEC-2: Checks banned_users before authenticating.
 */

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LoginState } from "./auth.types";

/**
 * Server Action: Authenticate user with email & password.
 * Returns a typed state object consumed by useFormState on the client.
 */
export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email?.trim() || !password) {
    return { error: "שם משתמש או סיסמה שגויים", success: false };
  }

  // Check banned_users — same generic error (no enumeration)
  try {
    const admin = createAdminClient();
    const { data: banned } = await admin
      .from("banned_users")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (banned) {
      console.log(`[loginAction] Banned email attempted login: ${email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);
      return { error: "שם משתמש או סיסמה שגויים", success: false };
    }
  } catch (err) {
    console.error("[loginAction] Banned check error:", err);
    // Continue — don't block login if the check fails
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { error: "שם משתמש או סיסמה שגויים", success: false };
  }

  return { error: null, success: true };
}
