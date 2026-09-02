"use client";

/** SurpriseGiftDesktop – gift box that shakes on click and opens to reveal a greeting. */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import { GiftBox, SurpriseGiftReveal } from "../components";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { COLOR_PALETTE } from "@/constants/colors";

const DEFAULT_BOX_COLOR = COLOR_PALETTE.find((c) => c.name === "Bright Red")!.hex;
const DEFAULT_RIBBON_COLOR = COLOR_PALETTE.find((c) => c.name === "Bright Yellow")!.hex;
const CONFETTI_ACCENT_PINK = COLOR_PALETTE.find((c) => c.name === "Pink")!.hex;
const CONFETTI_ACCENT_YELLOW = COLOR_PALETTE.find((c) => c.name === "Bright Yellow")!.hex;
import {
  FooterBranding,
  BackToGallery,
  TemplateResetButton,
} from "@/components/templates/components";
import type { SurpriseGiftProps } from "../types";
import { FloatingIcons } from "../../OpenWhen/components";

const DEFAULT_CLICKS = 5;

export function SurpriseGiftDesktop({ data }: SurpriseGiftProps) {
  const t = useTranslations("templates");
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
  const needed = clicksRequired || DEFAULT_CLICKS;

  // Ref prevents confetti re-fire on editor color changes
  const colorsRef = useRef({ primaryColor, ribbonColor });
  colorsRef.current = { primaryColor, ribbonColor };

  useEffect(() => {
    if (!isOpen) return;
    const { primaryColor: pc, ribbonColor: rc } = colorsRef.current;
    const colors = [pc, rc, CONFETTI_ACCENT_PINK, CONFETTI_ACCENT_YELLOW];
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors });
    const t1 = setTimeout(
      () =>
        confetti({ particleCount: 60, spread: 90, origin: { y: 0.5 }, colors }),
      300,
    );
    const t2 = setTimeout(() => setShowReset(true), 1500); // delay "Try Again"
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClick = useCallback(() => {
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
  }, []);

  return (
    <div className="flex flex-col h-full min-h-[390px] 2xl:min-h-[650px] bg-transparent relative isolate overflow-hidden">
      <FloatingIcons />
      <BackToGallery className="top-4 end-4 absolute" />
      {/* Content Area */}
      <div className="flex-1 flex flex-col w-full max-w-md 2xl:max-w-2xl mx-auto px-6 pt-6 pb-4 2xl:pt-8 2xl:pb-6">
        {/* Title */}
        <h1
          className="text-display-md 2xl:text-display-xl font-bold mb-4 2xl:mb-6 text-center"
          style={{ color: primaryColor }}
          dir="auto"
        >
          {title}
        </h1>

        {/* Stable transition zone — min-height holds the gift box footprint so
            neither the box (absolute) nor the greeting (normal flow) can shift
            surrounding content when they swap. */}
        <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full max-w-md 2xl:max-w-2xl flex items-center justify-center"
            style={{ minHeight: 260 }}
          >
            {/* Gift Box – absolutely positioned so it cannot affect layout height */}
            <AnimatePresence>
              {!isOpen && (
                <motion.button
                  onClick={handleClick}
                  animate={shaking ? { rotate: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  className="absolute cursor-pointer 2xl:scale-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-control"
                  style={{ focusVisibleRingColor: primaryColor } as React.CSSProperties}
                  aria-label={t("surpriseGift.shakeAria", { clicks, needed })}
                >
                  <GiftBox boxColor={boxColor} ribbonColor={ribbonColor} isOpen={false} size={240} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Revealed greeting – normal flow so the container can grow to fit */}
            <AnimatePresence>
              {isOpen && <SurpriseGiftReveal greeting={greeting} primaryColor={primaryColor} />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showReset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-3"
        >
          <TemplateResetButton onClick={handleReset} label={t("common.resetDefault")} />
        </motion.div>
      )}

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 mt-auto pb-4" />
    </div>
  );
}
