"use client";

/** SurpriseGiftMobile – gift box that shakes on tap and opens to reveal a greeting. */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import confetti from "canvas-confetti";
import { GiftBox } from "../components";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";
import type { SurpriseGiftProps } from "../types";
import { FloatingIcons } from "../../OpenWhen/components";

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
  const [showReset, setShowReset] = useState(false);
  const needed = clicksRequired || DEFAULT_CLICKS;

  // Ref prevents confetti re-fire on editor color changes
  const colorsRef = useRef({ primaryColor, ribbonColor });
  colorsRef.current = { primaryColor, ribbonColor };

  useEffect(() => {
    if (!isOpen) return;
    const { primaryColor: pc, ribbonColor: rc } = colorsRef.current;
    const colors = [pc, rc, "#ff6b8a", "#ffd700"];
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
        isCreateRoute ? "min-h-[400px]" : "min-h-[650px]"
      }`}
    >
      <FloatingIcons />
      {/* Main Content - Top */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <BackToGallery className="mb-3" />

        {/* Title */}
        <h1
          className="text-2xl font-bold dark:text-white mb-6 text-hebrew-heading text-center"
          style={{ color: primaryColor }}
        >
          {title}
        </h1>

        {/* Gift Box – only show when not opened */}
        {!isOpen && (
          <motion.button
            onClick={handleTap}
            animate={shaking ? { rotate: [0, -10, 10, -7, 7, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-xl"
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

        {/* Revealed greeting - only show text when opened */}
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
              {showReset && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  onClick={handleReset}
                  className="w-full mt-5 text-sm font-medium underline text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  נסו שוב
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Credit - Bottom */}
      <FooterBranding className="mx-auto" />
    </div>
  );
}
