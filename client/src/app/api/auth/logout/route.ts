/**
 * Server-side Logout Route
 * Forces the browser to delete SSR auth cookies via Set-Cookie: Max-Age=0.
 *
 * Client-side `supabase.auth.signOut()` only clears in-memory state
 * and localStorage — it does NOT reliably clear httpOnly SSR cookies.
 * This route ensures the server writes proper cookie-clearing headers.
 */

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST() {
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

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[Server Logout] signOut failed:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
