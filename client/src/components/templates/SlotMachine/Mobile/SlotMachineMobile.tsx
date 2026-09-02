"use client";

import { motion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import type { SlotMachineMobileProps } from "../types";
import { Reel } from "../components/Reel";
import {
  FooterBranding,
  TemplateResetButton,
} from "@/components/templates/components";

export function SlotMachineMobile({
  data,
  spinCount,
  isSpinning,
  reelTexts,
  hasWon,
  primaryColor,
  spinsRequired,
  onSpin,
  onReset,
}: SlotMachineMobileProps) {
  const remaining = spinsRequired - spinCount;
  const spinLabel = data.spinButtonLabel ?? "סובבי";
  const successEmoji = data.successEmoji ?? "🎉";

  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');

  return (
    <div className={`w-full flex flex-col bg-transparent relative isolate overflow-hidden px-4 py-6 ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[650px]'
    }`}>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2
            className="text-xl font-bold text-hebrew-heading mb-1 break-words"
            style={{ color: primaryColor }}
          >
            {data.title ?? "מכונת ההבטחות"}
          </h2>
          <p
            className="text-sm text-hebrew-body break-words"
            style={{ color: primaryColor, opacity: 0.75 }}
          >
            {data.subtitle ?? "סובבי 3 פעמים כדי לגלות מה מחכה לך הערב..."}
          </p>
        </motion.div>

        {/* Reels */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2 justify-center"
        >
          {reelTexts.map((text, i) => (
            <Reel
              key={i}
              text={text}
              isSpinning={isSpinning}
              primaryColor={primaryColor}
              size="mobile"
            />
          ))}
        </motion.div>

        {/* Spin Button */}
        <motion.button
          whileTap={!isSpinning && !hasWon ? { scale: 0.96 } : {}}
          onClick={onSpin}
          disabled={isSpinning || hasWon}
          className="px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-300 text-white text-hebrew-heading disabled:opacity-75 disabled:cursor-not-allowed"
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

        {/* Reset button — shown after winning */}
        {hasWon && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TemplateResetButton onClick={onReset} label="נסה שוב" />
          </motion.div>
        )}
      </div>

      <FooterBranding className="mx-auto mt-4" />
    </div>
  );
}
