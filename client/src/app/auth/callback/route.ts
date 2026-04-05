/**
 * Auth Callback Route Handler (Crash-Proof)
 *
 * Handles OAuth code exchange and token verification.
 * CRITICAL: Every code path MUST end with a redirect.
 * SEC-HIGH-1: Uses logger for PII-safe logging.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createCallbackClient,
  fetchProfileWithRetry,
  isProfileIncomplete,
} from "./helpers";
import { logger } from "@/lib/utils/logger";

const DEFAULT_PATH = "/";
const ERROR_PATH = "/auth/auth-code-error";
const RECOVERY_PATH = "/?modal=reset-password";
const DRAFT_COOKIE = "pending_oauth_draft";

// ── Get the public site URL (ngrok in dev, production URL in prod) ──
function getSiteUrl(request: NextRequest): string {
  // Always prefer the configured site URL for proxy/tunnel scenarios
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ""); // Remove trailing slash
  }
  // Fallback to request origin (works when not behind proxy)
  return request.nextUrl.origin;
}

// ── Inline URL validation (no external imports) ─────────────────────
function isSafeInternalPath(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  if (!url.startsWith("/")) return false;
  if (url.startsWith("//")) return false;
  return true;
}

// ── Safe redirect helper (uses NEXT_PUBLIC_SITE_URL) ─────────────────
function redirect(request: NextRequest, path: string): NextResponse {
  try {
    const siteUrl = getSiteUrl(request);
    const url = new URL(path, siteUrl);
    logger.info("[callback] Redirecting to", { url: url.toString() });
    return NextResponse.redirect(url);
  } catch (e) {
    logger.error("[callback] Redirect URL construction failed", { error: e });
    const siteUrl = getSiteUrl(request);
    return NextResponse.redirect(new URL("/", siteUrl));
  }
}

// ── Error redirect helper ────────────────────────────────────────────
function errorRedirect(request: NextRequest, msg: string): NextResponse {
  try {
    const siteUrl = getSiteUrl(request);
    const url = new URL(ERROR_PATH, siteUrl);
    url.searchParams.set("message", msg);
    return NextResponse.redirect(url);
  } catch {
    const siteUrl = getSiteUrl(request);
    return NextResponse.redirect(new URL("/", siteUrl));
  }
}

// ── Read and consume draft cookie ────────────────────────────────────
async function getDraftFromCookie(): Promise<{ draftId: string; templateSlug: string } | null> {
  try {
    const store = await cookies();
    const cookie = store.get(DRAFT_COOKIE);
    if (!cookie?.value) return null;
    
    // Delete immediately
    try { store.delete(DRAFT_COOKIE); } catch { /* ignore */ }
    
    const data = JSON.parse(cookie.value);
    if (data?.draftId && data?.templateSlug) {
      logger.info("[callback] Draft cookie found", { draftId: data.draftId });
      return data;
    }
    return null;
  } catch (e) {
    logger.error("[callback] Cookie error", { error: e });
    return null;
  }
}

// ── Build final redirect path ────────────────────────────────────────
function buildFinalPath(
  basePath: string,
  draft: { draftId: string; templateSlug: string } | null
): string {
  // Clean the base path (remove any existing draft_id)
  let cleanPath = basePath || "/";
  try {
    const url = new URL(cleanPath, "http://x");
    url.searchParams.delete("draft_id");
    cleanPath = url.pathname + url.search;
    if (cleanPath === "?") cleanPath = "/";
  } catch { /* use as-is */ }

  // No draft? Return clean path
  if (!draft) return cleanPath || "/";

  // Append draft_id
  try {
    if (cleanPath.startsWith("/create/")) {
      const url = new URL(cleanPath, "http://x");
      url.searchParams.set("draft_id", draft.draftId);
      return url.pathname + url.search;
    }
    // Default: go to create page with draft
    return `/create/${draft.templateSlug}?draft_id=${draft.draftId}`;
  } catch {
    return `/create/${draft.templateSlug}?draft_id=${draft.draftId}`;
  }
}

/* ══════════════════════════════════════════════════════════════════ */
/*  GET Handler                                                        */
/* ══════════════════════════════════════════════════════════════════ */

export async function GET(request: NextRequest): Promise<NextResponse> {
  logger.info("[callback] Processing auth callback", { url: request.url });

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const next = searchParams.get("next") || "";

    // Sanitize "next" param
    const basePath = isSafeInternalPath(next) ? next : DEFAULT_PATH;

    // ── OAuth Code Exchange ────────────────────────────────────────
    if (code) {
      logger.info("[callback] Exchanging OAuth code");

      const supabase = await createCallbackClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        logger.error("[callback] Exchange error", { message: error.message });
        return errorRedirect(request, error.message || "Authentication failed");
      }

      logger.info("[callback] Exchange success", { userId: data?.user?.id });

      // Get draft from cookie
      const draft = await getDraftFromCookie();
      const finalPath = buildFinalPath(basePath, draft);
      logger.info("[callback] Final path", { path: finalPath });

      // Check profile completeness
      const userId = data?.user?.id;
      if (userId) {
        try {
          const profile = await fetchProfileWithRetry(supabase, userId);
          if (isProfileIncomplete(profile)) {
            logger.info("[callback] Profile incomplete → onboarding");
            const siteUrl = getSiteUrl(request);
            const onboardUrl = new URL("/complete-profile", siteUrl);
            if (finalPath !== "/") {
              onboardUrl.searchParams.set("next", finalPath);
            }
            return NextResponse.redirect(onboardUrl);
          }
        } catch (e) {
          logger.error("[callback] Profile check failed", { error: e });
          // Continue anyway
        }
      }

      return redirect(request, finalPath);
    }

    // ── Token Hash Verification (email links) ──────────────────────
    if (tokenHash && type) {
      logger.info("[callback] Verifying token hash", { type });

      const otpType = type === "signup" ? "email" : type;
      if (otpType !== "email" && otpType !== "recovery") {
        return errorRedirect(request, "Unsupported verification type");
      }

      const supabase = await createCallbackClient();
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: otpType,
      });

      if (error) {
        logger.error("[callback] OTP error", { message: error.message });
        return errorRedirect(request, error.message || "Verification failed");
      }

      if (otpType === "recovery") {
        return redirect(request, RECOVERY_PATH);
      }

      const siteUrl = getSiteUrl(request);
      const successUrl = new URL(basePath, siteUrl);
      successUrl.searchParams.set("verified", "true");
      return NextResponse.redirect(successUrl);
    }

    // ── No valid params ────────────────────────────────────────────
    logger.error("[callback] Missing code or token_hash");
    return errorRedirect(request, "Missing authentication parameters");

  } catch (fatalError) {
    // ── FATAL: Catch-all ───────────────────────────────────────────
    logger.error("[callback] FATAL error", { error: fatalError });
    try {
      const siteUrl = getSiteUrl(request);
      return NextResponse.redirect(new URL("/?auth_error=1", siteUrl));
    } catch {
      return new NextResponse(null, {
        status: 302,
        headers: { Location: "/" },
      });
    }
  }
}
