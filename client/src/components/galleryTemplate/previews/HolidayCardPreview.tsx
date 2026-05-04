"use client";

import { motion } from "framer-motion";

const HOLIDAY_ICONS = {
  rosh: { emoji: "🍎", bgColor: "#fff5f2", label: "ראש השנה" },
  hanukkah: { emoji: "🕎", bgColor: "#f0f4f8", label: "חנוכה" },
  purim: { emoji: "🎭", bgColor: "#f8f0f8", label: "פורים" },
  pesach: { emoji: "🍷", bgColor: "#fffaeb", label: "פסח" },
};

export function HolidayCardPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex flex-col gap-2 w-full">
        <div className="text-[9px] font-bold text-stone-600 dark:text-stone-300 text-center mb-1">
          בחר חג
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[110px] mx-auto p-2 rounded-xl flex flex-col items-center text-center"
          style={{ backgroundColor: HOLIDAY_ICONS.rosh.bgColor }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl mb-1"
          >
            {HOLIDAY_ICONS.rosh.emoji}
          </motion.div>
          <p className="text-[7px] font-bold text-stone-700 dark:text-stone-800">
            {HOLIDAY_ICONS.rosh.label}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
