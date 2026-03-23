/**
 * Auth Callback Route Handler
 * Handles two server-side auth callbacks:
 * 1) OAuth code exchange (Google and other providers)
 * 2) Token-hash verification (signup/recovery email flows)
 *
 * After a successful OAuth exchange, checks profile completeness
 * and routes the user to /complete-profile or / accordingly.
 * This is the INITIAL routing decision — middleware only enforces
 * the /profile lock and /complete-profile bounce afterwards.
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

    // Check profile completeness to decide the initial landing page.
    const userId = exchangeData?.user?.id;
    if (userId) {
      const profile = await fetchProfileWithRetry(supabase, userId);

      if (isProfileIncomplete(profile)) {
        // Preserve the user's intended destination through the onboarding flow
        const completeProfileUrl = new URL("/complete-profile", request.url);
        if (safePath && safePath !== "/") {
          completeProfileUrl.searchParams.set("next", safePath);
        }
        return NextResponse.redirect(completeProfileUrl);
      }
    }

    // Profile is complete (or no user ID somehow) → go to the safe path.
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

    const successUrl = new URL(safePath, request.url);
    successUrl.searchParams.set("verified", "true");
    return NextResponse.redirect(successUrl);
  }

  return redirectWithError(
    request,
    "Missing authentication callback parameters.",
  );
}
