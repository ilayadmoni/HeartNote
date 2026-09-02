/**
 * Shared helpers for the password reset flow (request + update).
 * Extracted to keep each action file under the 150-line cap.
 */

import { headers } from "next/headers";

export interface PasswordActionResult {
  success?: string;
  error?: string;
}

export const MAX_RESET_ATTEMPTS = 3;
export const RATE_WINDOW_HOURS = 24;

/** Extract client IP from request headers */
export async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    headerStore.get("cf-connecting-ip") || // Cloudflare
    "unknown"
  );
}
