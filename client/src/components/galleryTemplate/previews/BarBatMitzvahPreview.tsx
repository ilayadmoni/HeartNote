"use client";

import { motion } from "framer-motion";

export function BarBatMitzvahPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative w-full max-w-[110px] rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-navy-900 to-navy-700">
        {/* Gold border frame */}
        <div className="absolute inset-[3px] rounded-md border border-coral-400/60 pointer-events-none z-10" />

        <div className="relative z-0 p-3 flex flex-col items-center gap-1.5">
          {/* Star of David */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-coral-400 text-[14px] leading-none"
          >
            ✡
          </motion.div>

          {/* Hebrew title */}
          <p className="text-[7px] font-bold text-coral-300 tracking-widest uppercase">
            בר מצווה
          </p>

          {/* Divider ornament */}
          <div className="flex items-center gap-1 w-full">
            <div className="flex-1 h-px bg-coral-400/40" />
            <span className="text-coral-400/60 text-[6px]">✦</span>
            <div className="flex-1 h-px bg-coral-400/40" />
          </div>

          {/* Name placeholder */}
          <p className="text-[8px] text-coral-100 font-semibold text-center leading-tight">
            נועם כהן
          </p>

          {/* Date & venue */}
          <p className="text-[5px] text-coral-300/70 text-center leading-relaxed">
            כ״ה אייר תשפ״ה
            <br />
            בית הכנסת המרכזי
          </p>

          {/* CTA pill */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-0.5 px-2 py-0.5 rounded-full bg-coral-400 text-navy-900 text-[5px] font-bold shadow-sm"
          >
            לברכה המיוחדת
          </motion.div>
        </div>
      </div>
    </div>
  );
}
