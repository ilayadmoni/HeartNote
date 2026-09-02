"use client";

import { motion } from "framer-motion";

interface SurpriseGiftRevealProps {
  greeting: string;
  primaryColor: string;
  size?: "sm" | "lg";
  scrollable?: boolean;
}

/** Revealed-greeting panel shown after the gift box is opened. */
export function SurpriseGiftReveal({
  greeting,
  primaryColor,
  size = "lg",
  scrollable = false,
}: SurpriseGiftRevealProps) {
  const text = (
    <p
      className={`text-center font-bold leading-relaxed whitespace-pre-wrap break-words w-full ${
        size === "lg" ? "text-title-lg 2xl:text-display-md" : "text-lg sm:text-xl"
      }`}
      style={{ color: primaryColor }}
      dir="auto"
    >
      {greeting}
    </p>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
      className={`w-full rounded-card shadow-lift bg-surface-raised ${size === "lg" ? "p-6 md:p-8 2xl:p-12" : "p-4 sm:p-6"}`}
    >
      {scrollable ? (
        <div className="max-h-[50vh] overflow-y-auto">{text}</div>
      ) : (
        <div className="w-full flex justify-center text-center">{text}</div>
      )}
    </motion.div>
  );
}
