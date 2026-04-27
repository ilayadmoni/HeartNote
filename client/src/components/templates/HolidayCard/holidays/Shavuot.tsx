"use client";

import { motion } from "framer-motion";
import type { HolidayDecorationProps } from "./types";

function Milk({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 60" aria-hidden>
      <defs>
        <linearGradient id={`milkG-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f3f4f6" />
        </linearGradient>
      </defs>
      <path d="M12 8 L14 16 L26 16 L28 8 Z" stroke="#e5e7eb" strokeWidth="1.5" fill="none" />
      <rect x="12" y="8" width="16" height="32" rx="2" fill={`url(#milkG-${size})`} stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="20" cy="24" r="3" fill="#cffafe" opacity="0.6" />
      <path d="M14 12 Q18 10 20 10 Q22 10 26 12" stroke="#e0f2fe" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Cheese({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden>
      <defs>
        <linearGradient id={`cheeseG-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
      </defs>
      <path d="M8 10 L42 10 L35 35 L8 35 Z" fill={`url(#cheeseG-${size})`} stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx="15" cy="18" r="2.5" fill="#fbbf24" opacity="0.7" />
      <circle cx="28" cy="22" r="2.5" fill="#fbbf24" opacity="0.7" />
      <circle cx="20" cy="28" r="2.5" fill="#fbbf24" opacity="0.7" />
    </svg>
  );
}

function Wheat({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 60" aria-hidden>
      <defs>
        <linearGradient id={`wheatG-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>
      <line x1="20" y1="50" x2="20" y2="10" stroke="#92400e" strokeWidth="2" />
      {[0, 3, 6, 9, 12, 15, 18].map((offset, i) => (
        <g key={i}>
          <path
            d={`M20 ${12 + offset} Q${16 - i * 1.2} ${10 + offset} ${14 - i * 1.5} ${8 + offset}`}
            stroke={`url(#wheatG-${size})`}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M20 ${12 + offset} Q${24 + i * 1.2} ${10 + offset} ${26 + i * 1.5} ${8 + offset}`}
            stroke={`url(#wheatG-${size})`}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

function Flower({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="3" fill="#10b981" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <circle
          key={i}
          cx={20 + 10 * Math.cos((angle * Math.PI) / 180)}
          cy={20 + 10 * Math.sin((angle * Math.PI) / 180)}
          r="4"
          fill={["#dcfce7", "#bbf7d0", "#86efac"][i % 3]}
        />
      ))}
      <line x1="20" y1="20" x2="20" y2="38" stroke="#92400e" strokeWidth="1.5" />
    </svg>
  );
}

function FloatingElement({
  left,
  top,
  delay,
  children,
}: {
  left: string;
  top: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left, top }}
      animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function ShavuotDecorations({ variant }: HolidayDecorationProps) {
  const scale = variant === "mobile" ? 0.75 : 1;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background gradient: cream, white, light green, golden yellow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #fffaeb 0%, #dcfce7 30%, #fef08a 60%, #ffffff 100%)",
        }}
      />

      {/* Soft glow effect */}
      <div
        className="absolute left-1/4 top-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(220,252,231,0.4), transparent 70%)" }}
      />

      {/* Decorative border */}
      <div className="absolute inset-4 rounded-2xl border-2 pointer-events-none" style={{ borderColor: "rgba(212,180,86,0.3)" }} />

      {/* Floating milk bottles */}
      <FloatingElement left="10%" top="15%" delay={0}>
        <Milk size={48 * scale} />
      </FloatingElement>
      <FloatingElement left="80%" top="20%" delay={1.2}>
        <Milk size={40 * scale} />
      </FloatingElement>

      {/* Floating cheese blocks */}
      <FloatingElement left="70%" top="50%" delay={0.6}>
        <Cheese size={50 * scale} />
      </FloatingElement>
      <FloatingElement left="15%" top="65%" delay={1.8}>
        <Cheese size={44 * scale} />
      </FloatingElement>

      {/* Floating wheat stalks */}
      <FloatingElement left="42%" top="10%" delay={0.3}>
        <Wheat size={52 * scale} />
      </FloatingElement>
      <FloatingElement left="78%" top="70%" delay={1.5}>
        <Wheat size={48 * scale} />
      </FloatingElement>

      {/* Floating flowers */}
      {Array.from({ length: 6 }).map((_, i) => (
        <FloatingElement
          key={`flower-${i}`}
          left={`${15 + i * 14}%`}
          top={`${40 + (i % 2) * 30}%`}
          delay={i * 0.4}
        >
          <Flower size={32 * scale} />
        </FloatingElement>
      ))}

      {/* Decorative vine pattern */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="vineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.15)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.05)" />
          </linearGradient>
        </defs>
        {/* Left vine */}
        <path
          d="M 0,100 Q 30,150 20,250 T 40,450"
          fill="none"
          stroke="url(#vineGrad)"
          strokeWidth="3"
          opacity="0.6"
        />
        {/* Right vine */}
        <path
          d="M 400,150 Q 370,200 380,300 T 360,500"
          fill="none"
          stroke="url(#vineGrad)"
          strokeWidth="3"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
