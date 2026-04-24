"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ShatteringGlassProps {
  isShattered: boolean;
  onShatterComplete?: () => void;
}

export function ShatteringGlass({ isShattered, onShatterComplete }: ShatteringGlassProps) {
  return (
    <div className="relative w-full h-full pointer-events-none select-none">
      <AnimatePresence mode="wait">
        {!isShattered ? (
          <motion.img
            key="full"
            src="/assets/images/weddingtemplate/glass_full.svg"
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain object-bottom drop-shadow-lg"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.08 } }}
          />
        ) : (
          <motion.img
            key="shards"
            src="/assets/images/weddingtemplate/glass_shards.svg"
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain object-bottom"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: [0.6, 1.25, 1.05] }}
            transition={{ duration: 0.7, ease: "easeOut", times: [0, 0.45, 1] }}
            onAnimationComplete={onShatterComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
