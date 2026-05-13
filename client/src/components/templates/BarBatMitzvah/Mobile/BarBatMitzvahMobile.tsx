"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
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

  const buttonLabel = showGreeting ? "נסה שוב!" : "זרקו סוכריות!";

  return (
    <div
      dir="rtl"
      className={`relative w-full flex flex-col items-center justify-between p-5 text-right ${
        isCreateRoute ? "min-h-[450px]" : "min-h-screen"
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
          className="text-2xl font-black text-center text-hebrew-heading mb-1 break-words w-full"
          style={{ color: primaryColor }}
        >
          {data.introTitle || "מכונת ההתבגרות"}
        </h2>
        <p className="text-center text-hebrew-body text-sm text-stone-500 dark:text-stone-400 mb-6 break-words">
          {data.introSubtitle || "לחצו על הכפתור כדי לזרוק סוכריות!"}
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
                <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl px-6 py-6 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <span className="text-xl">✡︎</span>
                  </div>
                  <h3
                    className="text-3xl font-black text-hebrew-heading mb-3"
                    style={{ color: primaryColor }}
                  >
                    {data.blessingTitle || "מזל טוב!"}
                  </h3>
                  <p className="text-base text-hebrew-body text-zinc-700 dark:text-zinc-200 leading-relaxed">
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
          className={`w-full mt-6 px-6 py-3.5 text-base font-extrabold rounded-full text-white shadow-xl uppercase tracking-wide ${
            showGreeting ? "bg-orange-500 hover:bg-orange-600 active:bg-orange-700" : ""
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
