"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PunchingBagDesktopProps } from "../types";
import { FooterBranding, BackToGallery } from "@/components/templates/components";
import { PunchingBagResult, BoxingGlove, ImpactBurst, HitCounter } from "../components";
import { getTiltKeyframes } from "../punchingBag.utils";

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

              {/* Hit counter */}
              <div className="mb-4">
                <HitCounter remaining={remaining} primaryColor={primaryColor} />
              </div>

              {/* Rope + Bag */}
              <div className="flex flex-col items-center mb-10 relative">
                {/* Rope */}
                <div className="w-0.5 h-14 bg-line-strong" />

                {/* Bag */}
                <motion.div
                  animate={isTilting ? { rotate: getTiltKeyframes(hits, hitsRequired) } : { rotate: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="cursor-pointer select-none relative"
                  onClick={handleHit}
                  role="button"
                  aria-label={t("punchingBag.hitAria")}
                >
                  <div
                    className="w-32 h-48 rounded-[60px] shadow-2xl transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: bagColor }}
                  />
                  <AnimatePresence>{showPunch && <ImpactBurst />}</AnimatePresence>
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
                      <BoxingGlove size={64} />
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
