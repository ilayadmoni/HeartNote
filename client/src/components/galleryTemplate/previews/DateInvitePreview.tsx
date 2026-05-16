"use client";

import { motion } from "framer-motion";

export function DateInvitePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative w-full max-w-[110px] rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="p-3 flex flex-col items-center gap-2">
          {/* Floating hearts */}
          <div className="flex gap-1 text-[10px]">
            {(["💕", "✨", "💕"] as const).map((e, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, delay: i * 0.3 }}
              >
                {e}
              </motion.span>
            ))}
          </div>

          <p className="text-[7px] font-bold text-primary-700 text-center">
            תצא/י איתי לדייט?
          </p>

          <div className="flex gap-1.5 w-full">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex-1 py-1 rounded-lg bg-primary-500 text-white text-[6px] font-bold text-center shadow"
            >
              כן! 💕
            </motion.div>
            <motion.div
              animate={{ x: [0, 6, -4, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex-1 py-1 rounded-lg bg-navy-100 text-navy-500 text-[6px] font-bold text-center"
            >
              לא
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
