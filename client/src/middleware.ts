/**
 * Next.js Middleware
 * Handles authentication for protected routes
 */

import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/create"];

// Routes that should redirect to dashboard if logged in
const AUTH_ROUTES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const pathname = request.nextUrl.pathname;

  // Get current session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if accessing protected route without auth
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Check if accessing auth routes while logged in
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
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
