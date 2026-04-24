"use client";

import { motion } from "framer-motion";
import type { HolidayDecorationProps } from "./types";

function Mask({ flip }: { flip: boolean }) {
  return (
    <svg width="160" height="110" viewBox="0 0 160 110" aria-hidden style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      <defs>
        <linearGradient id={`maskG-${flip ? "r" : "l"}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path
        d="M10 40 Q30 10 80 18 Q130 10 150 40 Q150 70 120 80 Q100 85 90 75 Q80 68 70 75 Q60 85 40 80 Q10 70 10 40 Z"
        fill={`url(#maskG-${flip ? "r" : "l"})`}
        stroke="#fff7c2"
        strokeWidth="1.5"
      />
      <ellipse cx="52" cy="45" rx="14" ry="9" fill="#1f1235" />
      <ellipse cx="108" cy="45" rx="14" ry="9" fill="#1f1235" />
      {/* Feather accents */}
      <path d="M30 20 Q20 0 10 -5" stroke="#fde047" strokeWidth="2" fill="none" />
      <path d="M40 16 Q35 -4 28 -10" stroke="#fb7185" strokeWidth="2" fill="none" />
      <circle cx="80" cy="22" r="3" fill="#fff7c2" />
    </svg>
  );
}

function Gragger() {
  return (
    <svg width="120" height="120" viewBox="-60 -60 120 120" aria-hidden>
      <defs>
        <linearGradient id="gragG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect x="-4" y="0" width="8" height="50" fill="url(#gragG)" rx="2" />
      <path d="M-30 -30 L30 -30 L34 10 L-34 10 Z" fill="url(#gragG)" stroke="#fde68a" strokeWidth="1.5" />
      <circle cx="-14" cy="-10" r="4" fill="#fde047" />
      <circle cx="14" cy="-10" r="4" fill="#fb7185" />
      <circle cx="0" cy="-18" r="3" fill="#a7f3d0" />
    </svg>
  );
}

const CONFETTI = Array.from({ length: 28 }).map((_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: (i * 0.17) % 4,
  color: ["#fde047", "#f472b6", "#a78bfa", "#34d399", "#fb7185"][i % 5],
  shape: i % 3,
  duration: 5 + (i % 5),
}));

export function PurimDecorations({ variant }: HolidayDecorationProps) {
  const scale = variant === "mobile" ? 0.7 : 1;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, #ec4899 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, #f59e0b 0%, transparent 55%), linear-gradient(135deg, #6d28d9 0%, #a21caf 60%, #7c2d12 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{ backdropFilter: "blur(2px)", background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15), transparent 70%)" }}
      />
      <motion.div
        className="absolute top-[4%] left-[4%]"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        animate={{ y: [0, -10, 0], rotate: [-6, 2, -6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Mask flip={false} />
      </motion.div>
      <motion.div
        className="absolute top-[4%] right-[4%]"
        style={{ transform: `scale(${scale})`, transformOrigin: "top right" }}
        animate={{ y: [0, -8, 0], rotate: [6, -2, 6] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <Mask flip={true} />
      </motion.div>
      <motion.div
        className="absolute bottom-[6%] left-1/2 -translate-x-1/2"
        style={{ transform: `translateX(-50%) scale(${scale})`, transformOrigin: "center" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        <Gragger />
      </motion.div>
      {CONFETTI.map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: c.left, top: "-5%" }}
          animate={{ y: ["0%", "750%"], rotate: [0, 540], x: [0, i % 2 === 0 ? 30 : -30, 0] }}
          transition={{ duration: c.duration, repeat: Infinity, delay: c.delay, ease: "linear" }}
        >
          {c.shape === 0 && <div className="w-2 h-3 rounded-sm" style={{ backgroundColor: c.color }} />}
          {c.shape === 1 && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />}
          {c.shape === 2 && (
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <polygon points="5,0 10,10 0,10" fill={c.color} />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
