"use client";

import { motion } from "framer-motion";

export function DateInvitePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="bg-white dark:bg-gray-600 px-4 py-3 rounded-xl shadow-md text-center">
        <p className="text-[10px] font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
          ?תצא/י איתי
        </p>
        <div className="flex gap-2 justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-6 w-12 bg-[#d4826f] rounded-md flex items-center justify-center text-[9px] text-white font-bold"
          >
            כן!
          </motion.div>
          <motion.div
            animate={{ x: [0, 5, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-6 w-12 bg-gray-200 dark:bg-gray-500 rounded-md flex items-center justify-center text-[9px] text-gray-500 dark:text-gray-300"
          >
            לא
          </motion.div>
        </div>
      </div>
    </div>
  );
}
