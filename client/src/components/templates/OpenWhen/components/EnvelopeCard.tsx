"use client";

/**
 * EnvelopeCard Component
 * Individual envelope with per-card color, emoji, lock state based on dateOpen
 */

import { motion } from "framer-motion";
import type { OpenWhenEnvelope } from "../types";
import { ENVELOPE_COLORS, isEnvelopeUnlocked } from "../constants";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";

/** Map color key to Tailwind classes */
const COLOR_KEY_MAP: Record<string, { bg: string; border: string }> = {
  rose: { bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-200 dark:border-rose-800" },
  sky: { bg: "bg-sky-50 dark:bg-sky-900/20", border: "border-sky-200 dark:border-sky-800" },
  amber: { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800" },
  violet: { bg: "bg-violet-50 dark:bg-violet-900/20", border: "border-violet-200 dark:border-violet-800" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
  pink: { bg: "bg-pink-50 dark:bg-pink-900/20", border: "border-pink-200 dark:border-pink-800" },
};

interface EnvelopeCardProps {
  envelope: OpenWhenEnvelope;
  index: number;
  onOpen: (envelope: OpenWhenEnvelope) => void;
  primaryColor?: string;
}

export function EnvelopeCard({
  envelope,
  index,
  onOpen,
  primaryColor = DEFAULT_PRIMARY_COLOR,
}: EnvelopeCardProps) {
  const unlocked = isEnvelopeUnlocked(envelope.dateOpen);
  // Use per-card color if set, otherwise fall back to rotating palette
  const color = envelope.color && COLOR_KEY_MAP[envelope.color]
    ? COLOR_KEY_MAP[envelope.color]
    : ENVELOPE_COLORS[index % ENVELOPE_COLORS.length];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={unlocked ? { scale: 1.05, y: -4 } : undefined}
      whileTap={unlocked ? { scale: 0.95 } : undefined}
      onClick={() => unlocked && onOpen(envelope)}
      disabled={!unlocked}
      aria-label={
        unlocked
          ? `פתח מכתב: ${envelope.title}`
          : `מכתב נעול: ${envelope.title}`
      }
      className={`
        relative aspect-square rounded-2xl border-2 overflow-hidden shadow-sm
        transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4
        ${color.bg} ${color.border}
        ${unlocked ? "cursor-pointer hover:shadow-lg" : "opacity-60 cursor-not-allowed"}
      `}
      style={
        unlocked
          ? ({
              "--hover-shadow": `0 10px 25px ${primaryColor}20`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* Emoji / Lock */}
      <span className="text-4xl">
        {unlocked ? envelope.emoji || "💌" : "🔒"}
      </span>

      {/* Title */}
      <p className="text-sm font-bold text-[#2e3c52] dark:text-white text-center text-hebrew-heading leading-tight">
        {envelope.title}
      </p>

      {/* Date hint */}
      {!unlocked && envelope.dateOpen && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500 text-hebrew-body">
          {new Date(envelope.dateOpen + "T00:00:00").toLocaleDateString(
            "he-IL",
          )}
        </span>
      )}

      {/* Locked overlay */}
      {!unlocked && (
        <div className="absolute inset-0 bg-gray-400/10 backdrop-blur-[0.5px] rounded-2xl" />
      )}
    </motion.button>
  );
}
