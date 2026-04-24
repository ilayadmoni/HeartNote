"use client";

import { motion } from "framer-motion";
import type { HolidayTheme } from "../holidays/registry";
import type { HolidayVariant } from "../holidays/types";

interface GlassCardProps {
  title: string;
  greeting: string;
  theme: HolidayTheme;
  primaryColor: string;
  variant: HolidayVariant;
}

export function GlassCard({
  title,
  greeting,
  theme,
  primaryColor,
  variant,
}: GlassCardProps) {
  const isMobile = variant === "mobile";

  return (
    <div className="relative">
      {/* Ambient glow halo */}
      <div
        className="absolute inset-0 rounded-[2rem] blur-2xl"
        style={{ background: theme.glowColor, transform: "scale(1.08)" }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -4, 0],
        }}
        transition={{
          opacity: { duration: 0.6 },
          scale: { duration: 0.6 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className={`relative rounded-[2rem] flex flex-col items-center text-center overflow-hidden ${
          isMobile ? "p-7 max-w-xs" : "p-12 max-w-md"
        }`}
        style={{
          backgroundColor: theme.glassTint,
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          border: `1px solid ${theme.glassBorder}`,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), 0 20px 60px -20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Inner highlight */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 40%)",
          }}
          aria-hidden
        />

        <h3
          className={`font-black text-hebrew-heading mb-3 relative z-10 break-words w-full ${
            isMobile ? "text-xl" : "text-3xl"
          }`}
          style={{ color: primaryColor || theme.accentColor }}
        >
          {title}
        </h3>

        <p
          className={`text-hebrew-body relative z-10 break-words w-full ${
            isMobile ? "text-sm" : "text-base"
          }`}
          style={{ color: theme.accentColor, opacity: 0.9 }}
        >
          {greeting}
        </p>
      </motion.div>
    </div>
  );
}
