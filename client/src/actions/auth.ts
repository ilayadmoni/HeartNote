"use server";

/**
 * Auth Server Actions
 * Handles authentication via Supabase on the server side.
 * SEC-2: Checks banned_users before authenticating.
 * SEC-HIGH-1: Uses logger for PII-safe logging.
 * SEC-HIGH-2: CSRF origin validation for state-changing operation.
 * SEC-CRIT-2: Redis-based rate limiting for brute-force protection.
 */

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";
import { validateOrigin } from "@/lib/utils/csrf";
import { loginLimiter } from "@/lib/utils/rate-limiter";
import { LoginFormSchema } from "@/lib/validations/auth";
import type { LoginState } from "./auth.types";

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

/**
 * Server Action: Authenticate user with email & password.
 * Returns a typed state object consumed by useFormState on the client.
 */
export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  /* ── SEC-HIGH-2: CSRF validation ─────────────────────────────── */
  if (!await validateOrigin()) {
    logger.warn("[loginAction] CSRF validation failed");
    return { error: "בקשה לא חוקית. נא לרענן את הדף ולנסות שוב.", success: false };
  }

  const parsed = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "שם משתמש או סיסמה שגויים", success: false };
  }
  const { email, password } = parsed.data;

  /* ── SEC-CRIT-2: Redis rate limiting ─────────────────────────── */
  const clientIp = await getClientIp();
  const rateLimitResult = await loginLimiter.check(clientIp);

  if (!rateLimitResult.success) {
    logger.warn("[loginAction] Rate limited", {
      ip: clientIp,
      remaining: rateLimitResult.remaining,
    });
    return { error: "יותר מדי ניסיונות התחברות. אנא נסו שוב בעוד 15 דקות.", success: false };
  }

  // Check banned_users — same generic error (no enumeration)
  try {
    const admin = createAdminClient();
    const { data: banned } = await admin
      .from("banned_users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (banned) {
      logger.info("[loginAction] Banned email attempted login", { email });
      return { error: "שם משתמש או סיסמה שגויים", success: false };
    }
  } catch (err) {
    logger.error("[loginAction] Banned check error", { error: err });
    // Continue — don't block login if the check fails
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "שם משתמש או סיסמה שגויים", success: false };
  }

  return { error: null, success: true };
}
