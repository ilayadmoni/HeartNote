"use client";

/**
 * ScratchCard Component
 * Responsive wrapper that renders Desktop or Mobile version
 */

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScratchCardDesktop } from "./Desktop/ScratchCardDesktop";
import { ScratchCardMobile } from "./Mobile/ScratchCardMobile";
import type { ScratchCardProps } from "./types";

export function ScratchCard(props: ScratchCardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return isMobile ? (
    <ScratchCardMobile {...props} />
  ) : (
    <ScratchCardDesktop {...props} />
  );
}
