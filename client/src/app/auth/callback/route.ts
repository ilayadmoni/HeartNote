/**
 * Auth Callback Route Handler (DEPRECATED - PKCE Flow)
 * ──────────────────────────────────────────────────────
 * ⚠️ DEPRECATED: This route uses the old PKCE flow with exchangeCodeForSession.
 * ⚠️ USE /auth/confirm instead for Token Hash (OTP) flow.
 *
 * This file is kept temporarily for backward compatibility with old email links.
 * Once all email templates are updated to use /auth/confirm, this can be deleted.
 *
 * Old URL pattern:  /auth/callback?code=...&next=/some-page
 * New URL pattern:  /auth/confirm?token_hash=...&type=signup|recovery
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
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
              // Ignore errors from read-only cookie store in some
              // edge-cases; the session will still be established.
            }
          },
        },
      },
    );

    // ⚠️ DEPRECATED: exchangeCodeForSession is the old PKCE method
    const { data: exchangeData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Google OAuth users who still miss required profile fields
      // are redirected to the mandatory /complete-profile route.
      const userId = exchangeData?.user?.id;
      const provider = exchangeData?.user?.app_metadata?.provider;
      if (userId && provider === "google") {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("date_of_birth")
          .eq("id", userId)
          .maybeSingle();

        const isProfileIncomplete =
          !profileRow ||
          !profileRow.date_of_birth;

        if (isProfileIncomplete) {
          return NextResponse.redirect(`${origin}/complete-profile`);
        }
      }

      // Successful exchange → redirect to the intended page.
      // `next` will typically be `/?modal=reset-password` for recovery,
      // or `/` for email verification.
      const forwardUrl = next.startsWith("/")
        ? `${origin}${next}`
        : next;
      return NextResponse.redirect(forwardUrl);
    }
  }

  // If code is missing or exchange failed, redirect to an error page.
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
