"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BirthdayCandlesDesktopProps } from "../types";
import { Candle } from "../components/Candle";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";

export function BirthdayCandlesDesktop({
  data,
  litCandles,
  isDone,
  candleCount,
  cakeColor,
  flameColor,
  primaryColor,
  onBlow,
  onRelight,
}: BirthdayCandlesDesktopProps) {
  return (
    <div className="flex flex-col min-h-[420px] bg-transparent relative isolate overflow-hidden">
      <BackToGallery className="absolute top-4 right-4" />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto px-6 py-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h2
            className="text-2xl font-bold text-hebrew-heading mb-2 break-words"
            style={{ color: primaryColor }}
          >
            {data.title ?? "מערכת כיבוי נרות דיגיטלית"}
          </h2>
          <p className="text-[#415a77] text-hebrew-body break-words">
            {data.subtitle ?? "הקישי על הלהבות כדי לכבות את הנרות ולבקש משאלה."}
          </p>
        </motion.div>

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
              {/* Candles row sitting on top of the cake */}
              <div className="relative pt-1 w-72">
                <div
                  className="flex justify-center relative z-10 overflow-hidden"
                  style={{
                    marginBottom: "-2px",
                    gap: `${
                      candleCount > 1
                        ? Math.max(
                            2,
                            (288 - candleCount * (candleCount > 6 ? 24 : 32)) /
                              (candleCount - 1)
                          )
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
                      size={candleCount > 6 ? "sm" : "md"}
                    />
                  ))}
                </div>

                {/* Cake base */}
                <div
                  className="w-72 h-24 rounded-t-[40px] rounded-b-xl shadow-2xl flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: cakeColor }}
                >
                  <div className="absolute top-0 w-full h-4 bg-white opacity-25" />
                  <div className="absolute top-4 w-full h-1.5 bg-white opacity-10" />
                </div>
              </div>

              {/* Blow hint */}
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-6 text-sm text-[#415a77] font-medium text-hebrew-body"
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
              className="flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl mb-4"
                aria-hidden="true"
              >
                🎂
              </motion.div>

              <h2
                className="text-3xl font-black text-hebrew-heading mb-3 break-words w-full"
                style={{ color: primaryColor }}
              >
                {data.celebrationTitle}
              </h2>

              <p className="text-lg text-[#415a77] max-w-md mb-8 text-hebrew-body leading-relaxed break-words">
                {data.celebrationMessage}
              </p>

              <button
                onClick={onRelight}
                className="text-sm text-[#415a77] hover:text-[#1b263b] underline transition-colors text-hebrew-body"
              >
                הדלק מחדש
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterBranding className="shrink-0 pb-4 relative z-10" />
    </div>
  );
}
