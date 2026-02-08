"use client";

/**
 * OpenWhen Component
 * Responsive wrapper — delegates to Desktop or Mobile layout
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { OpenWhenDesktop } from "./Desktop/OpenWhenDesktop";
import { OpenWhenMobile } from "./Mobile/OpenWhenMobile";
import type { TemplateComponentProps, OpenWhenData } from "./types";

export function OpenWhen({ data }: TemplateComponentProps<OpenWhenData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <OpenWhenMobile data={data} />
  ) : (
    <OpenWhenDesktop data={data} />
  );
}
