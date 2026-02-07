"use client";

/**
 * Footer Component
 * Main footer with responsive wrapper
 */

import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FooterDesktop } from "./Desktop/FooterDesktop";
import { FooterMobile } from "./Mobile/FooterMobile";
import type { FooterProps } from "./types";

export function Footer(props: FooterProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Hide footer on create pages (editor) and preview frame
  if (
    pathname?.startsWith("/create") ||
    pathname?.startsWith("/preview-frame")
  ) {
    return null;
  }

  return isMobile ? <FooterMobile {...props} /> : <FooterDesktop {...props} />;
}
