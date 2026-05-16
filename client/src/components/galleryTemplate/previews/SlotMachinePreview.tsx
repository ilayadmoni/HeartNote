"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const SYMBOLS = ["🍒", "⭐", "🎰", "7️⃣", "💎", "🍋"];

function Reel({ delay }: { delay: number }) {
  const [symbolIdx, setSymbolIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setSymbolIdx((p) => (p + 1) % SYMBOLS.length),
      300 + delay * 100,
    );
    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div className="w-7 h-8 bg-stone-800 rounded border border-amber-400/50 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={symbolIdx}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-[14px] leading-none"
        >
          {SYMBOLS[symbolIdx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function SlotMachinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-stone-700 rounded-lg p-2 shadow-lg border border-stone-600">
          {/* Screen with reels */}
          <div className="bg-stone-900 rounded p-1.5 mb-1.5 flex gap-1 justify-center border border-amber-400/30">
            {[0, 1, 2].map((i) => (
              <Reel key={i} delay={i} />
            ))}
          </div>
          {/* Spin button */}
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 0.95, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="px-3 py-0.5 bg-amber-400 rounded text-[6px] font-bold text-stone-900 shadow"
            >
              🎰 סובבי!
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
