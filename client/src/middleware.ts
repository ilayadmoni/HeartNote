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
const PROTECTED_ROUTES = ["/dashboard", "/create", "/profile"];

// Routes that should redirect to gallery if already logged in
const AUTH_ROUTES = ["/login", "/signup"];

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

