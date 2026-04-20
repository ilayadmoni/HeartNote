"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PunchingBagDesktopProps } from "../types";
import {
  FooterBranding,
  BackToGallery,
  TemplateResetButton,
} from "@/components/templates/components";

export function PunchingBagDesktop({
  data,
  hits,
  hitsRequired,
  isDone,
  isTilting,
  bagColor,
  primaryColor,
  onHit,
  onReset,
}: PunchingBagDesktopProps) {
  const remaining = hitsRequired - hits;

  return (
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate overflow-hidden">
      <BackToGallery className="absolute top-4 right-4" />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {!isDone ? (
            <motion.div
              key="bag-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center mb-10"
              >
                <h2
                  className="text-2xl font-bold text-hebrew-heading mb-2 break-words"
                  style={{ color: primaryColor }}
                >
                  {data.introTitle ?? "מערכת לשחרור לחצים"}
                </h2>
                <p
                  className="text-hebrew-body break-words"
                  style={{ color: primaryColor, opacity: 0.75 }}
                >
                  {data.introSubtitle ?? "תני לזה כמה מכות טובות. הכל בסדר."}
                </p>
              </motion.div>

              {/* Rope + Bag */}
              <div className="flex flex-col items-center mb-10">
                {/* Rope */}
                <div className="w-0.5 h-14 bg-gray-300" />

                {/* Bag */}
                <motion.div
                  animate={isTilting ? { rotate: [0, -18, 14, -8, 5, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="cursor-pointer select-none"
                  onClick={onHit}
                  role="button"
                  aria-label="הכה בשק"
                >
                  <div
                    className="w-32 h-48 rounded-[60px] shadow-2xl flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: bagColor }}
                  >
                    <span className="text-white/60 font-bold text-5xl tabular-nums">
                      {remaining}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Hit instructions */}
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-medium text-hebrew-body break-words text-center max-w-xs"
                style={{ color: primaryColor, opacity: 0.7 }}
              >
                {data.hitInstructions ?? "הקישי על השק כדי להרביץ"}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="result-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              {/* Heart icon */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mb-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill={primaryColor}
                  stroke={primaryColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </motion.div>

              <h2
                className="text-3xl font-bold text-hebrew-heading mb-4 break-words"
                style={{ color: primaryColor }}
              >
                {data.resultTitle ?? "אאוץ׳... זה שחרר?"}
              </h2>

              <p className="text-xl text-[#415a77] max-w-md mb-8 text-hebrew-body leading-relaxed break-words">
                {data.resultMessage}
              </p>

              <TemplateResetButton onClick={onReset} label="אני עדיין עצבנית, תביא את השק" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterBranding className="shrink-0 pb-4 relative z-10" />
    </div>
  );
}
