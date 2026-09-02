/**
 * Next.js Middleware: locale routing (next-intl) + minimal auth locks.
 *
 * 1) next-intl resolves the locale (URL prefix, then cookie, then
 *    Accept-Language, then Hebrew), rewrites/redirects, refreshes NEXT_LOCALE.
 * 2) Profile Lock:    incomplete profile + /profile -> /complete-profile
 * 3) Onboarding Lock: complete profile + /complete-profile -> destination
 *
 * Runs on the Edge runtime: uses the edge-safe NextAuth config (no Prisma).
 */

import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { middlewareAuth } from "@/lib/auth/edge";
import { routing } from "@/i18n/routing";
import { isLocale, type Locale } from "@/i18n/locale";

const intlMiddleware = createIntlMiddleware(routing);
const ONBOARDING_ROUTE = "/complete-profile";
const AUTH_INFRA_PREFIXES = ["/auth/verify", "/api/auth"];

/** Splits "/en/profile" into { locale: "en", path: "/profile" }. */
function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) {
    return { locale: first, path: `/${rest.join("/")}` };
  }
  return { locale: routing.defaultLocale, path: pathname };
}

function withLocale(locale: Locale, path: string): string {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { locale, path } = splitLocale(request.nextUrl.pathname);

  if (AUTH_INFRA_PREFIXES.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  const session = await middlewareAuth();
  if (session?.user) {
    const profileComplete = session.profileComplete ?? false;

    if (!profileComplete && path.startsWith("/profile")) {
      const url = new URL(withLocale(locale, ONBOARDING_ROUTE), request.url);
      url.searchParams.set("returnTo", path);
      url.searchParams.set("reason", "profile_access");
      return NextResponse.redirect(url);
    }

    if (profileComplete && path === ONBOARDING_ROUTE) {
      const destination =
        request.nextUrl.searchParams.get("next") ||
        request.nextUrl.searchParams.get("returnTo") ||
        "/";
      return NextResponse.redirect(
        new URL(withLocale(locale, destination), request.nextUrl.origin),
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|assets|favicon.ico|robots.txt|sitemap.xml|auth/verify|.*\\..*).*)",
  ],
};
