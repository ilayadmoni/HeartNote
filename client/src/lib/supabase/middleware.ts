/**
 * Supabase Middleware Client
 * For route protection middleware
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
              const isDev = process.env.NODE_ENV !== 'production';
              request.cookies.set(name, value);
              response.cookies.set(name, value, { ...options, secure: isDev ? false : options.secure });
            });
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("[supabase/middleware] Failed to set auth cookies", error);
            }
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
