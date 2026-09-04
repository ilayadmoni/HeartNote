import { useState, useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import type { useTranslations } from "next-intl";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { COLOR_PALETTE } from "@/constants/colors";
import type { SurpriseGiftData } from "@/components/templates/types";

const DEFAULT_BOX_COLOR = COLOR_PALETTE.find((c) => c.name === "Bright Red")!.hex;
const DEFAULT_RIBBON_COLOR = COLOR_PALETTE.find((c) => c.name === "Bright Yellow")!.hex;
const CONFETTI_ACCENT_PINK = COLOR_PALETTE.find((c) => c.name === "Pink")!.hex;
const CONFETTI_ACCENT_YELLOW = COLOR_PALETTE.find((c) => c.name === "Bright Yellow")!.hex;
const DEFAULT_CLICKS = 5;
const SHAKE_PATTERN = [0, -10, 10, -7, 7, -3, 3, 0];

interface ConfettiConfig {
  burst1: { particleCount: number; spread: number };
  burst2: { particleCount: number; spread: number };
}

export function useSurpriseGiftState(
  data: SurpriseGiftData,
  t: ReturnType<typeof useTranslations>,
  confettiConfig: ConfettiConfig,
) {
  const {
    title = t("surpriseGift.titleDefault"),
    greeting = t("surpriseGift.greetingDefault"),
    boxColor = DEFAULT_BOX_COLOR,
    ribbonColor = DEFAULT_RIBBON_COLOR,
    clicksRequired = DEFAULT_CLICKS,
    primaryColor = DEFAULT_PRIMARY_COLOR,
  } = data;

  const [clicks, setClicks] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [boxVisible, setBoxVisible] = useState(true);
  const needed = clicksRequired || DEFAULT_CLICKS;
  const shakeIntensity = 0.55 + (clicks / needed) * 1.05;
  const shakeKeyframes = SHAKE_PATTERN.map((deg) => deg * shakeIntensity);

  // Keep the box mounted briefly after opening so the lid-fly-off spring
  // (GiftBox.tsx lidVariants.open) can finish before AnimatePresence removes it.
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setBoxVisible(false), 400);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const colorsRef = useRef({ primaryColor, ribbonColor });
  colorsRef.current = { primaryColor, ribbonColor };

  useEffect(() => {
    if (!isOpen) return;
    const { primaryColor: pc, ribbonColor: rc } = colorsRef.current;
    const colors = [pc, rc, CONFETTI_ACCENT_PINK, CONFETTI_ACCENT_YELLOW];
    confetti({ ...confettiConfig.burst1, origin: { y: 0.6 }, colors });
    const t1 = setTimeout(() => confetti({ ...confettiConfig.burst2, origin: { y: 0.5 }, colors }), 300);
    const t2 = setTimeout(() => setShowReset(true), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleTap = useCallback(() => {
    if (isOpen) return;
    const next = clicks + 1;
    setClicks(next);
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
    if (next >= needed) setIsOpen(true);
  }, [clicks, isOpen, needed]);

  const handleReset = useCallback(() => {
    setClicks(0);
    setIsOpen(false);
    setShaking(false);
    setShowReset(false);
    setBoxVisible(true);
  }, []);

  return {
    title,
    greeting,
    boxColor,
    ribbonColor,
    primaryColor,
    clicks,
    isOpen,
    shaking,
    showReset,
    boxVisible,
    needed,
    shakeKeyframes,
    handleTap,
    handleReset,
  };
}
