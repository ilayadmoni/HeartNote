"use client";

import { motion } from "framer-motion";

const EVENTS = [
  { emoji: "👀", label: "פגישה ראשונה" },
  { emoji: "💑", label: "הדייט הראשון" },
  { emoji: "❤️", label: "הצהרת אהבה" },
];

export function TimelinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative flex flex-col gap-2 w-full max-w-[100px]">
        {/* Vertical line */}
        <div className="absolute right-3 top-3 bottom-3 w-0.5 bg-coral-200 dark:bg-coral-800" />

        {EVENTS.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.25 }}
            className="flex items-center gap-2 relative"
          >
            <p className="text-[5px] text-stone-600 dark:text-stone-300 flex-1 leading-tight text-right">
              {event.label}
            </p>
            <div className="w-6 h-6 rounded-full bg-coral-100 dark:bg-coral-900 border-2 border-coral-400 flex items-center justify-center text-[9px] z-10 flex-shrink-0">
              {event.emoji}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
