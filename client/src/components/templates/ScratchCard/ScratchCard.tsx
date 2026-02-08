"use client";

/**
 * ScratchCard Component
 * Responsive wrapper that renders Desktop or Mobile version
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScratchCardDesktop } from "./Desktop/ScratchCardDesktop";
import { ScratchCardMobile } from "./Mobile/ScratchCardMobile";
import type { ScratchCardProps } from "./types";

export function ScratchCard(props: ScratchCardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <ScratchCardMobile {...props} />
  ) : (
    <ScratchCardDesktop {...props} />
  );
}
