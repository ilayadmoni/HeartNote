"use client";

import { motion } from "framer-motion";

interface MazalTovOverlayProps {
  title: string;
  message: string;
  primaryColor: string;
  isMobile?: boolean;
}

export function MazalTovOverlay({
  title,
  message,
  primaryColor,
  isMobile = false,
}: MazalTovOverlayProps) {
  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 ${
        isMobile ? "w-[min(280px,90%)]" : "w-[min(420px,92%)]"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: isMobile ? 8 : 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: isMobile ? 0.6 : 0.7, ease: [0.2, 0.9, 0.3, 1.2] }}
        className={`border border-white/90 shadow-2xl text-center ${
          isMobile ? "rounded-2xl px-5 py-4" : "rounded-3xl px-8 py-6"
        }`}
        style={{ background: "rgba(255,255,255,0.96)" }}
      >
        <h3
          className={`font-black text-hebrew-heading mb-2 break-words ${
            isMobile ? "text-2xl" : "text-4xl"
          }`}
          style={{ color: primaryColor }}
        >
          {title}
        </h3>
        <p
          className={`font-semibold text-hebrew-body text-stone-700 break-words ${
            isMobile ? "text-sm" : "text-base"
          }`}
        >
          {message}
        </p>
      </motion.div>
    </div>
  );
}
