"use client";

import { motion } from "framer-motion";

export function WeddingGlassPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div
        className="relative w-full max-w-[110px] rounded-lg overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(160deg, #fdf8f0 0%, #f5ede0 100%)" }}
      >
        {/* Wine-red border accent */}
        <div className="absolute inset-0 border-2 border-rose-900/20 rounded-lg pointer-events-none" />

        <div className="relative p-3 flex flex-col items-center gap-1.5">
          {/* Broken glass SVG motif */}
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-10 h-10"
          >
            <svg viewBox="0 0 60 60" className="w-full h-full">
              {/* Wine glass stem */}
              <line x1="30" y1="42" x2="30" y2="55" stroke="#7f1d1d" strokeWidth="2" />
              <line x1="22" y1="55" x2="38" y2="55" stroke="#7f1d1d" strokeWidth="2" />
              {/* Glass bowl broken at top */}
              <path
                d="M 15,10 L 20,38 Q 30,44 40,38 L 45,10 Z"
                fill="none"
                stroke="#7f1d1d"
                strokeWidth="1.5"
              />
              {/* Break shards */}
              <path d="M 15,10 L 22,18 L 18,10" fill="#7f1d1d" opacity="0.6" />
              <path d="M 38,13 L 34,20 L 45,10" fill="#7f1d1d" opacity="0.6" />
              {/* Wine fill */}
              <path
                d="M 20,28 Q 30,36 40,28 L 40,38 Q 30,44 20,38 Z"
                fill="#9f1239"
                opacity="0.4"
              />
            </svg>
          </motion.div>

          {/* Couple names */}
          <div className="flex items-center gap-1 text-[7px] text-rose-900 font-semibold">
            <span>נועה</span>
            <span className="text-amber-600">❤</span>
            <span>יונתן</span>
          </div>

          {/* Gold divider */}
          <div className="w-full h-px bg-amber-400/50" />

          {/* Date & venue */}
          <p className="text-[5px] text-stone-500 text-center leading-relaxed">
            י״ב סיון תשפ״ה
            <br />
            אולמי גן עדן
          </p>

          {/* CTA */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="px-2 py-0.5 rounded-full text-[5px] font-bold text-white shadow"
            style={{ background: "#9f1239" }}
          >
            מזל טוב! 💍
          </motion.div>
        </div>
      </div>
    </div>
  );
}
