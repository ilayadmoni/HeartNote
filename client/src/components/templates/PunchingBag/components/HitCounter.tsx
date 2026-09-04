"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface HitCounterProps {
  remaining: number;
  primaryColor: string;
  size?: "sm" | "lg";
}

export function HitCounter({ remaining, primaryColor, size = "lg" }: HitCounterProps) {
  const t = useTranslations("templates");
  const dims = size === "lg" ? "w-16 h-16 text-2xl" : "w-12 h-12 text-xl";

  return (
    <motion.div
      key={remaining}
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`${dims} rounded-full flex flex-col items-center justify-center bg-surface shadow-lg border-2 font-bold tabular-nums`}
      style={{ borderColor: primaryColor, color: primaryColor }}
      aria-label={t("punchingBag.remainingHits", { count: remaining })}
    >
      {remaining}
    </motion.div>
  );
}
