"use client";

import { motion } from "framer-motion";
import type { HolidayDecorationProps } from "./types";

function Pomegranate({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 70" aria-hidden>
      <defs>
        <radialGradient id={`pomG-${size}`} cx="40%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="70%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#5f0b1f" />
        </radialGradient>
      </defs>
      <path d="M30 8 L26 14 Q28 12 30 14 Q32 12 34 14 Z" fill="#3f6212" />
      <circle cx="30" cy="40" r="22" fill={`url(#pomG-${size})`} />
      <path d="M30 18 L26 10 M30 18 L34 10 M30 18 L30 8" stroke="#3f6212" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="34" rx="3" ry="2" fill="#fecaca" opacity="0.6" />
    </svg>
  );
}

function Grapes({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 70" aria-hidden>
      <defs>
        <radialGradient id={`grG-${size}`} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#5b21b6" />
        </radialGradient>
      </defs>
      <path d="M28 6 Q32 4 34 10" stroke="#3f6212" strokeWidth="2" fill="none" />
      {[[30, 18], [22, 24], [38, 24], [26, 32], [34, 32], [30, 40], [22, 40], [38, 40], [26, 48], [34, 48], [30, 56]].map(
        ([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="6" fill={`url(#grG-${size})`} stroke="#3b0764" strokeWidth="0.5" />
        ),
      )}
    </svg>
  );
}

function Date({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 40 48" aria-hidden>
      <defs>
        <linearGradient id={`dtG-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>
      <path d="M20 2 L18 8" stroke="#3f6212" strokeWidth="1.5" />
      <ellipse cx="20" cy="26" rx="10" ry="18" fill={`url(#dtG-${size})`} />
      <ellipse cx="17" cy="20" rx="2" ry="4" fill="#fbbf24" opacity="0.35" />
    </svg>
  );
}

function Hanging({ left, delay, children }: { left: string; delay: number; children: React.ReactNode }) {
  return (
    <div className="absolute top-0" style={{ left }}>
      <div className="w-px h-10 bg-stone-700/40 mx-auto" />
      <motion.div
        className="origin-top"
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function SukkotDecorations({ variant }: HolidayDecorationProps) {
  const scale = variant === "mobile" ? 0.75 : 1;
  const wood = "#78350f";
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(254,243,199,0.45) 0%, transparent 60%), linear-gradient(180deg, #84cc16 0%, #65a30d 35%, #4d7c0f 100%)",
        }}
      />
      {/* Wooden frame */}
      <div className="absolute inset-3 rounded-xl border-4" style={{ borderColor: wood, boxShadow: "inset 0 0 0 2px rgba(120,53,15,0.5)" }} />
      <div className="absolute inset-3 rounded-xl" style={{ boxShadow: `inset 0 8px 0 ${wood}, inset 0 -8px 0 ${wood}` }} />
      {/* Schach — leafy top strip */}
      <svg className="absolute left-3 right-3 top-3 h-10" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 22 }).map((_, i) => (
          <ellipse
            key={i}
            cx={i * 20 + 8}
            cy={20 + (i % 3) * 4}
            rx="14"
            ry="8"
            fill={["#4d7c0f", "#65a30d", "#3f6212"][i % 3]}
            transform={`rotate(${(i * 13) % 30 - 15} ${i * 20 + 8} 20)`}
          />
        ))}
      </svg>
      {/* Hanging seven species */}
      <Hanging left="22%" delay={0}>
        <Pomegranate size={50 * scale} />
      </Hanging>
      <Hanging left="48%" delay={0.6}>
        <Grapes size={54 * scale} />
      </Hanging>
      <Hanging left="72%" delay={1.2}>
        <Date size={32 * scale} />
      </Hanging>
      {/* Floating leaves */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${(i * 43) % 100}%`, top: "20%" }}
          animate={{ y: [0, 300], x: [0, i % 2 ? 20 : -20], rotate: [0, 180] }}
          transition={{ duration: 10 + (i % 4), repeat: Infinity, delay: i * 0.6, ease: "linear" }}
        >
          <svg width={14 * scale} height={14 * scale} viewBox="0 0 14 14" aria-hidden>
            <path d="M7 1 Q12 7 7 13 Q2 7 7 1 Z" fill="#65a30d" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
