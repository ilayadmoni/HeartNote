"use client";

import { useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BarBatMitzvahDesktop } from "./Desktop/BarBatMitzvahDesktop";
import { BarBatMitzvahMobile } from "./Mobile/BarBatMitzvahMobile";
import type { TemplateComponentProps, BarBatMitzvahData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";

export function BarBatMitzvah({ data }: TemplateComponentProps<BarBatMitzvahData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [isThrowing, setIsThrowing] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsThrowing(false);
    setShowGreeting(false);
    setBurstKey(0);
  }, [data.kind]);

  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  const handleReveal = useCallback(() => {
    if (isThrowing || showGreeting) return;
    setIsThrowing(true);
    setBurstKey((k) => k + 1);
    setTimeout(() => {
      setShowGreeting(true);
      setIsThrowing(false);
    }, 600);
  }, [isThrowing, showGreeting]);

  const handleReset = useCallback(() => {
    setShowGreeting(false);
  }, []);

  const handleBurstComplete = useCallback(() => {
    setBurstKey(0);
  }, []);

  const sharedProps = {
    data,
    primaryColor,
    isThrowing,
    showGreeting,
    burstKey,
    onReveal: handleReveal,
    onReset: handleReset,
    onBurstComplete: handleBurstComplete,
  };

  if (!mounted) return null;

  return isMobile ? (
    <BarBatMitzvahMobile {...sharedProps} />
  ) : (
    <BarBatMitzvahDesktop {...sharedProps} />
  );
}
