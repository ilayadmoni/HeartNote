"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { WeddingGlassDesktop } from "./Desktop/WeddingGlassDesktop";
import { WeddingGlassMobile } from "./Mobile/WeddingGlassMobile";
import { fireShatterConfetti } from "./components/fireShatterConfetti";
import type { TemplateComponentProps, WeddingGlassData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";

const LIFT_DURATION_MS = 600;

export function WeddingGlass({ data }: TemplateComponentProps<WeddingGlassData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [isStomping, setIsStomping] = useState(false);
  const [isShattered, setIsShattered] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  const handleStomp = useCallback(() => {
    if (isStomping || isShattered) return;
    setIsStomping(true);

    const impactTimer = setTimeout(() => {
      setIsStomping(false);
      setIsShattered(true);
      setShakeKey((k) => k + 1);
      fireShatterConfetti(primaryColor, confettiCanvasRef.current);
    }, LIFT_DURATION_MS);

    timers.current.push(impactTimer);
  }, [isStomping, isShattered, primaryColor]);

  const handleShatterComplete = useCallback(() => {
    setShowMessage(true);
  }, []);

  const handleReset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setIsStomping(false);
    setIsShattered(false);
    setShowMessage(false);
    setShakeKey(0);
  }, []);

  const sharedProps = {
    data,
    primaryColor,
    isStomping,
    isShattered,
    showMessage,
    shakeKey,
    confettiCanvasRef,
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
