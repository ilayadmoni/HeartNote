"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PunchingBagMobileProps } from "../types";
import { FooterBranding } from "@/components/templates/components";
import { PunchingBagResult } from "../components/PunchingBagResult";

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

              {/* Rope + Bag */}
              <div className="flex flex-col items-center relative">
                <div className="w-0.5 h-10 bg-line-strong" />
                <motion.div
                  animate={isTilting ? { rotate: [0, -18, 14, -8, 5, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="cursor-pointer select-none"
                  onClick={handleHit}
                  role="button"
                  aria-label={t("punchingBag.hitAria")}
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
