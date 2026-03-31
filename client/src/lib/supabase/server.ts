/**
 * Supabase Server Client
 * For server-side authentication (API routes, Server Components)
 *
 * SEC-HIGH-3: Cookie Security Configuration
 * - secure: true in production (HTTPS only)
 * - sameSite: 'lax' (preserves sessions from external links like WhatsApp/Email)
 * - CSRF protection is handled by origin validation in Server Actions
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { logger } from "@/lib/utils/logger";

/** Cookie configuration for Supabase auth */
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  
  // Also secure if using HTTPS in development (ngrok, etc.)
  const isSecure = isProduction || siteUrl.startsWith("https");

  return {
    // HTTPS only in production or when using secure tunnels
    secure: isSecure,
    // 'lax' allows sessions from external links (WhatsApp, Email, etc.)
    // CSRF protection is handled by validateOrigin() in Server Actions
    sameSite: "lax" as const,
    // Path should always be root for auth cookies
    path: "/",
  };
};

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            const baseOptions = getCookieOptions();
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                ...baseOptions,
              });
            });
          } catch (error) {
            logger.error("[supabase/server] Failed to set auth cookies", { error });
          }
        },
      },
    }
  );
}
