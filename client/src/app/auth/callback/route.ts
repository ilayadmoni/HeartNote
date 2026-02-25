/**
 * Auth Callback Route Handler
 * ───────────────────────────
 * Handles PKCE code exchange for email verification and password recovery.
 * Runs server-side, exchanges the code for a session, then redirects.
 *
 * URL pattern:  /auth/callback?code=...&next=/some-page
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

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
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
