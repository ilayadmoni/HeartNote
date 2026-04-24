"use client";

import { motion } from "framer-motion";
import type { HolidayDecorationProps } from "./types";

function Pyramid({ x, scale: s, shade }: { x: string; scale: number; shade: string }) {
  return (
    <svg
      width={240 * s}
      height={160 * s}
      viewBox="0 0 240 160"
      aria-hidden
      className="absolute bottom-[28%]"
      style={{ left: x, opacity: 0.75 }}
    >
      <defs>
        <linearGradient id={`pyrG-${shade}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade} />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      <polygon points="120,10 230,150 10,150" fill={`url(#pyrG-${shade})`} />
      <polygon points="120,10 230,150 120,150" fill="rgba(0,0,0,0.18)" />
    </svg>
  );
}

function Matzah({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <defs>
        <pattern id={`mz-${size}`} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.8" fill="#78350f" opacity="0.55" />
        </pattern>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="4" fill="#fde68a" stroke="#b45309" strokeWidth="1" />
      <rect x="2" y="2" width="44" height="44" rx="4" fill={`url(#mz-${size})`} />
    </svg>
  );
}

function Walker({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx="0" cy="-18" r="3" fill="#3b1f08" />
      <path d="M-2 -15 L-4 -2 L-6 10 M2 -15 L4 -2 L7 10 M-4 -12 L6 -8" stroke="#3b1f08" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M0 -22 L-3 -20 L3 -20 Z" fill="#3b1f08" />
    </g>
  );
}

const MATZOT = [
  { x: "12%", y: "18%", size: 44, delay: 0, duration: 7 },
  { x: "80%", y: "14%", size: 32, delay: 1.1, duration: 6 },
  { x: "84%", y: "60%", size: 38, delay: 0.5, duration: 7.5 },
  { x: "8%", y: "58%", size: 36, delay: 1.6, duration: 6.5 },
];

export function PesachDecorations({ variant }: HolidayDecorationProps) {
  const scale = variant === "mobile" ? 0.7 : 1;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #5eead4 0%, #99f6e4 25%, #fef3c7 55%, #fbbf24 100%)",
        }}
      />
      {/* Pyramids */}
      <Pyramid x="-8%" scale={scale * 1.1} shade="#d97706" />
      <Pyramid x="35%" scale={scale * 0.85} shade="#f59e0b" />
      <Pyramid x="70%" scale={scale * 1.05} shade="#b45309" />
      {/* Sun glow */}
      <div
        className="absolute left-1/2 top-[14%] -translate-x-1/2 w-40 h-40 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,237,170,0.95), transparent 70%)" }}
      />
      {/* Desert floor */}
      <div
        className="absolute left-0 right-0 bottom-0 h-[28%]"
        style={{ background: "linear-gradient(to bottom, #fbbf24 0%, #b45309 100%)" }}
      />
      {/* Walking silhouette */}
      <svg
        className="absolute left-0 bottom-[24%] w-full"
        height={40 * scale}
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        aria-hidden
      >
        <motion.g
          animate={{ x: [-60, 440] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          <Walker x={0} />
          <Walker x={22} />
          <Walker x={46} />
          <Walker x={72} />
          <Walker x={96} />
        </motion.g>
      </svg>
      {/* Floating matzot */}
      {MATZOT.map((m, i) => (
        <motion.div
          key={i}
          className="absolute drop-shadow"
          style={{ left: m.x, top: m.y }}
          animate={{ y: [0, -14, 0], rotate: [-6, 6, -6] }}
          transition={{ duration: m.duration, repeat: Infinity, delay: m.delay, ease: "easeInOut" }}
        >
          <Matzah size={m.size * scale} />
        </motion.div>
      ))}
    </div>
  );
}
