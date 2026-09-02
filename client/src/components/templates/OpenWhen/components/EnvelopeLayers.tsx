"use client";

import { motion } from "framer-motion";
import { lighten, darken } from "../utils/envelopeColor";

interface EnvelopeLayersProps {
  index: number;
  primaryColor: string;
  unlocked: boolean;
}

/** Envelope back, front flaps and heart seal — purely decorative SVG layers. */
export function EnvelopeLayers({ index, primaryColor, unlocked }: EnvelopeLayersProps) {
  const dark = darken(primaryColor, 0.18);
  const light = lighten(primaryColor, 0.15);
  const veryLight = lighten(primaryColor, 0.28);

  return (
    <>
      {/* A2: Back flap — triangle with gradient */}
      <svg
        viewBox="0 0 100 42"
        preserveAspectRatio="none"
        className="absolute inset-x-0 w-full pointer-events-none"
        style={{ top: "10%", height: "23%" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`bf-${index}`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={dark} />
            <stop offset="100%" stopColor={darken(primaryColor, 0.22)} />
          </linearGradient>
        </defs>
        <polygon points="0,42 50,0 100,42" fill={`url(#bf-${index})`} />
        <polyline points="0,42 50,0 100,42" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.6" />
      </svg>

      {/* Flap shadow (cast onto card from flaps) */}
      <div
        className="absolute inset-x-0 pointer-events-none z-[3]"
        style={{
          bottom: "0",
          height: "40%",
          background: "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 20%)",
        }}
      />

      {/* Front flaps SVG */}
      <svg
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full pointer-events-none z-[4]"
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
        <polygon points="0,0 50,50 0,50" fill={`url(#lf-${index})`} />
        <polygon points="100,0 50,50 100,50" fill={`url(#rf-${index})`} />
        <line x1="0" y1="0" x2="50" y2="50" stroke={dark} strokeWidth="0.4" opacity="0.2" />
        <line x1="100" y1="0" x2="50" y2="50" stroke={dark} strokeWidth="0.4" opacity="0.2" />
      </svg>

      {/* Bottom rounded edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-2 rounded-b-lg z-[5] pointer-events-none"
        style={{ backgroundColor: veryLight }}
      />

      {/* Heart seal at flap junction */}
      <motion.div
        className="absolute z-[6] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ bottom: "19%" }}
        whileHover={{ scale: unlocked ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm select-none"
          style={{
            background: `radial-gradient(circle at 40% 35%, ${lighten(primaryColor, 0.05)}, ${dark})`,
            boxShadow: `0 2px 6px ${dark}, inset 0 1px 2px rgba(255,255,255,0.3)`,
          }}
        >
          ♥
        </div>
      </motion.div>
    </>
  );
}
