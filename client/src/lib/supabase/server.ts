/**
 * Supabase Server Client
 * For server-side authentication (API routes, Server Components)
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
            cookiesToSet.forEach(({ name, value, options }) => {
              const isProduction = process.env.NODE_ENV === 'production';
              cookieStore.set(name, value, {
                ...options,
                sameSite: 'lax' as const,
                secure: isProduction,
              });
            });
          } catch (error) {
            console.error("[supabase/server] Failed to set auth cookies", error);
          }
        },
      },
    }
  );
}
