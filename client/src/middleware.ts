/**
 * Next.js Middleware — Minimal Server-Driven Auth
 *
 * Only two route-level guards:
 * 1) Profile Lock:    incomplete profile + /profile → /complete-profile
 * 2) Onboarding Lock: complete profile + /complete-profile → /
 *
 * Everything else passes through freely. Incomplete users CAN browse
 * /, /gallery, /create/*, etc. The action-based guard in the editor
 * components handles the save interception client-side.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

/** Auth infra — skip entirely, never run profile checks. */
const AUTH_INFRA_PREFIXES = [
  "/auth/callback",
  "/auth/confirm",
  "/auth/auth-code-error",
  "/api/auth",
];

const ONBOARDING_ROUTE = "/complete-profile";

// ── Helpers ────────────────────────────────────────────────────────

function isAuthInfra(pathname: string): boolean {
  return AUTH_INFRA_PREFIXES.some((p) => pathname.startsWith(p));
}

function isNonEmpty(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** Forward session cookies from middleware response onto a redirect. */
function withCookies(source: NextResponse, target: NextResponse): NextResponse {
  source.cookies.getAll().forEach(({ name, value, ...opts }) => {
    target.cookies.set(name, value, opts);
  });
  return target;
}

// ── Main middleware ────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { supabase, getResponse } = createMiddlewareClient(request);
  const pathname = request.nextUrl.pathname;

  // Auth infra routes — always pass through.
  if (isAuthInfra(pathname)) {
    return getResponse();
  }

  // Get the authenticated user (validates the JWT).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No user — let everything through (public site).
  if (!user) {
    return getResponse();
  }

  // ── Authenticated: determine profile completeness ───────────────
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("first_name, last_name, date_of_birth")
    .eq("id", user.id)
    .maybeSingle();

  const profileComplete =
    isNonEmpty(metadata.first_name) &&
    isNonEmpty(metadata.last_name) &&
    (isNonEmpty(metadata.birth_date) || isNonEmpty(metadata.date_of_birth)) &&
    isNonEmpty(profileRow?.first_name) &&
    isNonEmpty(profileRow?.last_name) &&
    isNonEmpty(profileRow?.date_of_birth);

  // ── Rule 1: Profile Lock ────────────────────────────────────────
  // Incomplete profile + /profile → redirect to onboarding.
  if (!profileComplete && pathname.startsWith("/profile")) {
    const onboardUrl = new URL(ONBOARDING_ROUTE, request.url);
    onboardUrl.searchParams.set("returnTo", pathname);
    onboardUrl.searchParams.set("reason", "profile_access");
    return withCookies(
      getResponse(),
      NextResponse.redirect(onboardUrl),
    );
  }

  // ── Rule 2: Onboarding Lock ─────────────────────────────────────
  // Complete profile + /complete-profile → bounce to intended destination or home.
  if (profileComplete && pathname === ONBOARDING_ROUTE) {
    // Preserve the "next" param from the OAuth flow, fallback to "/"
    const nextParam = request.nextUrl.searchParams.get("next");
    const returnTo = request.nextUrl.searchParams.get("returnTo");
    const destination = nextParam || returnTo || "/";
    
    // Use request origin so the redirect stays on the same protocol as the
    // incoming request (critical for HTTP LAN dev where NEXT_PUBLIC_SITE_URL
    // could mismatch the actual scheme the browser is using).
    const redirectUrl = new URL(destination, request.nextUrl.origin);
    
    return withCookies(
      getResponse(),
      NextResponse.redirect(redirectUrl),
    );
  }

  // ── Rule 3: Freedom ─────────────────────────────────────────────
  // Everything else passes through normally.
  return getResponse();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|assets|api).*)"],
};
