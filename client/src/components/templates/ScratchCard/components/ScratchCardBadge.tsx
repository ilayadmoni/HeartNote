"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ScratchCardBadgeProps {
  badgeBackgroundColor: string;
  badgeTextColor: string;
  colorLight: string;
  size?: "sm" | "lg";
}

/** Top ticket badge — sparkle icons, "scratch here" label, perforation notches. */
export function ScratchCardBadge({
  badgeBackgroundColor,
  badgeTextColor,
  colorLight,
  size = "lg",
}: ScratchCardBadgeProps) {
  const t = useTranslations("templates");
  const sparkleSize = size === "lg" ? "text-xl 2xl:text-3xl" : "text-lg";
  const labelSize = size === "lg" ? "text-lg 2xl:text-display-md" : "text-base";

  return (
    <div
      className="relative py-4 px-6 2xl:py-6 2xl:px-10 flex items-center justify-center border-b-2 border-dashed border-white/40"
      style={{
        backgroundColor: badgeBackgroundColor,
        boxShadow: "inset 0px 4px 6px rgba(255, 255, 255, 0.25)",
      }}
    >
      <div className="relative z-10 flex items-center gap-3">
        <motion.span
          animate={{ rotate: [-10, 10, -10], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={`${sparkleSize} drop-shadow-md`}
        >
          ✨
        </motion.span>
        <h2
          className={`${labelSize} font-bold tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]`}
          style={{ color: badgeTextColor }}
        >
          {t("scratchCard.scratchHere")}
        </h2>
        <motion.span
          animate={{ rotate: [10, -10, 10], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
          className={`${sparkleSize} drop-shadow-md`}
        >
          ✨
        </motion.span>
      </div>

      <div
        className="absolute -bottom-[10px] -start-2 w-5 h-5 rounded-full border-t border-e border-white/20 z-10"
        style={{ backgroundColor: colorLight }}
      />
      <div
        className="absolute -bottom-[10px] -end-2 w-5 h-5 rounded-full border-t border-s border-white/20 z-10"
        style={{ backgroundColor: colorLight }}
      />
    </div>
  );
}
