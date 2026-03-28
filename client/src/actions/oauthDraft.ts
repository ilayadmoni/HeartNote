"use server";

/**
 * OAuth Draft Cookie Actions
 *
 * Handles setting/clearing the pending_draft_id cookie for OAuth flows.
 * This bypasses the unreliable URL query parameter approach that fails
 * on mobile browsers due to nested query string truncation.
 *
 * Flow:
 * 1. Client calls setOAuthDraftCookie() before triggering OAuth
 * 2. OAuth redirect happens (no draft_id in URL)
 * 3. Callback route reads cookie, appends draft_id to final redirect
 * 4. Cookie is deleted immediately after reading
 */

import { cookies } from "next/headers";

const COOKIE_NAME = "pending_oauth_draft";
const COOKIE_MAX_AGE = 600; // 10 minutes — enough for OAuth flow

export interface OAuthDraftData {
  draftId: string;
  templateSlug: string;
}

/**
 * Sets the pending OAuth draft cookie before redirecting to Google.
 * Called from LoginModal before signInWithOAuth.
 */
export async function setOAuthDraftCookie(data: OAuthDraftData): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/**
 * Reads and deletes the pending OAuth draft cookie.
 * Called from the auth callback route after successful authentication.
 * Returns null if no cookie exists (e.g., email/password login).
 */
export async function consumeOAuthDraftCookie(): Promise<OAuthDraftData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);

  if (!cookie?.value) {
    return null;
  }

  // Delete the cookie immediately after reading
  cookieStore.delete(COOKIE_NAME);

  try {
    return JSON.parse(cookie.value) as OAuthDraftData;
  } catch {
    console.error("[oauthDraft] Failed to parse draft cookie:", cookie.value);
    return null;
  }
}

/**
 * Clears the pending OAuth draft cookie without reading.
 * Use this if the OAuth flow is cancelled or fails.
 */
export async function clearOAuthDraftCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
