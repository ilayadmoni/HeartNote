"use client";

import { useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { WeddingGlassDesktop } from "./Desktop/WeddingGlassDesktop";
import { WeddingGlassMobile } from "./Mobile/WeddingGlassMobile";
import type { TemplateComponentProps, WeddingGlassData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";

export function WeddingGlass({ data }: TemplateComponentProps<WeddingGlassData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [isShattered, setIsShattered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  const handleStomp = useCallback(() => {
    setIsShattered(true);
  }, []);

  const handleShatterComplete = useCallback(() => {
    setShowMessage(true);
  }, []);

  const handleReset = useCallback(() => {
    setIsShattered(false);
    setShowMessage(false);
  }, []);

  const sharedProps = {
    data,
    primaryColor,
    isShattered,
    showMessage,
    onStomp: handleStomp,
    onShatterComplete: handleShatterComplete,
    onReset: handleReset,
  };

  if (!mounted) return null;

  return isMobile ? (
    <WeddingGlassMobile {...sharedProps} />
  ) : (
    <WeddingGlassDesktop {...sharedProps} />
  );
}
