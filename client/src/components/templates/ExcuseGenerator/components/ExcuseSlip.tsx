"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ExcuseSlipProps {
  text: string;
  accent: string;
  generating: boolean;
  size?: "sm" | "lg";
}

export function ExcuseSlip({ text, accent, generating, size = "lg" }: ExcuseSlipProps) {
  const padding = size === "lg" ? "p-8 min-h-[120px]" : "p-6 min-h-[100px]";
  const textSize = size === "lg" ? "text-xl" : "text-base";

  return (
    <div
      className={`w-full -rotate-1 bg-surface-raised border-2 border-dashed border-line rounded-card ${padding} shadow-inner relative overflow-hidden`}
    >
      {generating && (
        <motion.div
          className="absolute inset-0 rounded-card"
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 0.16, repeat: Infinity }}
          style={{ backgroundColor: `${accent}22` }}
        />
      )}
      <div className="flex items-center justify-center h-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={text}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`${textSize} font-black text-center relative z-10 break-words`}
            style={{ color: accent }}
            dir="auto"
          >
            {text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
