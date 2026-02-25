"use server";

/**
 * Auth Server Actions
 * Handles authentication via Supabase on the server side.
 */

import { createClient } from "@/lib/supabase/server";
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
