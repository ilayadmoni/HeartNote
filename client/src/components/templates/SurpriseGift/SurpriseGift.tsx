"use client";

/**
 * SurpriseGift Component
 * Responsive wrapper that renders Desktop or Mobile version
 */

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SurpriseGiftDesktop } from "./Desktop/SurpriseGiftDesktop";
import { SurpriseGiftMobile } from "./Mobile/SurpriseGiftMobile";
import type { SurpriseGiftProps } from "./types";

export function SurpriseGift(props: SurpriseGiftProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return isMobile ? (
    <SurpriseGiftMobile {...props} />
  ) : (
    <SurpriseGiftDesktop {...props} />
  );
}
