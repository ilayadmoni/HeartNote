"use client";

/** SurpriseGiftDesktop – gift box that shakes on click and opens to reveal a greeting. */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  BackToGallery,
  TemplateResetButton,
} from "@/components/templates/components";
import type { SurpriseGiftProps } from "../types";
import { FloatingIcons } from "../../OpenWhen/components";

const DEFAULT_CLICKS = 5;

export function SurpriseGiftDesktop({ data }: SurpriseGiftProps) {
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
      <BackToGallery className="top-4 right-4 absolute" />
      {/* Content Area */}
      <div className="flex-1 flex flex-col w-full max-w-md 2xl:max-w-2xl mx-auto px-6 pt-6 pb-4 2xl:pt-8 2xl:pb-6">
        {/* Title */}
        <h1
          className="text-3xl 2xl:text-5xl font-bold dark:text-white mb-4 2xl:mb-6 text-hebrew-heading text-center"
          style={{ color: primaryColor }}
        >
          {title}
        </h1>

        <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
          {/* Gift Box – clickable, shakes - hide when opened */}
          {!isOpen && (
            <motion.button
              onClick={handleClick}
              animate={shaking ? { rotate: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer 2xl:scale-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-xl"
              style={
                { focusVisibleRingColor: primaryColor } as React.CSSProperties
              }
              aria-label={`לחצו לנער את המתנה (${clicks}/${needed})`}
            >
              <GiftBox
                boxColor={boxColor}
                ribbonColor={ribbonColor}
                isOpen={false}
                size={240}
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
                className="w-full max-w-md 2xl:max-w-2xl rounded-2xl 2xl:rounded-3xl shadow-lg bg-white dark:bg-gray-800 p-6 md:p-8 2xl:p-12"
              >
                <div className="w-full flex justify-center text-center">
                  <p
                    className="text-center text-2xl 2xl:text-4xl font-bold text-hebrew-heading leading-relaxed whitespace-pre-wrap break-words w-full"
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
            <TemplateResetButton onClick={handleReset} label="שחק שוב" />
          </motion.div>
        )}

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 mt-auto pb-4" />
    </div>
  );
}
