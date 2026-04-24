"use client";

import { motion } from "framer-motion";
import type { HolidayDecorationProps } from "./types";

const CANDLE_OFFSETS = [-120, -90, -60, -30, 30, 60, 90, 120];

function Flame({ delay }: { delay: number }) {
  return (
    <motion.path
      d="M0 0 C -4 -6 -4 -14 0 -22 C 4 -14 4 -6 0 0 Z"
      fill="url(#flameG)"
      animate={{ opacity: [0.7, 1, 0.8, 1], scaleY: [1, 1.12, 0.95, 1.05] }}
      transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
      style={{ transformOrigin: "center bottom" }}
    />
  );
}

function Menorah() {
  return (
    <svg width="320" height="220" viewBox="-160 -180 320 220" aria-hidden>
      <defs>
        <linearGradient id="menoG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id="flameG" cx="50%" cy="80%" r="80%">
          <stop offset="0%" stopColor="#fff7c2" />
          <stop offset="60%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
      </defs>
      {/* Shamash center stem */}
      <path d="M-3 -30 L3 -30 L3 -120 L-3 -120 Z" fill="url(#menoG)" />
      {/* Arms */}
      {CANDLE_OFFSETS.map((x) => (
        <path
          key={x}
          d={`M0 -30 Q0 -60 ${x} -90 L${x} -110`}
          stroke="url(#menoG)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {/* Base */}
      <path d="M-60 -10 L60 -10 L40 10 L-40 10 Z" fill="url(#menoG)" />
      <rect x="-10" y="-30" width="20" height="20" fill="url(#menoG)" />
      {/* Candles + flames */}
      {[0, ...CANDLE_OFFSETS].map((x, i) => (
        <g key={x} transform={`translate(${x} ${x === 0 ? -120 : -110})`}>
          <rect x="-3" y="-14" width="6" height="14" fill="#fef3c7" />
          <g transform="translate(0 -14)">
            <Flame delay={i * 0.12} />
          </g>
        </g>
      ))}
    </svg>
  );
}

function Sufganiya({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      <defs>
        <radialGradient id={`donutG-${size}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="22" fill={`url(#donutG-${size})`} />
      <path
        d="M12 22 Q30 12 48 22 Q46 28 42 24 Q30 18 18 24 Q14 28 12 22 Z"
        fill="#e11d48"
        opacity="0.85"
      />
      <circle cx="22" cy="20" r="1.5" fill="#fff" />
      <circle cx="36" cy="19" r="1.2" fill="#fff" />
      <circle cx="42" cy="24" r="1.3" fill="#fff" />
    </svg>
  );
}

const DONUTS = [
  { x: "10%", y: "20%", size: 44, delay: 0, duration: 6 },
  { x: "78%", y: "28%", size: 36, delay: 1.1, duration: 7 },
  { x: "16%", y: "78%", size: 40, delay: 0.6, duration: 6.5 },
  { x: "80%", y: "75%", size: 32, delay: 1.8, duration: 7.5 },
];

export function HanukkahDecorations({ variant }: HolidayDecorationProps) {
  const scale = variant === "mobile" ? 0.65 : 1;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(253,224,71,0.28) 0%, transparent 55%), radial-gradient(ellipse at 50% 20%, #1e3a8a 0%, #0b1233 70%, #050820 100%)",
        }}
      />
      <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <Menorah />
      </div>
      {DONUTS.map((d, i) => (
        <motion.div
          key={i}
          className="absolute drop-shadow-lg"
          style={{ left: d.x, top: d.y }}
          animate={{ y: [0, -16, 0], rotate: [-8, 8, -8] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
        >
          <Sufganiya size={d.size * scale} />
        </motion.div>
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={`s-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{ left: `${(i * 41) % 100}%`, top: "-2%", opacity: 0.8 }}
          animate={{ y: ["0%", "700%"], opacity: [0, 1, 0] }}
          transition={{ duration: 8 + (i % 4), repeat: Infinity, delay: i * 0.4, ease: "linear" }}
        />
      ))}
    </div>
  );
}
