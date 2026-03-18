/**
 * Auth Callback Helpers
 * Standard Supabase server client for Route Handlers,
 * profile fetching with retry, and profile completeness check.
 *
 * Cookie strategy: In Next.js App Router Route Handlers,
 * `cookies().set()` writes directly to the outgoing response —
 * including redirects. No manual cookie injection is needed.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface ProfileRow {
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
}

/** Maximum retries when the profile row hasn't been created yet. */
const MAX_PROFILE_RETRIES = 3;

/** Milliseconds between retries — bridges `handle_new_user` trigger lag. */
const PROFILE_RETRY_DELAY_MS = 200;

/* ------------------------------------------------------------------ */
/*  Supabase client for Route Handlers                                  */
/* ------------------------------------------------------------------ */

/**
 * Creates a standard Supabase server client for Route Handlers.
 *
 * `setAll` writes directly to the `cookieStore`, which Next.js
 * automatically merges into the outgoing response (even redirects).
 * There is no manual cookie array — this avoids the duplicated
 * Set-Cookie headers that Chrome silently rejects.
 */
export async function createCallbackClient() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  return supabase;
}

/* ------------------------------------------------------------------ */
/*  Profile fetching with retry                                         */
/* ------------------------------------------------------------------ */

/**
 * Query the `profiles` table with a small retry loop.
 *
 * The `handle_new_user` trigger fires `AFTER INSERT ON auth.users`.
 * For a brand-new user, `exchangeCodeForSession` may return before
 * the trigger has committed the profile row. A short retry
 * (≤ 600 ms total) bridges that gap.
 */
export async function fetchProfileWithRetry(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
): Promise<ProfileRow | null> {
  for (let attempt = 0; attempt < MAX_PROFILE_RETRIES; attempt++) {
    const { data } = await supabase
      .from("profiles")
      .select("first_name, last_name, date_of_birth")
      .eq("id", userId)
      .maybeSingle();

    if (data) return data as ProfileRow;

    // Profile row hasn't been created yet — wait & retry.
    if (attempt < MAX_PROFILE_RETRIES - 1) {
      await new Promise((r) => setTimeout(r, PROFILE_RETRY_DELAY_MS));
    }
  }

  // After all retries the row still doesn't exist — treat as incomplete.
  return null;
}

/* ------------------------------------------------------------------ */
/*  Profile completeness check                                          */
/* ------------------------------------------------------------------ */

function isNonEmpty(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Returns `true` when the profile is missing any required field.
 * Aligned with the middleware's completeness definition.
 */
export function isProfileIncomplete(profile: ProfileRow | null): boolean {
  if (!profile) return true;
  return (
    !isNonEmpty(profile.first_name) ||
    !isNonEmpty(profile.last_name) ||
    !isNonEmpty(profile.date_of_birth)
  );
}
