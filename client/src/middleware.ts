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
 *
 * Runs on the Edge runtime, so it uses the edge-safe partial NextAuth config
 * (lib/auth/edge.ts) — no Prisma/bcrypt here. `profileComplete` is a claim
 * embedded in the JWT by the full config's jwt() callback at sign-in time.
 */

import { type NextRequest, NextResponse } from "next/server";
import { middlewareAuth } from "@/lib/auth/edge";

/** Auth infra — skip entirely, never run profile checks. */
const AUTH_INFRA_PREFIXES = [
  "/auth/verify",
  "/api/auth",
];

const ONBOARDING_ROUTE = "/complete-profile";

function isAuthInfra(pathname: string): boolean {
  return AUTH_INFRA_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Auth infra routes — always pass through.
  if (isAuthInfra(pathname)) {
    return NextResponse.next();
  }

  const session = await middlewareAuth();

  // No user — let everything through (public site).
  if (!session?.user) {
    return NextResponse.next();
  }

  const profileComplete = session.profileComplete ?? false;

  // ── Rule 1: Profile Lock ────────────────────────────────────────
  // Incomplete profile + /profile → redirect to onboarding.
  if (!profileComplete && pathname.startsWith("/profile")) {
    const onboardUrl = new URL(ONBOARDING_ROUTE, request.url);
    onboardUrl.searchParams.set("returnTo", pathname);
    onboardUrl.searchParams.set("reason", "profile_access");
    return NextResponse.redirect(onboardUrl);
  }

  // ── Rule 2: Onboarding Lock ─────────────────────────────────────
  // Complete profile + /complete-profile → bounce to intended destination or home.
  if (profileComplete && pathname === ONBOARDING_ROUTE) {
    const nextParam = request.nextUrl.searchParams.get("next");
    const returnTo = request.nextUrl.searchParams.get("returnTo");
    const destination = nextParam || returnTo || "/";

    const redirectUrl = new URL(destination, request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  // ── Rule 3: Freedom ─────────────────────────────────────────────
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|assets|api).*)"],
};
