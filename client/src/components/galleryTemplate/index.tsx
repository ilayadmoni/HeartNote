"use client";

/**
 * GalleryTemplate Component
 * Main export with responsive wrapper for Desktop/Mobile views
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { GalleryTemplateDesktop } from "./Desktop/GalleryTemplateDesktop";
import { GalleryTemplateMobile } from "./Mobile/GalleryTemplateMobile";
import type { GalleryTemplateProps } from "./types";

export function GalleryTemplate(props: GalleryTemplateProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <GalleryTemplateMobile {...props} />
  ) : (
    <GalleryTemplateDesktop {...props} />
  );
}

export default GalleryTemplate;
