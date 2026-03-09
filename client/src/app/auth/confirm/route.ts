/**
 * Auth Confirm Route Handler (Token Hash / OTP Flow)
 * ───────────────────────────────────────────────────
 * Handles BOTH email confirmation (signup) and password recovery (reset).
 * Uses verifyOtp() to exchange token_hash for a session.
 *
 * URL patterns:
 *   • Signup:   /auth/confirm?token_hash=...&type=signup
 *   • Recovery: /auth/confirm?token_hash=...&type=recovery
 *
 * After successful verification:
 *   • type=signup   → redirect to home (/)
 *   • type=recovery → redirect to /?modal=reset-password (UpdatePasswordForm)
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "signup" | "recovery" | null;

  // Validate required parameters
  if (!token_hash || !type) {
    console.error("[auth/confirm] Missing token_hash or type", {
      token_hash: !!token_hash,
      type,
    });
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Validate type is one of the expected values
  if (type !== "signup" && type !== "recovery") {
    console.error("[auth/confirm] Invalid type parameter", { type });
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Create Supabase client with cookie handling
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Ignore errors from read-only cookie store in some edge-cases;
            // the session will still be established.
          }
        },
      },
    },
  );

  // Verify OTP token
  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type === "signup" ? "email" : "recovery",
  });

  if (error) {
    console.error("[auth/confirm] verifyOtp error:", error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Success! Route based on the type
  if (type === "signup") {
    // Email confirmation (signup) → redirect to home
    console.log("[auth/confirm] Signup confirmed, redirecting to home");
    return NextResponse.redirect(`${origin}/`);
  } else {
    // Password recovery → redirect to reset password modal
    console.log("[auth/confirm] Recovery confirmed, redirecting to reset password");
    return NextResponse.redirect(`${origin}/?modal=reset-password`);
  }
}
