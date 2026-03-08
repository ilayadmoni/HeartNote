"use client";

/** SurpriseGiftDesktop – gift box that shakes on click and opens to reveal a greeting. */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showReset, setShowReset] = useState(false);
  const needed = clicksRequired || DEFAULT_CLICKS;

  // Ref prevents confetti re-fire on editor color changes
  const colorsRef = useRef({ primaryColor, ribbonColor });
  colorsRef.current = { primaryColor, ribbonColor };

  useEffect(() => {
    if (!isOpen) return;
    const { primaryColor: pc, ribbonColor: rc } = colorsRef.current;
    const colors = [pc, rc, "#ff6b8a", "#ffd700"];
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
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate">
      <FloatingIcons />
      <BackToGallery className="top-4 right-4 absolute" />
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 py-8">
        {/* Title */}
        <h1
          className="text-3xl font-bold dark:text-white mb-8 text-hebrew-heading text-center"
          style={{ color: primaryColor }}
        >
          {title}
        </h1>

        {/* Gift Box – clickable, shakes - hide when opened */}
        {!isOpen && (
          <motion.button
            onClick={handleClick}
            animate={shaking ? { rotate: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-xl"
            style={
              { focusVisibleRingColor: primaryColor } as React.CSSProperties
            }
            aria-label={`לחצו לנער את המתנה (${clicks}/${needed})`}
          >
            <GiftBox
              boxColor={boxColor}
              ribbonColor={ribbonColor}
              isOpen={false}
              size={220}
            />
          </motion.button>
        )}

        {/* Revealed greeting */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 14,
                delay: 0.2,
              }}
              className="w-full max-w-md rounded-2xl shadow-lg bg-white dark:bg-gray-800 p-6 md:p-8"
            >
              <div className="max-h-[60vh] overflow-y-auto w-full flex justify-center text-center">
                <p
                  className="text-center text-2xl font-bold text-hebrew-heading leading-relaxed whitespace-pre-wrap break-words w-full"
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
                  className="w-full mt-6 text-sm font-medium underline text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  נסו שוב
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 pb-4" />
    </div>
  );
}
