"use client";

/**
 * EnvelopeCard Component
 * Premium layered open-envelope with 3D depth:
 *   A) Envelope back + back-flap with gradient (bottom z)
 *   B) White card with padded, clamped text (middle z)
 *   C) Front flaps with gradient + heart seal (top z, see EnvelopeLayers)
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { OpenWhenEnvelope } from "../types";
import { isEnvelopeUnlocked, daysUntil } from "../constants";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { darken } from "../utils/envelopeColor";
import { EnvelopeLayers } from "./EnvelopeLayers";

const OPEN_ANIMATION_MS = 450;

interface EnvelopeCardProps {
  envelope: OpenWhenEnvelope;
  index: number;
  onOpen: (envelope: OpenWhenEnvelope) => void;
  primaryColor?: string;
}

function countdownLabel(
  t: ReturnType<typeof useTranslations>,
  dateOpen: string,
): string {
  const days = daysUntil(dateOpen);
  if (days <= 0) return t("openWhen.opensToday");
  if (days === 1) return t("openWhen.opensTomorrow");
  return t("openWhen.opensInDays", { count: days });
}

export function EnvelopeCard({
  envelope,
  index,
  onOpen,
  primaryColor = DEFAULT_PRIMARY_COLOR,
}: EnvelopeCardProps) {
  const t = useTranslations("templates");
  const unlocked = isEnvelopeUnlocked(envelope.dateOpen);
  const [isOpening, setIsOpening] = useState(false);

  const base = primaryColor;
  const dark = darken(primaryColor, 0.18);
  const textColor = darken(primaryColor, 0.35);

  const handleClick = () => {
    if (!unlocked || isOpening) return;
    setIsOpening(true);
    window.setTimeout(() => onOpen(envelope), OPEN_ANIMATION_MS);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      whileHover={unlocked && !isOpening ? { y: -6, scale: 1.02 } : undefined}
      whileTap={unlocked && !isOpening ? { scale: 0.97 } : undefined}
      onClick={handleClick}
      disabled={!unlocked || isOpening}
      aria-label={
        unlocked
          ? t("openWhen.openLetterAria", { title: envelope.title })
          : t("openWhen.lockedLetterAria", { title: envelope.title })
      }
      className={`
        group relative w-full
        transition-all duration-300 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${unlocked ? "cursor-pointer" : "cursor-not-allowed"}
      `}
      style={{
        aspectRatio: "4 / 5",
        filter: unlocked ? undefined : "saturate(0.3) brightness(0.82)",
      }}
    >
      {/* A1: Body with subtle gradient */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-b-lg"
        style={{
          top: "30%",
          background: `linear-gradient(180deg, ${base} 0%, ${dark} 100%)`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08)",
        }}
      />
      {/* A3: Body outline */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-b-lg pointer-events-none"
        style={{ top: "30%", border: "1px solid rgba(0,0,0,0.06)", borderTop: "none" }}
      />

      {/* Layer B — White card */}
      <motion.div
        className="absolute z-[2] flex flex-col items-center
          justify-center overflow-hidden
          transition-shadow duration-300 group-hover:shadow-lg"
        style={{
          left: "8%",
          right: "8%",
          top: "2%",
          bottom: "28%",
          background: "linear-gradient(180deg, #ffffff 0%, #fefcf9 100%)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.05)",
          borderRadius: "4px",
        }}
        animate={isOpening ? { y: "-55%", opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: OPEN_ANIMATION_MS / 1000, ease: "easeIn" }}
      >
        <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden">
          <p
            className="text-sm md:text-base font-bold
              text-center leading-snug
              line-clamp-3 break-words whitespace-normal
              w-full overflow-hidden"
            style={{ color: textColor }}
            dir="auto"
          >
            {envelope.title}
          </p>
        </div>

        {!unlocked && envelope.dateOpen && (
          <span className="mt-1 text-xs font-medium text-ink-subtle">
            {countdownLabel(t, envelope.dateOpen)}
          </span>
        )}
      </motion.div>

      <EnvelopeLayers
        index={index}
        primaryColor={primaryColor}
        unlocked={unlocked}
        isOpening={isOpening}
      />
    </motion.button>
  );
}
