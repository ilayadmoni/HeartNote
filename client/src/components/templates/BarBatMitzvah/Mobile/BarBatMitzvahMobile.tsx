"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FooterBranding } from "@/components/templates/components";
import { BoyFigure } from "../components/BoyFigure";
import { GirlFigure } from "../components/GirlFigure";
import { CandyBurst } from "../components/CandyBurst";
import type { BarBatMitzvahData } from "../types";

interface BarBatMitzvahMobileProps {
  data: BarBatMitzvahData;
  primaryColor: string;
  isThrowing: boolean;
  showGreeting: boolean;
  burstKey: number;
  onReveal: () => void;
  onReset: () => void;
  onBurstComplete: () => void;
}

const CORAL = "#E28F79";

export function BarBatMitzvahMobile({
  data,
  primaryColor,
  isThrowing,
  showGreeting,
  burstKey,
  onReveal,
  onReset,
  onBurstComplete,
}: BarBatMitzvahMobileProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");
  const t = useTranslations("templates");

  const buttonLabel = showGreeting ? t("barBatMitzvah.tryAgain") : t("barBatMitzvah.throwCandy");

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-between p-5 ${
        isCreateRoute ? "min-h-[450px]" : "min-h-[100dvh]"
      }`}
    >
      {/* Hoisted outside motion wrappers so position:fixed is viewport-relative */}
      <CandyBurst key={burstKey} trigger={burstKey > 0} onComplete={onBurstComplete} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col items-center flex-1"
      >
        <h2
          className="text-title-lg font-black text-center mb-1 break-words w-full"
          style={{ color: primaryColor }}
          dir="auto"
        >
          {data.introTitle || t("barBatMitzvah.introTitle")}
        </h2>
        <p className="text-center text-sm text-ink-muted mb-6 break-words" dir="auto">
          {data.introSubtitle || t("barBatMitzvah.introSubtitleMobile")}
        </p>

        <div className="relative flex-1 w-full flex items-center justify-center">
          <motion.div
            animate={{
              filter: showGreeting ? "blur(6px)" : "blur(0px)",
              opacity: showGreeting ? 0.45 : 1,
              scale: isThrowing ? 1.03 : 1,
            }}
            transition={{ duration: 0.4 }}
            className="w-full flex items-end justify-center"
          >
            <div className="scale-90">
              {data.kind === "bat" ? (
                <GirlFigure onClick={!showGreeting ? onReveal : undefined} />
              ) : (
                <BoyFigure onClick={!showGreeting ? onReveal : undefined} />
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {showGreeting && (
              <motion.div
                key="mazal-overlay"
                initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
                transition={{ duration: 0.4 }}
                className="absolute top-1/2 left-1/2 z-40 w-[90%]"
                style={{ maxWidth: 380 }}
              >
                <div className="rounded-card bg-surface-raised border border-line shadow-2xl px-6 py-6 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken">
                    <span className="text-xl">✡︎</span>
                  </div>
                  <h3
                    className="text-title-lg font-black mb-3"
                    style={{ color: primaryColor }}
                    dir="auto"
                  >
                    {data.blessingTitle || t("barBatMitzvah.mazalTov")}
                  </h3>
                  <p className="text-base text-ink-muted leading-relaxed" dir="auto">
                    {data.blessingMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={showGreeting ? onReset : onReveal}
          disabled={isThrowing}
          whileHover={!isThrowing ? { scale: 1.04 } : {}}
          whileTap={!isThrowing ? { scale: 0.96 } : {}}
          className={`w-full mt-6 px-6 py-3.5 text-base font-extrabold rounded-pill text-accent-ink shadow-xl uppercase tracking-wide ${
            showGreeting ? "bg-accent hover:bg-accent-hover" : ""
          }`}
          style={{
            background: showGreeting
              ? undefined
              : `linear-gradient(135deg, ${CORAL} 0%, #D17560 100%)`,
            cursor: isThrowing ? "not-allowed" : "pointer",
          }}
        >
          {buttonLabel}
        </motion.button>
      </motion.div>

      <div className="mt-8 opacity-80">
        <FooterBranding />
      </div>
    </div>
  );
}
