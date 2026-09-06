"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const SEGMENT_COLORS = [
  "#FECDD3",
  "#C7CEEA",
  "#B5EAD7",
  "#FFDAC1",
  "#E2F0CB",
  "#FBD5E0",
] as const;

const SEGMENT_KEYS = [1, 2, 3, 4, 5, 6] as const;
const SLICE = 360 / SEGMENT_KEYS.length;

export function DecisionWheelPreview(): JSX.Element {
  const t = useTranslations("gallery");

  const wheelGradient = `conic-gradient(${SEGMENT_COLORS.map(
    (color, i) => `${color} ${i * SLICE}deg ${(i + 1) * SLICE}deg`,
  ).join(", ")})`;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-1.5 p-2">
      {/* Pointer */}
      <div
        className="w-0 h-0 border-l-4 border-r-4 border-l-transparent border-r-transparent border-t-[8px] border-t-accent z-10 -mb-1"
        aria-hidden="true"
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="relative w-[68px] h-[68px] rounded-full border-2 border-line shadow-soft"
        style={{ background: wheelGradient }}
      >
        {SEGMENT_KEYS.map((n, i) => (
          <span
            key={n}
            className="absolute left-1/2 top-1/2 text-[4.5px] font-bold text-navy-800 whitespace-nowrap"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * SLICE + SLICE / 2}deg) translateY(-22px)`,
            }}
          >
            {t(`previews.decisionWheel.segment${n}`)}
          </span>
        ))}

        {/* Hub */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-surface-raised border border-line shadow-soft" />
      </motion.div>

      <motion.p
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="px-2 py-0.5 rounded-pill bg-accent text-accent-ink text-[6px] font-bold shadow-soft"
      >
        {t("previews.decisionWheel.cta")}
      </motion.p>
    </div>
  );
}
