"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PunchingBagDesktopProps } from "../types";
import { FooterBranding, BackToGallery } from "@/components/templates/components";
import { PunchingBagResult } from "../components/PunchingBagResult";

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
  const t = useTranslations("templates");
  const remaining = hitsRequired - hits;
  const [showPunch, setShowPunch] = useState(false);

  function handleHit() {
    setShowPunch(true);
    onHit();
    setTimeout(() => setShowPunch(false), 150);
  }

  return (
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate overflow-hidden">
      <BackToGallery className="absolute top-4 end-4" />

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
                  className="text-title-lg font-bold mb-2 break-words"
                  style={{ color: primaryColor }}
                  dir="auto"
                >
                  {data.introTitle ?? t("punchingBag.introTitle")}
                </h2>
                <p className="break-words" style={{ color: primaryColor, opacity: 0.75 }} dir="auto">
                  {data.introSubtitle ?? t("punchingBag.introSubtitle")}
                </p>
              </motion.div>

              {/* Rope + Bag */}
              <div className="flex flex-col items-center mb-10 relative">
                {/* Rope */}
                <div className="w-0.5 h-14 bg-line-strong" />

                {/* Bag */}
                <motion.div
                  animate={isTilting ? { rotate: [0, -18, 14, -8, 5, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="cursor-pointer select-none"
                  onClick={handleHit}
                  role="button"
                  aria-label={t("punchingBag.hitAria")}
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

                {/* Boxing Glove */}
                <AnimatePresence>
                  {showPunch && (
                    <motion.div
                      initial={{ opacity: 0, x: 30, scale: 0.8 }}
                      animate={{ opacity: 1, x: -10, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="absolute top-1/2 -end-4 transform -translate-y-1/2 pointer-events-none z-20 drop-shadow-xl"
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

              {/* Hit instructions */}
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-medium break-words text-center max-w-xs"
                style={{ color: primaryColor, opacity: 0.7 }}
                dir="auto"
              >
                {data.hitInstructions ?? t("punchingBag.hitInstructions")}
              </motion.p>
            </motion.div>
          ) : (
            <PunchingBagResult data={data} primaryColor={primaryColor} onReset={onReset} />
          )}
        </AnimatePresence>
      </div>

      <FooterBranding className="shrink-0 pb-4 relative z-10" />
    </div>
  );
}
