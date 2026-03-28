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
import {
  createCallbackClient,
  fetchProfileWithRetry,
  isProfileIncomplete,
} from "./helpers";

const DEFAULT_SUCCESS_PATH = "/";
const RECOVERY_PATH = "/?modal=reset-password";

function htmlRedirect(url: string | URL) {
  const urlString = typeof url === "string" ? url : url.toString();
  return new NextResponse(
    `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=${urlString}" />
    <title>Redirecting...</title>
  </head>
  <body>
    <script>window.location.href = ${JSON.stringify(urlString)};</script>
  </body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    }
  );
}

function redirectWithError(request: NextRequest, message: string) {
  const errorUrl = new URL("/auth/auth-code-error", request.url);
  errorUrl.searchParams.set("message", message);
  return htmlRedirect(errorUrl);
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
  const isSafeInternal = next.startsWith("/") && !next.startsWith("//");
  const safePath = isSafeInternal ? next : DEFAULT_SUCCESS_PATH;

  // ── Path A: OAuth / PKCE code exchange ──────────────────────────
  if (code) {
    try {
      const { data: exchangeData, error } =
        await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error(
          "[auth/callback] exchangeCodeForSession returned error:",
          { message: error.message, status: error.status, code: error.code },
        );
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
          return htmlRedirect(completeProfileUrl);
        }
      }

      // Profile is complete (or no user ID somehow) → go to the safe path.
      return htmlRedirect(new URL(safePath, request.url));
    } catch (unexpectedError) {
      console.error(
        "[auth/callback] Unexpected exception during code exchange:",
        unexpectedError,
      );
      const message =
        unexpectedError instanceof Error
          ? unexpectedError.message
          : "Unexpected error during OAuth sign-in.";
      return redirectWithError(request, message);
    }
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
      return htmlRedirect(new URL(RECOVERY_PATH, request.url));
    }

    const successUrl = new URL(safePath, request.url);
    successUrl.searchParams.set("verified", "true");
    return htmlRedirect(successUrl);
  }

  return redirectWithError(
    request,
    "Missing authentication callback parameters.",
  );
}
