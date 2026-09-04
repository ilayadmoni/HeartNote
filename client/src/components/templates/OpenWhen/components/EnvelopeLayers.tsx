"use client";

import { motion } from "framer-motion";
import { lighten, darken } from "../utils/envelopeColor";

interface EnvelopeLayersProps {
  index: number;
  primaryColor: string;
  unlocked: boolean;
  isOpening?: boolean;
}

/** Envelope back, front flaps and heart seal — purely decorative SVG layers. */
export function EnvelopeLayers({ index, primaryColor, unlocked, isOpening }: EnvelopeLayersProps) {
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

      {/* Front flaps SVG — swing down like doors opening when isOpening */}
      <motion.svg
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full pointer-events-none z-[4]"
        style={{ height: "45%", transformOrigin: "50% 100%" }}
        animate={isOpening ? { rotateX: -120, opacity: 0 } : { rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeIn" }}
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
      </motion.svg>

      {/* Bottom rounded edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-2 rounded-b-lg z-[5] pointer-events-none"
        style={{ backgroundColor: veryLight }}
      />

      {/* Heart seal at flap junction — irregular wax-drip edge sells an intact seal when locked */}
      <motion.div
        className="absolute z-[6] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ bottom: "19%" }}
        whileHover={{ scale: unlocked ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <div
          className="relative w-10 h-10 flex items-center justify-center text-white text-sm select-none"
          style={{
            borderRadius: "45% 55% 52% 48% / 55% 45% 55% 45%",
            background: `radial-gradient(circle at 35% 30%, ${lighten(primaryColor, 0.08)}, ${dark} 70%)`,
            boxShadow: `0 2px 6px ${dark}, inset 0 1px 2px rgba(255,255,255,0.35), inset 0 -2px 3px rgba(0,0,0,0.2)`,
          }}
        >
          <span
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.15)` }}
          />
          ♥
        </div>
      </motion.div>
    </>
  );
}
