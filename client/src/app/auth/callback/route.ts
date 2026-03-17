/**
 * Auth Callback Route Handler
 * Handles exactly two server-side auth callbacks:
 * 1) OAuth code exchange (Google and other providers)
 * 2) Token-hash verification (signup/recovery email flows)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isInternalUrl } from "@/lib/utils/isInternalUrl";

const DEFAULT_SUCCESS_PATH = "/";
const RECOVERY_PATH = "/?modal=reset-password";

function redirectWithError(request: NextRequest, message: string) {
  const errorUrl = new URL("/auth/auth-code-error", request.url);
  errorUrl.searchParams.set("message", message);
  return NextResponse.redirect(errorUrl);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = await createClient();

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "";
  const safePath = isInternalUrl(next) ? next : DEFAULT_SUCCESS_PATH;

  // Path A: OAuth/PKCE code exchange
  if (code) {
    const { data: exchangeData, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return redirectWithError(
        request,
        error.message || "Failed to complete OAuth sign-in.",
      );
    }

    // Keep Google profile-completion behavior intact.
    const userId = exchangeData?.user?.id;
    const provider = exchangeData?.user?.app_metadata?.provider;
    if (userId && provider === "google") {
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("date_of_birth")
        .eq("id", userId)
        .maybeSingle();

      const isProfileIncomplete = !profileRow || !profileRow.date_of_birth;
      if (isProfileIncomplete) {
        return NextResponse.redirect(new URL("/complete-profile", request.url));
      }
    }

    return NextResponse.redirect(new URL(safePath, request.url));
  }

  // Path B: Token hash verification (signup/recovery links)
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

  return redirectWithError(request, "Missing authentication callback parameters.");
}
