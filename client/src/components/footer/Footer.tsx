"use client";

/**
 * Footer Component
 * Main footer with responsive wrapper
 */

import { usePathname } from "@/i18n/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FooterDesktop } from "./Desktop/FooterDesktop";
import { FooterMobile } from "./Mobile/FooterMobile";
import type { FooterProps } from "./types";

export function Footer(props: FooterProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Hide footer only on preview frame (iframe content)
  if (pathname?.startsWith("/preview-frame")) {
    return null;
  }

  return isMobile ? <FooterMobile {...props} /> : <FooterDesktop {...props} />;
}
