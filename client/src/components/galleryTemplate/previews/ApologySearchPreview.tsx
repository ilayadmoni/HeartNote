"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SEARCH_TEXT = "סליחה שאני...";

const RESULTS = ["💌 מכתב התנצלות", "🌹 עם פרחים", "🍫 + שוקולד"];

export function ApologySearchPreview() {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setChars((p) => (p >= SEARCH_TEXT.length ? 0 : p + 1)),
      150,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[110px] flex flex-col gap-1.5">
        {/* Search bar */}
        <div className="flex items-center gap-1 bg-white dark:bg-stone-700 rounded-full border border-stone-200 dark:border-stone-600 px-2 py-1 shadow-sm">
          <span className="text-[8px] text-stone-400">🔍</span>
          <span className="text-[6px] text-stone-700 dark:text-stone-200 font-medium flex-1 truncate">
            {SEARCH_TEXT.slice(0, chars)}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-px h-2 bg-coral-500 ml-0.5 align-middle"
            />
          </span>
        </div>

        {/* Results */}
        {RESULTS.map((result, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.2 }}
            className="text-[5px] text-stone-600 dark:text-stone-300 px-1 py-0.5 rounded bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700"
          >
            {result}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
