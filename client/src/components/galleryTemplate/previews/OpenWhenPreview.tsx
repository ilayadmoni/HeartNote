"use client";

import { motion } from "framer-motion";

const ENVELOPES = [
  { emoji: "😢", label: "כשעצוב לך", locked: false },
  { emoji: "💪", label: "כשצריך עידוד", locked: false },
  { emoji: "🎉", label: "ליום הולדת", locked: true },
  { emoji: "💕", label: "כשמתגעגע", locked: true },
];

export function OpenWhenPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="grid grid-cols-2 gap-1.5">
        {ENVELOPES.map((env, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border ${
              env.locked
                ? "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                : "bg-coral-50 dark:bg-coral-900/20 border-coral-200 dark:border-coral-800"
            }`}
          >
            <span className="text-[12px]">{env.locked ? "🔒" : env.emoji}</span>
            <span className="text-[4px] text-stone-500 dark:text-stone-400 text-center leading-tight">
              {env.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
