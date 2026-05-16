"use client";

import { motion } from "framer-motion";

export function WeddingGlassPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative w-full max-w-[110px] rounded-lg overflow-hidden shadow-lg bg-gradient-to-b from-coral-50 to-coral-100">
        {/* Wine-red border accent */}
        <div className="absolute inset-0 border-2 border-primary-900/20 rounded-lg pointer-events-none" />

        <div className="relative p-3 flex flex-col items-center gap-1.5">
          {/* Broken glass SVG motif */}
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-10 h-10"
          >
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <line x1="30" y1="42" x2="30" y2="55" stroke="#9d174d" strokeWidth="2" />
              <line x1="22" y1="55" x2="38" y2="55" stroke="#9d174d" strokeWidth="2" />
              <path
                d="M 15,10 L 20,38 Q 30,44 40,38 L 45,10 Z"
                fill="none"
                stroke="#9d174d"
                strokeWidth="1.5"
              />
              <path d="M 15,10 L 22,18 L 18,10" fill="#9d174d" opacity="0.6" />
              <path d="M 38,13 L 34,20 L 45,10" fill="#9d174d" opacity="0.6" />
              <path
                d="M 20,28 Q 30,36 40,28 L 40,38 Q 30,44 20,38 Z"
                fill="#be185d"
                opacity="0.4"
              />
            </svg>
          </motion.div>

          {/* Couple names */}
          <div className="flex items-center gap-1 text-[7px] text-primary-900 font-semibold">
            <span>נועה</span>
            <span className="text-coral-500">❤</span>
            <span>יונתן</span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-coral-400/50" />

          {/* Date & venue */}
          <p className="text-[5px] text-navy-400 text-center leading-relaxed">
            י״ב סיון תשפ״ה
            <br />
            אולמי גן עדן
          </p>

          {/* CTA */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="px-2 py-0.5 rounded-full text-[5px] font-bold text-white shadow bg-primary-800"
          >
            מזל טוב! 💍
          </motion.div>
        </div>
      </div>
    </div>
  );
}
