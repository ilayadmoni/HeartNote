"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const SPARKLE_OFFSETS = ["-18px", "18px", "0px"];

export function SurpriseGiftPreview(): JSX.Element {
  const t = useTranslations("gallery");

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative flex flex-col items-center gap-1.5">
        {/* Floating sparkles */}
        <div className="absolute inset-x-0 top-0 h-0" aria-hidden="true">
          {SPARKLE_OFFSETS.map((x, i) => (
            <motion.span
              key={x}
              animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
              className="absolute left-1/2 text-[8px]"
              style={{ transform: `translateX(calc(-50% + ${x}))` }}
            >
              ✨
            </motion.span>
          ))}
        </div>

        {/* Gift box */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center pt-3"
          style={{ perspective: 200 }}
        >
          {/* Lid */}
          <motion.div
            animate={{ rotateX: [0, -30, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-14 h-4 rounded-t-sm bg-salmon-600"
            style={{ transformOrigin: "bottom center" }}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 bg-amber-300" />
          </motion.div>

          {/* Box body */}
          <div className="relative w-12 h-10 rounded-b-sm bg-salmon-500 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 bg-amber-300" />
            <div className="absolute inset-x-0 top-1/3 h-1.5 bg-amber-300" />
            <span className="relative z-10 text-[10px]">🎁</span>
          </div>
        </motion.div>

        <p className="text-[6px] font-bold text-salmon-600 text-center">
          {t("previews.surpriseGift.caption")}
        </p>
      </div>
    </div>
  );
}
