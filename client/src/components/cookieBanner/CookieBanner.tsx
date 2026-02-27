"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CookieBannerDesktop } from "./Desktop/CookieBannerDesktop";
import { CookieBannerMobile } from "./Mobile/CookieBannerMobile";
import { useCookieConsent } from "./hooks/useCookieConsent";

/**
 * Responsive cookie‑consent banner.
 * Renders nothing until the component has mounted on the client
 * (avoids SSR / hydration mismatches caused by localStorage access).
 */
export function CookieBanner() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isVisible, isMounted, acceptAll, rejectAll } = useCookieConsent();

  // Prevent rendering during SSR and after consent is given
  if (!isMounted || !isVisible) return null;

  const props = { onAcceptAll: acceptAll, onRejectAll: rejectAll };

  return isMobile ? (
    <CookieBannerMobile {...props} />
  ) : (
    <CookieBannerDesktop {...props} />
  );
}
