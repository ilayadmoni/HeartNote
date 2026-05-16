"use client";

import { motion } from "framer-motion";

export function ScratchCardPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-16 rounded-xl overflow-hidden shadow-md border border-navy-200 dark:border-navy-600">
          {/* Prize layer */}
          <div className="absolute inset-0 bg-coral-50 dark:bg-navy-700 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">🎁</p>
              <p className="text-[5px] font-bold text-coral-600 dark:text-coral-400 mt-0.5">פרס!</p>
            </div>
          </div>

          {/* Scratch overlay — partially revealed */}
          <motion.div
            initial={{ clipPath: "inset(0 0 0 0)" }}
            animate={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 100%, 55% 100%, 70% 40%, 25% 30%, 0 65%)",
            }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-navy-200 to-navy-300 flex items-center justify-center"
          >
            <p className="text-[6px] text-navy-600 font-bold">גרדו!</p>
          </motion.div>
        </div>

        <p className="text-[6px] text-navy-400 font-medium">גרדו לגלות</p>
      </div>
    </div>
  );
}
