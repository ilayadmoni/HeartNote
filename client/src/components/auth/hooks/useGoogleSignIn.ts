"use client";

import { useState, useCallback } from "react";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { logger } from "@/lib/utils/logger";
import { setOAuthDraftCookie } from "@/actions/oauthDraft";

/** Google OAuth sign-in trigger, split out of useAuthModalState. */
export function useGoogleSignIn(redirectTo?: string | null) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = useCallback(async () => {
    setIsGoogleLoading(true);
    try {
      const siteUrl = window.location.origin || process.env.NEXT_PUBLIC_SITE_URL || "";
      const targetPath = redirectTo || window.location.pathname + window.location.search;
      const targetUrl = new URL(targetPath, siteUrl);
      const draftId = targetUrl.searchParams.get("draft_id");
      const pathSegments = targetUrl.pathname.split("/").filter(Boolean);
      const templateSlug = pathSegments[pathSegments.length - 1] || "";

      if (draftId && templateSlug) {
        try { await setOAuthDraftCookie({ draftId, templateSlug }); }
        catch (e) { logger.error("[OAuth] Failed to set draft cookie", { error: e }); }
      }

      await nextAuthSignIn("google", { callbackUrl: targetUrl.pathname || "/" });
    } catch (err) {
      logger.error("[OAuth] Unexpected error", { error: err });
      setIsGoogleLoading(false);
    }
  }, [redirectTo]);

  return { isGoogleLoading, handleGoogleSignIn, resetGoogleLoading: () => setIsGoogleLoading(false) };
}
