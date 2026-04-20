"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BirthdayCandlesMobileProps } from "../types";
import { Candle } from "../components/Candle";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";

export function BirthdayCandlesMobile({
  data,
  litCandles,
  isDone,
  candleCount,
  cakeColor,
  flameColor,
  primaryColor,
  onBlow,
  onRelight,
}: BirthdayCandlesMobileProps) {
  return (
    <div className="w-full flex flex-col min-h-[500px] bg-transparent relative isolate overflow-hidden px-4 py-6">
      <BackToGallery className="mb-4" />

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Header */}
        <div className="text-center">
          <h2
            className="text-xl font-bold text-hebrew-heading mb-1 break-words"
            style={{ color: primaryColor }}
          >
            {data.title ?? "מערכת כיבוי נרות דיגיטלית"}
          </h2>
          <p className="text-sm text-[#415a77] text-hebrew-body break-words">
            {data.subtitle ?? "הקישי על הלהבות כדי לכבות את הנרות."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isDone ? (
            <motion.div
              key="cake-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center"
            >
              <div className="relative pt-1 w-56">
                {/* Candles — gap computed to always fit within w-56 (224px) cake */}
                <div
                  className="flex justify-center relative z-10 overflow-hidden"
                  style={{
                    marginBottom: "-2px",
                    gap: `${
                      candleCount > 1
                        ? Math.max(0, (224 - candleCount * 24) / (candleCount - 1))
                        : 0
                    }px`,
                  }}
                >
                  {litCandles.map((isLit, i) => (
                    <Candle
                      key={i}
                      isLit={isLit}
                      flameColor={flameColor}
                      onBlow={() => onBlow(i)}
                      size="sm"
                    />
                  ))}
                </div>

                {/* Cake base */}
                <div
                  className="w-56 h-20 rounded-t-[32px] rounded-b-xl shadow-xl flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: cakeColor }}
                >
                  <div className="absolute top-0 w-full h-3 bg-white opacity-25" />
                  <div className="absolute top-3 w-full h-1 bg-white opacity-10" />
                </div>
              </div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-4 text-xs text-[#415a77] font-medium text-hebrew-body"
              >
                🎂 לחצו על הלהבות לכיבוי
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="celebration-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl"
                aria-hidden="true"
              >
                🎂
              </motion.div>

              <h2
                className="text-2xl font-black text-hebrew-heading break-words w-full"
                style={{ color: primaryColor }}
              >
                {data.celebrationTitle}
              </h2>

              <p className="text-base text-[#415a77] max-w-xs text-hebrew-body leading-relaxed break-words">
                {data.celebrationMessage}
              </p>

              <button
                onClick={onRelight}
                className="text-sm text-[#415a77] hover:text-[#1b263b] underline transition-colors text-hebrew-body mt-2"
              >
                הדלק מחדש
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterBranding className="mx-auto mt-4" />
    </div>
  );
}
