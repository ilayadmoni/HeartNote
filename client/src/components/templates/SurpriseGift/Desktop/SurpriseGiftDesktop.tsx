"use client";

/**
 * SurpriseGiftDesktop Component
 * Gift box that shakes on click and opens to reveal a greeting (desktop).
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

export function SurpriseGiftDesktop({ data }: SurpriseGiftProps) {
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

  // Fire confetti when box opens
  useEffect(() => {
    if (!isOpen) return;
    const colors = [primaryColor, ribbonColor, "#ff6b8a", "#ffd700"];
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors });
    const t = setTimeout(
      () => confetti({ particleCount: 60, spread: 90, origin: { y: 0.5 }, colors }),
      300,
    );
    return () => clearTimeout(t);
  }, [isOpen, primaryColor, ribbonColor]);

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
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f5] dark:bg-gray-900 relative overflow-hidden">
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 py-8">
        <BackToGallery className="mb-4" />

        {/* Title */}
      <h1 className="text-3xl font-bold text-[#5d4e37] dark:text-white mb-8 text-hebrew-heading text-center">
        {title}
      </h1>

      {/* Gift Box – clickable, shakes */}
      <motion.button
        onClick={handleClick}
        animate={shaking ? { rotate: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        whileHover={!isOpen ? { scale: 1.05 } : {}}
        className="cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-xl"
        style={{ focusVisibleRingColor: primaryColor } as React.CSSProperties}
        aria-label={isOpen ? "המתנה נפתחה" : `לחצו לנער את המתנה (${clicks}/${needed})`}
      >
        <GiftBox
          boxColor={boxColor}
          ribbonColor={ribbonColor}
          isOpen={isOpen}
          size={220}
        />
      </motion.button>

      {/* Progress indicator */}
      {!isOpen && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
          {clicks}/{needed} לחיצות 🎁
        </p>
      )}

      {/* Revealed greeting */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
            className="mt-8 text-center max-w-md"
          >
            <p
              className="text-2xl font-bold text-hebrew-heading leading-relaxed whitespace-pre-line"
              style={{ color: primaryColor }}
            >
              {greeting}
            </p>
            <button
              onClick={handleReset}
              className="mt-6 text-sm underline text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              נסו שוב
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 pb-4" />
    </div>
  );
}
