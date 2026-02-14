"use client";

/**
 * EnvelopeCard Component
 * Premium layered open-envelope with 3D depth:
 *   A) Envelope back + back-flap with gradient (bottom z)
 *   B) White card with padded, clamped text (middle z)
 *   C) Front flaps with gradient + heart seal (top z)
 */

import { motion } from "framer-motion";
import type { OpenWhenEnvelope } from "../types";
import { isEnvelopeUnlocked } from "../constants";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";

interface EnvelopeCardProps {
  envelope: OpenWhenEnvelope;
  index: number;
  onOpen: (envelope: OpenWhenEnvelope) => void;
  primaryColor?: string;
}

/** Parse hex to r,g,b tuple */
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Lighten a hex color by mixing toward white */
function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.min(255, r + Math.round(amount * 255))},${Math.min(255, g + Math.round(amount * 255))},${Math.min(255, b + Math.round(amount * 255))})`;
}

/** Darken a hex color by multiplying down */
function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r * (1 - amount))},${Math.round(g * (1 - amount))},${Math.round(b * (1 - amount))})`;
}

export function EnvelopeCard({
  envelope,
  index,
  onOpen,
  primaryColor = DEFAULT_PRIMARY_COLOR,
}: EnvelopeCardProps) {
  const unlocked = isEnvelopeUnlocked(envelope.dateOpen);

  const base = primaryColor;
  const dark = darken(primaryColor, 0.18);
  const light = lighten(primaryColor, 0.15);
  const veryLight = lighten(primaryColor, 0.28);
  const textColor = darken(primaryColor, 0.35);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      whileHover={unlocked ? { y: -6, scale: 1.02 } : undefined}
      whileTap={unlocked ? { scale: 0.97 } : undefined}
      onClick={() => unlocked && onOpen(envelope)}
      disabled={!unlocked}
      aria-label={
        unlocked
          ? `פתח מכתב: ${envelope.title}`
          : `מכתב נעול: ${envelope.title}`
      }
      className={`
        group relative w-full
        transition-all duration-300 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${unlocked ? "cursor-pointer" : "cursor-not-allowed"}
      `}
      style={{
        aspectRatio: "5 / 6",
        filter: unlocked ? undefined : "saturate(0.3) brightness(0.82)",
      }}
    >
      {/* ═══ Layer A — Envelope back ═══════════════════ */}

      {/* A1: Body with subtle gradient */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-b-lg"
        style={{
          top: "35%",
          background: `linear-gradient(180deg, ${base} 0%, ${dark} 100%)`,
          boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
        }}
      />

      {/* A2: Back flap — triangle with gradient */}
      <svg
        viewBox="0 0 100 42"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 w-full pointer-events-none"
        style={{ top: "14%", height: "23%" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`bf-${index}`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={dark} />
            <stop offset="100%" stopColor={darken(primaryColor, 0.22)} />
          </linearGradient>
        </defs>
        <polygon points="0,42 50,0 100,42" fill={`url(#bf-${index})`} />
        <polyline
          points="0,42 50,0 100,42"
          fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.6"
        />
      </svg>

      {/* A3: Body outline */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-b-lg pointer-events-none"
        style={{
          top: "35%",
          border: "1px solid rgba(0,0,0,0.06)",
          borderTop: "none",
        }}
      />

      {/* ═══ Layer B — White card ══════════════════════ */}
      <div
        className="absolute z-[2] flex flex-col items-center
          justify-center overflow-hidden
          transition-shadow duration-300 group-hover:shadow-lg"
        style={{
          left: "11%",
          right: "11%",
          top: "2%",
          bottom: "30%",
          background: "linear-gradient(180deg, #ffffff 0%, #fefcf9 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.05)",
          borderRadius: "4px",
        }}
      >
        {/* Title — padded, clamped, strictly bounded */}
        <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden">
          <p
            className="text-sm md:text-base font-bold
              text-center leading-snug text-hebrew-heading
              line-clamp-3 break-words whitespace-normal
              w-full overflow-hidden"
            style={{ color: textColor }}
          >
            {envelope.title}
          </p>
        </div>

        {/* Locked indicator */}
        {!unlocked && (
          <span className="text-lg select-none">🔒</span>
        )}

        {/* Locked date */}
        {!unlocked && envelope.dateOpen && (
          <span className="mt-1 text-[9px] text-gray-400 text-hebrew-body">
            {new Date(envelope.dateOpen + "T00:00:00").toLocaleDateString("he-IL")}
          </span>
        )}
      </div>

      {/* ═══ Layer C — Front flaps + seal ══════════════ */}

      {/* Flap shadow (cast onto card from flaps) */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-[3]"
        style={{
          bottom: "0",
          height: "46%",
          background: "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 20%)",
        }}
      />

      {/* Front flaps SVG */}
      <svg
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 bottom-0 w-full pointer-events-none z-[4]"
        style={{ height: "45%" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`lf-${index}`} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={light} />
            <stop offset="100%" stopColor={veryLight} />
          </linearGradient>
          <linearGradient id={`rf-${index}`} x1="1" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={light} />
            <stop offset="100%" stopColor={veryLight} />
          </linearGradient>
        </defs>
        {/* Left flap */}
        <polygon points="0,0 50,50 0,50" fill={`url(#lf-${index})`} />
        {/* Right flap */}
        <polygon points="100,0 50,50 100,50" fill={`url(#rf-${index})`} />
        {/* Fold lines */}
        <line x1="0" y1="0" x2="50" y2="50"
          stroke={dark} strokeWidth="0.4" opacity="0.2" />
        <line x1="100" y1="0" x2="50" y2="50"
          stroke={dark} strokeWidth="0.4" opacity="0.2" />
      </svg>

      {/* Bottom rounded edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-2 rounded-b-lg z-[5]
          pointer-events-none"
        style={{ backgroundColor: veryLight }}
      />

      {/* ═══ Heart seal at flap junction ═══════════════ */}
      <div
        className="absolute z-[6] left-1/2 -translate-x-1/2 pointer-events-none
          transition-transform duration-300 group-hover:scale-110"
        style={{ bottom: "20%" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center
            text-white text-xs select-none"
          style={{
            background: `radial-gradient(circle at 40% 35%, ${lighten(primaryColor, 0.05)}, ${dark})`,
            boxShadow: `0 2px 6px ${dark}, inset 0 1px 2px rgba(255,255,255,0.3)`,
          }}
        >
          ♥
        </div>
      </div>
    </motion.button>
  );
}
