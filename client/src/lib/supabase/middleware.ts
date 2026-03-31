/**
 * Supabase Middleware Client
 * For route protection middleware
 * 
 * Note: Cannot use the logger here as middleware runs at the Edge runtime
 * and logger imports may cause issues. Console.error is acceptable for
 * critical middleware failures.
 */

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const isProduction = process.env.NODE_ENV === 'production';
              request.cookies.set(name, value);
              response.cookies.set(name, value, {
                ...options,
                sameSite: 'lax' as const,
                secure: isProduction,
              });
            });
          } catch {
            // Non-fatal: cookie setting can fail in Edge contexts
            // Error is caught silently to prevent middleware crashes
          }
        },
      },
    }
  );

  return {
    supabase,
    getResponse() {
      return response;
    },
  };
}
