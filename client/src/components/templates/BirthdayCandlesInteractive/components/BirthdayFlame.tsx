"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface BirthdayFlameProps {
  index: number;
  isLit: boolean;
  reduceMotion: boolean;
  onClick: () => void;
}

export function BirthdayFlame({
  index,
  isLit,
  reduceMotion,
  onClick,
}: BirthdayFlameProps) {
  const t = useTranslations("templates");
  const flameSize = 24;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isLit}
      aria-label={t("birthdayCandles.blowCandle", { number: index + 1 })}
      className="group flex h-20 w-7 flex-col items-center justify-end rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <AnimatePresence>
        {isLit ? (
          <motion.div
            className="text-[#ffde59] drop-shadow-[0_0_10px_rgba(255,222,89,0.75)]"
            animate={
              reduceMotion
                ? {}
                : { scale: [1, 1.16, 0.94, 1.08, 1], opacity: [0.9, 1, 0.86, 1] }
            }
            exit={{ opacity: 0, scale: 0.2, y: -8 }}
            transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.12 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={flameSize}
              height={flameSize}
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              aria-hidden="true"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </motion.div>
        ) : (
          <motion.span
            className="mb-1 h-6 text-xs text-slate-400"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: -14 }}
            exit={{ opacity: 0 }}
          >
            ~
          </motion.span>
        )}
      </AnimatePresence>
      <span className="relative h-11 w-3 overflow-hidden rounded-t-sm border border-line bg-surface-sunken shadow-sm">
        <span
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 4px, #1b263b 4px, #1b263b 8px)",
          }}
        />
      </span>
    </button>
  );
}
