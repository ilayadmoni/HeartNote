"use client";

/**
 * SurpriseGiftMobile Component
 * Gift box that shakes on tap and opens to reveal a greeting (mobile).
 * Max 150 lines per project rules.
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { GiftBox } from "../components";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { FooterBranding, BackToGallery } from "@/components/templates/components";
import type { SurpriseGiftProps } from "../types";

const DEFAULT_CLICKS = 5;

export function SurpriseGiftMobile({ data }: SurpriseGiftProps) {
  const {
    title = "יש לך הפתעה! 🎁",
    greeting = "!אוהב/ת אותך",
    boxColor = "#e74c5e",
    ribbonColor = "#ffd700",
    clicksRequired = DEFAULT_CLICKS,
    primaryColor = DEFAULT_PRIMARY_COLOR,
  } = data;

  const [clicks, setClicks] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [shaking, setShaking] = useState(false);

  const needed = clicksRequired || DEFAULT_CLICKS;

  // Fire confetti on open
  useEffect(() => {
    if (!isOpen) return;
    const colors = [primaryColor, ribbonColor, "#ff6b8a", "#ffd700"];
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors });
    const t = setTimeout(
      () => confetti({ particleCount: 50, spread: 80, origin: { y: 0.5 }, colors }),
      300,
    );
    return () => clearTimeout(t);
  }, [isOpen, primaryColor, ribbonColor]);

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
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#fdf6f3] dark:bg-gray-900 px-4 py-6 overflow-auto relative">
      <BackToGallery className="absolute top-3 right-3 z-20" />

      {/* Title */}
      <h1 className="text-2xl font-bold text-[#5d4e37] dark:text-white mb-6 text-hebrew-heading text-center">
        {title}
      </h1>

      {/* Gift Box – tappable, shakes */}
      <motion.button
        onClick={handleTap}
        animate={shaking ? { rotate: [0, -10, 10, -7, 7, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        whileTap={!isOpen ? { scale: 0.95 } : {}}
        className="cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-xl"
        aria-label={isOpen ? "המתנה נפתחה" : `הקישו לנער (${clicks}/${needed})`}
      >
        <GiftBox
          boxColor={boxColor}
          ribbonColor={ribbonColor}
          isOpen={isOpen}
          size={180}
        />
      </motion.button>

      {/* Progress indicator */}
      {!isOpen && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
          {clicks}/{needed} הקשות 🎁
        </p>
      )}

      {/* Revealed greeting */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="mt-6 text-center max-w-xs px-2"
          >
            <p
              className="text-xl font-bold text-hebrew-heading leading-relaxed whitespace-pre-line"
              style={{ color: primaryColor }}
            >
              {greeting}
            </p>
            <button
              onClick={handleReset}
              className="mt-5 text-sm underline text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              נסו שוב
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterBranding />
    </div>
  );
}
