"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const EXCUSES = [
  "הכלב אכל את שיעורי הבית",
  "הייתי תקוע בפקק",
  "הטלפון מת לי",
  "שכחתי לגמרי",
  "היה לי כאב ראש",
];

export function ExcuseGeneratorPreview() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIdx((p) => (p + 1) % EXCUSES.length), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] flex flex-col items-center gap-2">
        <p className="text-[6px] font-bold text-secondary-600 dark:text-secondary-300">
          גנרטור תירוצים
        </p>

        {/* Output card */}
        <div className="w-full bg-secondary-50 dark:bg-secondary-900/30 rounded-lg p-2 border border-secondary-200 dark:border-secondary-700 min-h-[32px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[5px] text-secondary-700 dark:text-secondary-200 text-center leading-tight"
            >
              {EXCUSES[idx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Generate button */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-3 py-0.5 rounded-full bg-secondary-500 text-white text-[5px] font-bold shadow"
        >
          🎲 הפק תירוץ
        </motion.div>
      </div>
    </div>
  );
}
