/**
 * CSRF Origin Validation (Strict Mode)
 * ─────────────────────────────────────
 * SEC-HIGH-2: Protects Server Actions from cross-site request forgery.
 *
 * Strictly validates requests against NEXT_PUBLIC_SITE_URL only.
 * NO localhost origins - even in development, use proper env config.
 *
 * Usage in Server Actions:
 *   import { validateOrigin, csrfError } from "@/lib/utils/csrf";
 *
 *   export async function deleteAccount(formData: FormData) {
 *     if (!await validateOrigin()) {
 *       return csrfError();
 *     }
 *     // ... rest of action
 *   }
 */

import { headers } from "next/headers";
import { logger } from "@/lib/utils/logger";

/** Standard error response for CSRF failures */
export const csrfError = () => ({
  success: false,
  error: "בקשה לא חוקית. נא לרענן את הדף ולנסות שוב.",
  code: 403,
});

/**
 * Build the list of allowed origins from environment ONLY.
 * SEC-HIGH-2: No hardcoded localhost - strict environment-based validation.
 */
function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  // Primary site URL (REQUIRED)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    origins.push(siteUrl.replace(/\/$/, ""));
  }

  // Additional allowed origins from environment (comma-separated)
  // Use for staging environments or multiple domains
  const additionalOrigins = process.env.ALLOWED_ORIGINS;
  if (additionalOrigins) {
    additionalOrigins.split(",").forEach((origin) => {
      const trimmed = origin.trim().replace(/\/$/, "");
      if (trimmed) origins.push(trimmed);
    });
  }

  return origins;
}

/**
 * Validate that the request comes from an allowed origin.
 * STRICT MODE: Only environment-configured origins are accepted.
 *
 * @returns `true` if the request is safe, `false` if it should be rejected.
 *
 * Logic:
 * - If no Origin header: Allow (same-origin requests don't send Origin)
 * - If Origin matches whitelist: Allow
 * - Otherwise: Reject
 */
export async function validateOrigin(): Promise<boolean> {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  // Same-origin requests (navigation, same-site fetch) don't send Origin
  // This is safe because browsers enforce same-origin policy
  if (!origin) {
    return true;
  }

  const allowedOrigins = getAllowedOrigins();

  // SECURITY: If no origins configured, reject all cross-origin requests
  if (allowedOrigins.length === 0) {
    logger.error("[CSRF] No allowed origins configured - rejecting request", { origin });
    return false;
  }

  // Check if origin matches any allowed origin
  const isAllowed = allowedOrigins.some((allowed) => {
    // Exact match
    if (origin === allowed) return true;
    // Handle with/without trailing slash
    if (origin === allowed + "/" || origin + "/" === allowed) return true;
    return false;
  });

  if (!isAllowed) {
    logger.warn("[CSRF] Blocked request from unknown origin", { 
      origin,
      allowedOrigins 
    });
  }

  return isAllowed;
}

/**
 * Synchronous version for middleware (where headers() is already resolved).
 */
export function validateOriginSync(origin: string | null): boolean {
  if (!origin) return true;
  
  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.length === 0) return false;
  
  return allowedOrigins.some((allowed) => origin === allowed || origin === allowed + "/");
}
