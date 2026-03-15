/**
 * Next.js Middleware
 * Handles authentication for protected routes.
 *
 * NOTE: This app uses modal-based login (LoginModal component),
 * so there is no /login page. Unauthenticated users are redirected
 * to /gallery with a query param to trigger the login modal.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/complete-profile"];

// Routes that should redirect to gallery if already logged in
const AUTH_ROUTES = ["/login", "/signup"];
const PROFILE_COMPLETION_ROUTE = "/complete-profile";

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

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const pathname = request.nextUrl.pathname;

  // ── Auth flow handling: support both PKCE (old) and Token Hash (new) ──
  // PKCE flow: code parameter → forward to /auth/callback (deprecated)
  const code = request.nextUrl.searchParams.get("code");
  if (code && !pathname.startsWith("/auth/callback")) {
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.searchParams.set("code", code);
    const next =
      request.nextUrl.searchParams.get("next") || "/?modal=reset-password";
    callbackUrl.searchParams.set("next", next);
    return NextResponse.redirect(callbackUrl);
  }

  // Token Hash flow: token_hash parameter → already at correct route
  // (no redirect needed, /auth/confirm handles it directly)

  // Get current session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Mandatory profile-completion gate for Google OAuth users.
  if (user && isGoogleUser(user)) {
    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const hasMetaFirstName = isNonEmpty(metadata.first_name);
    const hasMetaLastName = isNonEmpty(metadata.last_name);
    const hasMetaBirthDate =
      isNonEmpty(metadata.birth_date) ||
      isNonEmpty(metadata.date_of_birth);

    const { data: profileRow } = await supabase
      .from("profiles")
      .select("first_name, last_name, date_of_birth")
      .eq("id", user.id)
      .maybeSingle();

    const hasProfileFirstName = isNonEmpty(profileRow?.first_name);
    const hasProfileLastName = isNonEmpty(profileRow?.last_name);
    const hasProfileBirthDate = isNonEmpty(profileRow?.date_of_birth);

    const needsCompletion =
      !hasMetaFirstName ||
      !hasMetaLastName ||
      !hasMetaBirthDate ||
      !hasProfileFirstName ||
      !hasProfileLastName ||
      !hasProfileBirthDate;

    const isAuthRoute = pathname.startsWith("/auth/");
    const isOnCompletionPage = pathname === PROFILE_COMPLETION_ROUTE;

    if (needsCompletion && !isOnCompletionPage && !isAuthRoute) {
      return NextResponse.redirect(new URL(PROFILE_COMPLETION_ROUTE, request.url));
    }

    if (!needsCompletion && isOnCompletionPage) {
      return NextResponse.redirect(new URL("/gallery", request.url));
    }
  }

  if (user && pathname === PROFILE_COMPLETION_ROUTE && !isGoogleUser(user)) {
    return NextResponse.redirect(new URL("/gallery", request.url));
  }

  // Check if accessing protected route without auth
  // → redirect to /gallery with login=true so the login modal opens
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const redirectUrl = new URL("/gallery", request.url);
      redirectUrl.searchParams.set("login", "true");
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Check if accessing auth routes while logged in
  // → redirect to gallery (no standalone dashboard page exists)
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL("/gallery", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - API routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};

