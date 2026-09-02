"use client";

import { motion } from "framer-motion";

export function ScratchCardPreview(): JSX.Element {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="w-full max-w-[100px] aspect-[4/3] rounded-lg overflow-hidden relative border border-line">
        {/* Prize behind */}
        <div className="absolute inset-0 flex items-center justify-center bg-surface-raised">
          <span className="text-2xl">🎁</span>
        </div>
        {/* Scratch layer with hole */}
        <motion.div
          initial={{ clipPath: "inset(0 0 0 0)" }}
          animate={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 50% 100%, 65% 45%, 30% 35%, 0 60%)",
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-line-strong to-ink-subtle"
        />
      </div>
    </div>
  );
}
