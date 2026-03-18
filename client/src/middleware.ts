/**
 * Next.js Middleware
 * Handles authentication for protected routes.
 *
 * "Polite Logout" for Google users with incomplete profiles:
 * - On /complete-profile → allow access.
 * - On a PUBLIC route → sign out silently, let them land naturally.
 * - On a PROTECTED route → sign out, redirect to /?login=true.
 *
 * CRITICAL: There is NO /dashboard page. Do not use or reference it.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

// ── Route classifications ──────────────────────────────────────────

/** Routes that require an active, complete session. */
const PROTECTED_ROUTES = ["/profile", "/preview"];

/** The profile-completion page itself (Google-only). */
const PROFILE_COMPLETION_ROUTE = "/complete-profile";

/** Legacy auth pages — redirect to gallery if already logged in. */
const AUTH_ROUTES = ["/login", "/signup"];

/** OAuth / token confirmation — NEVER enforce profile checks here. */
const AUTH_CALLBACK_ROUTES = ["/auth/callback", "/api/auth/callback", "/auth/confirm"];

// ── Helpers ────────────────────────────────────────────────────────

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isAuthCallbackRoute(pathname: string): boolean {
  return AUTH_CALLBACK_ROUTES.some((route) => pathname.startsWith(route));
}

function isNonEmpty(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isGoogleUser(user: {
  app_metadata?: Record<string, unknown>;
  identities?: Array<{ provider?: string }>;
}): boolean {
  if (user.app_metadata?.provider === "google") return true;
  return (user.identities ?? []).some((identity) => identity.provider === "google");
}

/**
 * Copy all cookies that the Supabase middleware client set on `source`
 * over to `target` so session tokens propagate through redirects.
 */
function withSessionCookies(source: NextResponse, target: NextResponse): NextResponse {
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    target.cookies.set(name, value, options);
  });
  return target;
}

/**
 * Delete every Supabase auth cookie to immediately drop the session
 * from the browser perspective.
 */
function clearAuthCookies(response: NextResponse, request: NextRequest): void {
  const supabaseCookieNames = request.cookies
    .getAll()
    .filter(({ name }) => name.startsWith("sb-"))
    .map(({ name }) => name);

  for (const cookieName of supabaseCookieNames) {
    response.cookies.set(cookieName, "", { maxAge: 0, path: "/" });
  }
}

// ── Main middleware ────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { supabase, getResponse } = createMiddlewareClient(request);
  const pathname = request.nextUrl.pathname;

  // 1) Let OAuth / token-confirmation callbacks finish undisturbed.
  if (isAuthCallbackRoute(pathname)) {
    return getResponse();
  }

  // 2) Get the current user (validates the session in the process).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── 3) Incomplete-profile guard for Google users ─────────────────

  if (user && isGoogleUser(user)) {
    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const hasMetaFirstName = isNonEmpty(metadata.first_name);
    const hasMetaLastName = isNonEmpty(metadata.last_name);
    const hasMetaBirthDate =
      isNonEmpty(metadata.birth_date) || isNonEmpty(metadata.date_of_birth);

    const { data: profileRow } = await supabase
      .from("profiles")
      .select("first_name, last_name, date_of_birth")
      .eq("id", user.id)
      .maybeSingle();

    const hasProfileFirstName = isNonEmpty(profileRow?.first_name);
    const hasProfileLastName = isNonEmpty(profileRow?.last_name);
    const hasProfileBirthDate = isNonEmpty(profileRow?.date_of_birth);

    const profileIncomplete =
      !hasMetaFirstName ||
      !hasMetaLastName ||
      !hasMetaBirthDate ||
      !hasProfileFirstName ||
      !hasProfileLastName ||
      !hasProfileBirthDate;

    if (profileIncomplete) {
      // 3a) On /complete-profile → allow access.
      if (pathname === PROFILE_COMPLETION_ROUTE) {
        return getResponse();
      }

      if (isProtectedRoute(pathname)) {
        // Sign out server-side first.
        await supabase.auth.signOut();

        // 3b) PROTECTED route → sign out + redirect to login modal.
        const loginUrl = new URL("/", request.url);
        loginUrl.searchParams.set("login", "true");
        loginUrl.searchParams.set("redirect", pathname);

        const redirectResponse = NextResponse.redirect(loginUrl);
        withSessionCookies(getResponse(), redirectResponse);
        clearAuthCookies(redirectResponse, request);
        return redirectResponse;
      }

      // 3c) PUBLIC route → allow access, do not destroy session.
      // Helps prevent Next.js <Link> prefetching from silently destroying
      // the session while the user is filling out the /complete-profile form.
      return getResponse();
    }

    // Profile is complete → user should NOT stay on /complete-profile.
    if (!profileIncomplete && pathname === PROFILE_COMPLETION_ROUTE) {
      return withSessionCookies(
        getResponse(),
        NextResponse.redirect(new URL("/", request.url)),
      );
    }
  }

  // ── 4) Non-Google users shouldn't stay on complete-profile. ──────

  if (user && pathname === PROFILE_COMPLETION_ROUTE && !isGoogleUser(user)) {
    return withSessionCookies(
      getResponse(),
      NextResponse.redirect(new URL("/", request.url)),
    );
  }

  // ── 5) Unauthenticated → protected route → open login modal. ────

  if (!user && isProtectedRoute(pathname)) {
    const alreadyOnLoginFlow =
      pathname === "/" && request.nextUrl.searchParams.get("login") === "true";

    if (alreadyOnLoginFlow) {
      return getResponse();
    }

    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("login", "true");
    redirectUrl.searchParams.set("redirect", pathname);

    return withSessionCookies(getResponse(), NextResponse.redirect(redirectUrl));
  }

  // ── 6) Authenticated users should not stay on legacy auth routes. ─

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (user) {
      return withSessionCookies(
        getResponse(),
        NextResponse.redirect(new URL("/gallery", request.url)),
      );
    }
  }

  return getResponse();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|assets|api).*)"],
};
