"use client";

import { motion } from "framer-motion";
import type { HolidayDecorationProps } from "./types";

const APPLES = [
  { size: 56, x: "8%", y: "14%", delay: 0, duration: 6 },
  { size: 42, x: "82%", y: "22%", delay: 1.2, duration: 7 },
  { size: 68, x: "14%", y: "72%", delay: 2.1, duration: 8 },
  { size: 38, x: "78%", y: "68%", delay: 0.6, duration: 6.5 },
  { size: 30, x: "46%", y: "10%", delay: 1.8, duration: 5.5 },
];

function Apple({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs>
        <radialGradient id={`appleG-${size}`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#ff9a8a" />
          <stop offset="55%" stopColor="#e04a3b" />
          <stop offset="100%" stopColor="#8a1d12" />
        </radialGradient>
      </defs>
      <path
        d="M32 14c3-6 9-9 14-8 6 2 10 9 10 17 0 13-9 29-20 29-3 0-5-1-8-1s-5 1-8 1C9 52 0 36 0 23 0 15 4 8 10 6c5-1 11 2 14 8 2-3 5-5 8-5z"
        transform="translate(4 6)"
        fill={`url(#appleG-${size})`}
      />
      <path
        d="M34 8c2-4 6-6 9-5"
        stroke="#4a2a10"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="22" cy="22" rx="5" ry="3" fill="#fff" opacity="0.4" />
    </svg>
  );
}

function HoneyDrip({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <svg
      className={`absolute top-0 ${isLeft ? "left-0" : "right-0"} pointer-events-none`}
      width="180"
      height="220"
      viewBox="0 0 180 220"
      style={{ transform: isLeft ? "none" : "scaleX(-1)" }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`honey-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4c542" />
          <stop offset="100%" stopColor="#b87a0a" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 0 H180 V60 Q150 90 120 70 T60 110 Q40 130 55 160 Q65 185 40 200 Q20 215 0 200 Z"
        fill={`url(#honey-${side})`}
        initial={{ opacity: 0.75 }}
        animate={{ d: [
          "M0 0 H180 V60 Q150 90 120 70 T60 110 Q40 130 55 160 Q65 185 40 200 Q20 215 0 200 Z",
          "M0 0 H180 V64 Q148 96 122 76 T58 120 Q38 140 52 170 Q62 192 42 206 Q22 218 0 204 Z",
          "M0 0 H180 V60 Q150 90 120 70 T60 110 Q40 130 55 160 Q65 185 40 200 Q20 215 0 200 Z",
        ] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="42"
        cy="200"
        r="6"
        fill={`url(#honey-${side})`}
        animate={{ cy: [200, 230, 200], opacity: [1, 0, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
      />
    </svg>
  );
}

export function RoshHashanahDecorations({ variant }: HolidayDecorationProps) {
  const scale = variant === "mobile" ? 0.7 : 1;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #ffe9b5 0%, transparent 55%), radial-gradient(ellipse at 75% 85%, #ffd089 0%, transparent 60%), linear-gradient(135deg, #fff6dc 0%, #ffe2a8 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-60 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,220,130,0.5), transparent 70%)",
        }}
      />
      <HoneyDrip side="left" />
      <HoneyDrip side="right" />
      {APPLES.map((a, i) => (
        <motion.div
          key={i}
          className="absolute drop-shadow-lg"
          style={{ left: a.x, top: a.y }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -14, 0],
            rotate: [-6, 6, -6],
          }}
          transition={{
            opacity: { duration: 0.8, delay: a.delay * 0.2 },
            scale: { duration: 0.8, delay: a.delay * 0.2 },
            y: { duration: a.duration, repeat: Infinity, ease: "easeInOut", delay: a.delay },
            rotate: { duration: a.duration * 1.3, repeat: Infinity, ease: "easeInOut", delay: a.delay },
          }}
        >
          <Apple size={a.size * scale} />
        </motion.div>
      ))}
    </div>
  );
}
