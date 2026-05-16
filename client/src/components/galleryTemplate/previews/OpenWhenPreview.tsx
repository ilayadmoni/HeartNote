"use client";

import { motion } from "framer-motion";

export function OpenWhenPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { emoji: "😢", locked: false },
          { emoji: "💪", locked: false },
          { emoji: "🎁", locked: true },
          { emoji: "💕", locked: true },
        ].map((env, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`w-8 h-6 rounded flex items-center justify-center text-xs ${
              env.locked
                ? "bg-gray-200 dark:bg-gray-600"
                : "bg-[#f5e6d3] dark:bg-gray-500"
            }`}
          >
            {env.locked ? "🔒" : env.emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
