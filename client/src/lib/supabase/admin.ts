/**
 * Supabase Admin Client (Service Role)
 *
 * Creates a Supabase client that authenticates with the Service Role Key,
 * bypassing all RLS policies. For use ONLY in server actions / API routes
 * that need admin-level access (e.g. banning users, deleting auth accounts).
 *
 * The explicit Authorization header in `global.headers` prevents Next.js's
 * patched fetch or any cookie-based session from overriding the role.
 */

import "server-only";

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "[createAdminClient] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  });
}
