"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { SlotMachineDesktopProps } from "../types";
import { Reel } from "../components/Reel";
import {
  FooterBranding,
  BackToGallery,
  TemplateResetButton,
} from "@/components/templates/components";

export function SlotMachineDesktop({
  data,
  spinCount,
  isSpinning,
  reelTexts,
  hasWon,
  primaryColor,
  spinsRequired,
  onSpin,
  onReset,
}: SlotMachineDesktopProps) {
  const t = useTranslations("templates");
  const remaining = spinsRequired - spinCount;
  const spinLabel = data.spinButtonLabel ?? t("slotMachine.spinLabel");
  const successEmoji = data.successEmoji ?? "🎉";

  return (
    <div className="flex flex-col h-full min-h-[390px] bg-transparent relative isolate overflow-hidden">
      <BackToGallery className="absolute top-4 end-4" />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-title-lg font-bold mb-2 break-words" style={{ color: primaryColor }} dir="auto">
            {data.title ?? t("slotMachine.titleDefault")}
          </h2>
          <p className="break-words" style={{ color: primaryColor, opacity: 0.75 }} dir="auto">
            {data.subtitle ?? t("slotMachine.subtitleDefault")}
          </p>
        </motion.div>

        {/* Reels */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-4 mb-10 justify-center"
        >
          {reelTexts.map((text, i) => (
            <Reel
              key={i}
              text={text}
              isSpinning={isSpinning}
              primaryColor={primaryColor}
              size="desktop"
              hasWon={hasWon}
            />
          ))}
        </motion.div>

        {/* Spin Button */}
        <motion.button
          whileHover={!isSpinning && !hasWon ? { scale: 1.04 } : {}}
          whileTap={!isSpinning && !hasWon ? { scale: 0.96 } : {}}
          onClick={onSpin}
          disabled={isSpinning || hasWon}
          className={`px-10 py-4 rounded-pill text-xl font-bold shadow-lg transition-all duration-300 text-accent-ink disabled:opacity-75 disabled:cursor-not-allowed ${hasWon ? "bg-accent" : ""}`}
          style={!hasWon ? { backgroundColor: primaryColor, boxShadow: `0 8px 25px ${primaryColor}40` } : undefined}
        >
          {hasWon
            ? `${successEmoji} ${t("slotMachine.won")}`
            : isSpinning
            ? `${spinLabel}...`
            : t("slotMachine.spinWithRemaining", { label: spinLabel, remaining })}
        </motion.button>

        {/* Reset button — shown after winning */}
        {hasWon && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5"
          >
            <TemplateResetButton onClick={onReset} label={t("common.resetDefault")} />
          </motion.div>
        )}
      </div>

      <FooterBranding className="shrink-0 mt-auto pb-4 relative z-10" />
    </div>
  );
}
