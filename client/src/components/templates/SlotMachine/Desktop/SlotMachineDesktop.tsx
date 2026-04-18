"use client";

import { motion } from "framer-motion";
import type { SlotMachineDesktopProps } from "../types";
import { Reel } from "../components/Reel";
import {
  FooterBranding,
  BackToGallery,
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
}: SlotMachineDesktopProps) {
  const remaining = spinsRequired - spinCount;
  const spinLabel = data.spinButtonLabel ?? "סובבי";
  const successEmoji = data.successEmoji ?? "🎉";

  return (
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate overflow-hidden">
      <BackToGallery className="absolute top-4 right-4" />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-[#1b263b] text-hebrew-heading mb-2">
            {data.title ?? "מכונת ההבטחות"}
          </h2>
          <p className="text-[#415a77] text-hebrew-body">
            {data.subtitle ?? "סובבי 3 פעמים כדי לגלות מה מחכה לך הערב..."}
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
            />
          ))}
        </motion.div>

        {/* Spin Button */}
        <motion.button
          whileHover={!isSpinning && !hasWon ? { scale: 1.04 } : {}}
          whileTap={!isSpinning && !hasWon ? { scale: 0.96 } : {}}
          onClick={onSpin}
          disabled={isSpinning || hasWon}
          className="px-10 py-4 rounded-full text-xl font-bold shadow-lg transition-all duration-300 text-white text-hebrew-heading disabled:opacity-75 disabled:cursor-not-allowed"
          style={{
            backgroundColor: hasWon ? "#22c55e" : primaryColor,
            boxShadow: `0 8px 25px ${hasWon ? "#22c55e" : primaryColor}40`,
          }}
        >
          {hasWon
            ? `${successEmoji} יששש!`
            : isSpinning
            ? `${spinLabel}...`
            : `${spinLabel} (${remaining} נותרו)`}
        </motion.button>
      </div>

      <FooterBranding className="shrink-0 pb-4 relative z-10" />
    </div>
  );
}
