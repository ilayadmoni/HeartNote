"use client";

import { motion } from "framer-motion";

/** Small stamp-pressing loader, ticket-themed replacement for a generic spinner */
export function StampSpinner() {
  return (
    <motion.span
      className="inline-flex items-center justify-center w-4 h-4 rounded-sm border-2 border-white/80"
      animate={{ rotate: [-10, -18, -10], scale: [1, 0.85, 1] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    />
  );
}
