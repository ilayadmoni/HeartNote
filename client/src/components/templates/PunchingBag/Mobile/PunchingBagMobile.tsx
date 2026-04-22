"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { PunchingBagMobileProps } from "../types";
import {
  FooterBranding,
  TemplateResetButton,
} from "@/components/templates/components";

export function PunchingBagMobile({
  data,
  hits,
  hitsRequired,
  isDone,
  isTilting,
  bagColor,
  primaryColor,
  onHit,
  onReset,
}: PunchingBagMobileProps) {
  const remaining = hitsRequired - hits;
  const [showPunch, setShowPunch] = useState(false);

  function handleHit() {
    setShowPunch(true);
    onHit();
    setTimeout(() => setShowPunch(false), 150);
  }

  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');

  return (
    <div className={`w-full flex flex-col bg-transparent relative isolate overflow-hidden px-4 py-6 ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[650px]'
    }`}>
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
                <h2
                  className="text-xl font-bold text-hebrew-heading mb-1 break-words"
                  style={{ color: primaryColor }}
                >
                  {data.introTitle ?? "מערכת לשחרור לחצים"}
                </h2>
                <p
                  className="text-sm text-hebrew-body break-words"
                  style={{ color: primaryColor, opacity: 0.75 }}
                >
                  {data.introSubtitle ?? "תני לזה כמה מכות טובות. הכל בסדר."}
                </p>
              </div>

              {/* Rope + Bag */}
              <div className="flex flex-col items-center relative">
                <div className="w-0.5 h-10 bg-gray-300" />
                <motion.div
                  animate={isTilting ? { rotate: [0, -18, 14, -8, 5, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="cursor-pointer select-none"
                  onClick={handleHit}
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

                {/* Boxing Glove */}
                <AnimatePresence>
                  {showPunch && (
                    <motion.div
                      initial={{ opacity: 0, x: 30, scale: 0.8 }}
                      animate={{ opacity: 1, x: -10, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="absolute top-1/2 -right-4 transform -translate-y-1/2 pointer-events-none z-20 drop-shadow-xl"
                    >
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 bg-red-500 rounded-[2rem] rounded-tl-md border-2 border-red-700 shadow-inner z-10" />
                        <div className="absolute top-1/2 -left-2 w-8 h-10 bg-red-500 rounded-full transform -translate-y-1/2 border-2 border-red-700 z-20" />
                        <div className="absolute -right-3 top-2 bottom-2 w-6 bg-gray-800 rounded-r-lg border-2 border-gray-900 z-0" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm font-medium text-hebrew-body break-words text-center max-w-[260px]"
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
                className="text-2xl font-bold text-hebrew-heading break-words"
                style={{ color: primaryColor }}
              >
                {data.resultTitle ?? "אאוץ׳... זה שחרר?"}
              </h2>

              <p className="text-lg text-[#415a77] max-w-xs text-hebrew-body leading-relaxed break-words">
                {data.resultMessage}
              </p>

              <TemplateResetButton onClick={onReset} label="אשמח לעוד סיבוב" className="mt-2" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterBranding className="mx-auto mt-4" />
    </div>
  );
}
