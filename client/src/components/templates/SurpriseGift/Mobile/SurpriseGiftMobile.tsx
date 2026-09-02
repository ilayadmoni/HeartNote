"use client";

/** SurpriseGiftMobile – gift box that shakes on tap and opens to reveal a greeting. */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import confetti from "canvas-confetti";
import { GiftBox } from "../components";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { COLOR_PALETTE } from "@/constants/colors";

const DEFAULT_BOX_COLOR = COLOR_PALETTE.find((c) => c.name === "Bright Red")!.hex;
const DEFAULT_RIBBON_COLOR = COLOR_PALETTE.find((c) => c.name === "Bright Yellow")!.hex;
const CONFETTI_ACCENT_PINK = COLOR_PALETTE.find((c) => c.name === "Pink")!.hex;
const CONFETTI_ACCENT_YELLOW = COLOR_PALETTE.find((c) => c.name === "Bright Yellow")!.hex;
import {
  FooterBranding,
  TemplateResetButton,
} from "@/components/templates/components";
import type { SurpriseGiftProps } from "../types";
import { FloatingIcons } from "../../OpenWhen/components";

const DEFAULT_CLICKS = 5;

export function SurpriseGiftMobile({ data }: SurpriseGiftProps) {
  const {
    title = "יש לך הפתעה! 🎁",
    greeting = "!אוהב/ת אותך",
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
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors });
    const t1 = setTimeout(
      () =>
        confetti({ particleCount: 50, spread: 80, origin: { y: 0.5 }, colors }),
      300,
    );
    const t2 = setTimeout(() => setShowReset(true), 1500); // delay "Try Again"
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
  }, []);

  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");

  return (
    <div
      className={`w-full flex flex-col justify-between items-center gap-6 bg-transparent px-4 py-6 overflow-auto relative isolate ${
        isCreateRoute ? "min-h-[450px]" : "min-h-[650px]"
      }`}
    >
      <FloatingIcons />
      {/* Main Content - Top */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Title */}
        <h1
          className="text-2xl font-bold dark:text-white mb-6 text-hebrew-heading text-center"
          style={{ color: primaryColor }}
        >
          {title}
        </h1>

        {/* Stable transition zone — min-height holds the gift box footprint so
            neither the box (absolute) nor the greeting (normal flow) can shift
            surrounding content when they swap. */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{ minHeight: 200 }}
        >
          {/* Gift Box – absolutely positioned so it cannot affect layout height */}
          <AnimatePresence>
            {!isOpen && (
              <motion.button
                onClick={handleTap}
                animate={shaking ? { rotate: [0, -10, 10, -7, 7, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.95 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="absolute cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-xl"
                aria-label={`הקישו לנער (${clicks}/${needed})`}
              >
                <GiftBox
                  boxColor={boxColor}
                  ribbonColor={ribbonColor}
                  isOpen={false}
                  size={180}
                />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Revealed greeting – normal flow so the container can grow to fit */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 14,
                  delay: 0.2,
                }}
                className="w-full rounded-2xl shadow-lg bg-white dark:bg-gray-800 p-4 sm:p-6"
              >
                <div className="max-h-[50vh] overflow-y-auto">
                  <p
                    className="text-lg sm:text-xl font-bold text-hebrew-heading leading-relaxed whitespace-pre-wrap break-words text-center"
                    style={{ color: primaryColor }}
                  >
                    {greeting}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showReset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-3"
        >
          <TemplateResetButton onClick={handleReset} label="נסה שוב" />
        </motion.div>
      )}

      {/* Footer Credit - Bottom */}
      <FooterBranding className="mx-auto" />
    </div>
  );
}
