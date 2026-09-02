"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { BackToGallery, FooterBranding } from "@/components/templates/components";
import { BoyFigure } from "../components/BoyFigure";
import { GirlFigure } from "../components/GirlFigure";
import { CandyBurst } from "../components/CandyBurst";
import type { BarBatMitzvahData } from "../types";

interface BarBatMitzvahDesktopProps {
  data: BarBatMitzvahData;
  primaryColor: string;
  isThrowing: boolean;
  showGreeting: boolean;
  burstKey: number;
  onReveal: () => void;
  onReset: () => void;
  onBurstComplete: () => void;
}

export function BarBatMitzvahDesktop({
  data,
  primaryColor,
  isThrowing,
  showGreeting,
  burstKey,
  onReveal,
  onReset,
  onBurstComplete,
}: BarBatMitzvahDesktopProps) {
  const t = useTranslations("templates");
  const introTitle = data.introTitle || t("barBatMitzvah.introTitle");
  const introSubtitle = data.introSubtitle || t("barBatMitzvah.introSubtitle");

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      <BackToGallery />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <h1
          className="text-display-lg font-black text-center mb-4 break-words w-full" dir="auto"
          style={{ color: primaryColor }}
        >
          {introTitle}
        </h1>
        <p className="text-center text-ink-muted mb-8 break-words" dir="auto">
          {introSubtitle}
        </p>

        <div className="relative w-full max-w-lg mx-auto h-80 mb-8 border-b-4 border-line pb-2 overflow-visible">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <CandyBurst key={burstKey} trigger={burstKey > 0} onComplete={onBurstComplete} />

            <motion.div
              animate={{
                filter: showGreeting ? "blur(6px)" : "blur(0px)",
                opacity: showGreeting ? 0.5 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {data.kind === "bat" ? (
                <GirlFigure onClick={!showGreeting ? onReveal : undefined} />
              ) : (
                <BoyFigure onClick={!showGreeting ? onReveal : undefined} />
              )}
            </motion.div>

<AnimatePresence>
              {showGreeting && (
                <motion.div
                  key="greeting"
                  initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
                  animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                  exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-1/2 left-1/2 z-50 w-[85%]"
                  style={{ maxWidth: 420 }}
                >
                  <div className="rounded-card bg-surface-raised/70 backdrop-blur-md border border-line shadow-2xl px-8 py-6 text-center overflow-hidden">
                    <div
                      className="absolute top-0 start-0 end-0 h-1.5 rounded-t-card"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <button
                      onClick={onReset}
                      className="absolute top-3 end-3 p-1.5 hover:bg-surface-sunken rounded-full transition-colors"
                    >
                      <X size={20} className="text-slate-600" />
                    </button>
                    <h3
                      className="text-display-lg font-black mb-3 break-words"
                      style={{ color: primaryColor }}
                      dir="auto"
                    >
                      {data.blessingTitle || t("barBatMitzvah.blessingTitleDefault")}
                    </h3>
                    <div className="w-12 h-0.5 mb-4 rounded-full mx-auto" style={{ backgroundColor: primaryColor }} />
                    <p className="text-lg text-ink-muted leading-relaxed break-words" dir="auto">
                      {data.blessingMessage}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-center">
          <motion.button
            onClick={showGreeting ? onReset : onReveal}
            disabled={isThrowing}
            whileHover={!isThrowing ? { scale: 1.05 } : {}}
            whileTap={!isThrowing ? { scale: 0.95 } : {}}
            className="px-8 py-4 text-lg font-bold rounded-pill text-accent-ink shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}BF 100%)`,
              cursor: isThrowing ? "not-allowed" : "pointer",
            }}
          >
            {showGreeting ? t("barBatMitzvah.startOver") : t("barBatMitzvah.throwCandy")}
          </motion.button>
        </div>
      </motion.div>

      <div className="mt-8">
        <FooterBranding />
      </div>
    </div>
  );
}
