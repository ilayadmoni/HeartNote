"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PunchingBagMobileProps } from "../types";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";

export function PunchingBagMobile({
  data,
  hits,
  hitsRequired,
  isDone,
  isTilting,
  bagColor,
  onHit,
  onReset,
}: PunchingBagMobileProps) {
  const remaining = hitsRequired - hits;

  return (
    <div className="w-full flex flex-col min-h-[500px] bg-transparent relative isolate overflow-hidden px-4 py-6">
      <BackToGallery className="mb-4" />

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          {!isDone ? (
            <motion.div
              key="bag-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full gap-6"
            >
              {/* Header */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-[#1b263b] text-hebrew-heading mb-1">
                  {data.introTitle ?? "מערכת לשחרור לחצים"}
                </h2>
                <p className="text-sm text-[#415a77] text-hebrew-body">
                  {data.introSubtitle ?? "תני לזה כמה מכות טובות. הכל בסדר."}
                </p>
              </div>

              {/* Rope + Bag */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-10 bg-gray-300" />
                <motion.div
                  animate={isTilting ? { rotate: [0, -18, 14, -8, 5, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="cursor-pointer select-none"
                  onClick={onHit}
                  role="button"
                  aria-label="הכה בשק"
                >
                  <div
                    className="w-24 h-36 rounded-[50px] shadow-xl flex items-center justify-center active:scale-95 transition-transform"
                    style={{ backgroundColor: bagColor }}
                  >
                    <span className="text-white/60 font-bold text-4xl tabular-nums">
                      {remaining}
                    </span>
                  </div>
                </motion.div>
              </div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm text-[#415a77] font-medium text-hebrew-body"
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
              className="flex flex-col items-center text-center gap-4"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="#d4826f"
                  stroke="#d4826f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </motion.div>

              <h2 className="text-2xl font-bold text-[#1b263b] text-hebrew-heading">
                {data.resultTitle ?? "אאוץ׳... זה שחרר?"}
              </h2>

              <p className="text-lg text-[#415a77] max-w-xs text-hebrew-body leading-relaxed">
                {data.resultMessage}
              </p>

              <button
                onClick={onReset}
                className="text-sm text-[#415a77] hover:text-[#1b263b] underline transition-colors text-hebrew-body mt-2"
              >
                אני עדיין עצבנית, תביא את השק
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterBranding className="mx-auto mt-4" />
    </div>
  );
}
