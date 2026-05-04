"use client";

import { motion } from "framer-motion";

export function SteamyWindowPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="relative w-full max-w-[110px] aspect-[4/3] rounded-lg bg-gray-300/80 dark:bg-gray-600/80 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/50"
            style={{ left: `${20 + i * 13}%`, top: `${30 + (i % 3) * 15}%` }}
            animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent"
          animate={{
            clipPath: [
              "circle(0% at 50% 50%)",
              "circle(25% at 50% 50%)",
              "circle(0% at 50% 50%)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
        >
          <div className="h-full w-full bg-white/30 dark:bg-gray-500/30 flex items-center justify-center">
            <span className="text-lg">💖</span>
          </div>
        </motion.div>
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className="text-[7px] text-gray-600 dark:text-gray-300 font-bold">🫧 העבירו אצבע</span>
        </div>
      </div>
    </div>
  );
}
