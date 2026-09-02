"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function OpenWhenPreview(): JSX.Element {
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
              env.locked ? "bg-surface-sunken" : "bg-cream-300"
            }`}
          >
            {env.locked ? <Lock size={11} className="text-ink-subtle" aria-hidden="true" /> : env.emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
