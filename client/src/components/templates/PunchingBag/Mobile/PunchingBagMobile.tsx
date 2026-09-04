"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PunchingBagMobileProps } from "../types";
import { FooterBranding } from "@/components/templates/components";
import { PunchingBagResult, BoxingGlove, ImpactBurst, HitCounter } from "../components";
import { getTiltKeyframes } from "../punchingBag.utils";

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
  const t = useTranslations("templates");
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
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[100dvh]'
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
                  className="text-xl font-bold mb-1 break-words"
                  style={{ color: primaryColor }}
                  dir="auto"
                >
                  {data.introTitle ?? t("punchingBag.introTitle")}
                </h2>
                <p className="text-sm break-words" style={{ color: primaryColor, opacity: 0.75 }} dir="auto">
                  {data.introSubtitle ?? t("punchingBag.introSubtitle")}
                </p>
              </div>

              {/* Hit counter */}
              <HitCounter remaining={remaining} primaryColor={primaryColor} size="sm" />

              {/* Rope + Bag */}
              <div className="flex flex-col items-center relative">
                <div className="w-0.5 h-10 bg-line-strong" />
                <motion.div
                  animate={isTilting ? { rotate: getTiltKeyframes(hits, hitsRequired) } : { rotate: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="cursor-pointer select-none relative"
                  onClick={handleHit}
                  role="button"
                  aria-label={t("punchingBag.hitAria")}
                >
                  <div
                    className="w-24 h-36 rounded-[50px] shadow-xl active:scale-95 transition-transform"
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
                      <BoxingGlove size={56} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm font-medium break-words text-center max-w-[260px]"
                style={{ color: primaryColor, opacity: 0.7 }}
                dir="auto"
              >
                {data.hitInstructions ?? t("punchingBag.hitInstructions")}
              </motion.p>
            </motion.div>
          ) : (
            <PunchingBagResult data={data} primaryColor={primaryColor} onReset={onReset} size="sm" />
          )}
        </AnimatePresence>
      </div>

      <FooterBranding className="mx-auto mt-4" />
    </div>
  );
}
