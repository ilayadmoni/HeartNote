"use client";

/**
 * Footer Component
 * Main footer with responsive wrapper
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FooterDesktop } from "./Desktop/FooterDesktop";
import { FooterMobile } from "./Mobile/FooterMobile";
import type { FooterProps } from "./types";

export function Footer(props: FooterProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? <FooterMobile {...props} /> : <FooterDesktop {...props} />;
}
