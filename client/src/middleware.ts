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

