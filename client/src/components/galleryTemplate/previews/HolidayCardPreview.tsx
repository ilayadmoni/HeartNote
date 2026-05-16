"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const HOLIDAYS = [
  { emoji: "🍎🍯", label: "ראש השנה", bgClass: "bg-coral-50" },
  { emoji: "🕎", label: "חנוכה", bgClass: "bg-navy-50" },
  { emoji: "🎭", label: "פורים", bgClass: "bg-secondary-50" },
  { emoji: "🍷", label: "פסח", bgClass: "bg-primary-50" },
] as const;

export function HolidayCardPreview() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % HOLIDAYS.length), 2000);
    return () => clearInterval(timer);
  }, []);

  const holiday = HOLIDAYS[idx];

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] rounded-xl overflow-hidden shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className={`flex flex-col items-center gap-1.5 p-3 ${holiday.bgClass}`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl leading-none"
            >
              {holiday.emoji}
            </motion.div>
            <p className="text-[8px] font-bold text-navy-700 text-center">
              {holiday.label} שמח!
            </p>
            <div className="w-8 h-px bg-navy-300" />
            <p className="text-[5px] text-navy-400 text-center">חג בשמחה ובאהבה</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
