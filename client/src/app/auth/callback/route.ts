/**
 * Auth Callback Route Handler
 * Handles two server-side auth callbacks:
 * 1) OAuth code exchange (Google and other providers)
 * 2) Token-hash verification (signup/recovery email flows)
 *
 * Cookie strategy: `createCallbackClient` writes session tokens
 * directly to `cookieStore` via `cookies().set()`. In Next.js
 * App Router Route Handlers, these are automatically merged into
 * the outgoing response — including `NextResponse.redirect()`.
 * No manual cookie injection is needed.
 *
 * Profile completeness is enforced for ALL providers — if
 * first_name, last_name, or date_of_birth is missing the user
 * is always sent to /complete-profile (the `next` param is
 * ignored in that case).
 */

import { NextRequest, NextResponse } from "next/server";
import { isInternalUrl } from "@/lib/utils/isInternalUrl";
import {
  createCallbackClient,
  fetchProfileWithRetry,
  isProfileIncomplete,
} from "./helpers";

const DEFAULT_SUCCESS_PATH = "/";
const RECOVERY_PATH = "/?modal=reset-password";

function redirectWithError(request: NextRequest, message: string) {
  const errorUrl = new URL("/auth/auth-code-error", request.url);
  errorUrl.searchParams.set("message", message);
  return NextResponse.redirect(errorUrl);
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                       */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = await createCallbackClient();

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "";
  const safePath = isInternalUrl(next) ? next : DEFAULT_SUCCESS_PATH;

  // ── Path A: OAuth / PKCE code exchange ──────────────────────────
  if (code) {
    const { data: exchangeData, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirectWithError(
        request,
        error.message || "Failed to complete OAuth sign-in.",
      );
    }

    console.log("[OAuth Callback] Exchange successful?", !!exchangeData?.session);

    // Enforce profile completion for EVERY provider.
    // The `next` param is intentionally ignored when incomplete.
    const userId = exchangeData?.user?.id;

    if (userId) {
      const profile = await fetchProfileWithRetry(supabase, userId);

      if (isProfileIncomplete(profile)) {
        console.log("[OAuth Callback] Profile incomplete → /complete-profile");
        return NextResponse.redirect(
          new URL("/complete-profile", request.url),
        );
      }
    }

    // Profile is complete → land on next/home.
    console.log(`[OAuth Callback] Profile complete → ${safePath}`);
    return NextResponse.redirect(new URL(safePath, request.url));
  }

  // ── Path B: Token hash verification (signup / recovery links) ───
  if (tokenHash && type) {
    const otpType = type === "signup" ? "email" : type;

    if (otpType !== "email" && otpType !== "recovery") {
      return redirectWithError(request, "Unsupported token verification type.");
    }

    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });

    if (error) {
      return redirectWithError(
        request,
        error.message || "Failed to verify authentication link.",
      );
    }

    if (otpType === "recovery") {
      return NextResponse.redirect(new URL(RECOVERY_PATH, request.url));
    }

    return NextResponse.redirect(new URL(safePath, request.url));
  }

  return redirectWithError(
    request,
    "Missing authentication callback parameters.",
  );
}
