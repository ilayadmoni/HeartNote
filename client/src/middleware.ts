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

function withSessionCookies(source: NextResponse, target: NextResponse): NextResponse {
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    target.cookies.set(name, value, options);
  });
  return target;
}

export async function middleware(request: NextRequest) {
  const { supabase, getResponse } = createMiddlewareClient(request);
  const pathname = request.nextUrl.pathname;

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
      return withSessionCookies(getResponse(), NextResponse.redirect(redirectUrl));
    }
  }

  // Check if accessing auth routes while logged in
  // → redirect to gallery (no standalone dashboard page exists)
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
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/complete-profile",
    "/login",
    "/signup",
  ],
};

