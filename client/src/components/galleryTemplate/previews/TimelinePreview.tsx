"use client";

import { motion } from "framer-motion";

export function TimelinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="flex items-center gap-1 relative h-12">
        {/* Horizontal line */}
        <div className="absolute left-2 right-2 h-0.5 bg-[#d4826f]/50" />
        {/* Dots */}
        {["❤️", "✨", "💒"].map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2, duration: 0.3 }}
            className="z-10 w-7 h-7 bg-white dark:bg-gray-600 rounded-full border-2 border-[#d4826f] flex items-center justify-center text-xs shadow-sm"
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
