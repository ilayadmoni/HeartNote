"use client";

/**
 * ScratchCardDesktop Component
 * Lottery ticket style scratch card for desktop with hover interaction
 */

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import type { ScratchCardProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
  BackToGallery,
  TemplateResetButton,
} from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";
import { adjustBrightness } from "../utils/adjustBrightness";
import { ScratchCardBadge } from "../components/ScratchCardBadge";
import { ScratchGrid } from "../components/ScratchGrid";

interface ExtendedData {
  title?: string;
  prizeContent?: string;
  prize?: { content: string };
  primaryColor?: string;
}

function getPrizeContent(data: unknown, fallback: string): string {
  const d = data as ExtendedData;
  return d.prizeContent || d.prize?.content || fallback;
}

const GRID_SIZE = 8; // 8x8 grid
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;
const REVEAL_THRESHOLD = 0.6;

export function ScratchCardDesktop({ data }: ScratchCardProps) {
  const t = useTranslations("templates");
  const [scratchedBlocks, setScratchedBlocks] = useState<Set<number>>(new Set());
  const [isRevealed, setIsRevealed] = useState(false);
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;
  const isPrimaryBlack = primaryColor.toUpperCase() === "#000000";

  useEffect(() => {
    if (isRevealed) {
      confetti({ particleCount: 80, spread: 60, origin: { x: 0.3, y: 0.5 }, colors: [primaryColor, "#ffd700", "#ff6b8a"] });
      confetti({ particleCount: 80, spread: 60, origin: { x: 0.7, y: 0.5 }, colors: [primaryColor, "#ffd700", "#ff6b8a"] });
    }
  }, [isRevealed, primaryColor]);

  const handleReset = useCallback(() => {
    setScratchedBlocks(new Set());
    setIsRevealed(false);
  }, []);

  const handleScratch = useCallback((index: number) => {
    setScratchedBlocks((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      if (newSet.size / TOTAL_BLOCKS > REVEAL_THRESHOLD) setIsRevealed(true);
      return newSet;
    });
  }, []);

  const colorLight = adjustBrightness(primaryColor, 80);
  const colorDark = adjustBrightness(primaryColor, -25);
  const cardBackgroundColor = isPrimaryBlack ? "#FFFFFF" : colorLight;
  const cardTextColor = isPrimaryBlack ? "#000000" : colorDark;
  const badgeBackgroundColor = isPrimaryBlack ? "#FFFFFF" : primaryColor;
  const badgeTextColor = isPrimaryBlack ? "#000000" : "#FFFFFF";

  return (
    <div className="flex flex-col min-h-[390px] 2xl:min-h-[650px] bg-transparent relative isolate overflow-hidden">
      <FloatingIcons />
      <BackToGallery className="top-4 end-4 absolute" />
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md 2xl:max-w-2xl mx-auto px-6 py-8 2xl:py-10">
        {data.title && (
          <h1
            className="text-title-lg 2xl:text-display-md font-bold text-center mb-6 2xl:mb-8 break-words max-w-[320px] 2xl:max-w-[520px]"
            style={{ color: cardTextColor }}
            dir="auto"
          >
            {data.title.length > 50 ? `${data.title.substring(0, 50)}...` : data.title}
          </h1>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md 2xl:max-w-2xl rounded-card 2xl:rounded-card border-4 shadow-2xl overflow-hidden"
          style={{ backgroundColor: cardBackgroundColor, borderColor: cardTextColor }}
        >
          <ScratchCardBadge
            badgeBackgroundColor={badgeBackgroundColor}
            badgeTextColor={badgeTextColor}
            colorLight={colorLight}
          />
          <ScratchGrid
            primaryColor={primaryColor}
            cardTextColor={cardTextColor}
            prizeContent={getPrizeContent(data, t("scratchCard.prizeDefault"))}
            scratchedBlocks={scratchedBlocks}
            isRevealed={isRevealed}
            gridSize={GRID_SIZE}
            totalBlocks={TOTAL_BLOCKS}
            onScratch={handleScratch}
          />
          <div className="py-3 px-4 flex items-center justify-center gap-3" style={{ backgroundColor: primaryColor }} />
        </motion.div>

        <p className="mt-4 2xl:mt-6 text-sm 2xl:text-base" style={{ color: cardTextColor }}>
          {t("scratchCard.dragHint")}
        </p>

        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 2xl:mt-5"
          >
            <TemplateResetButton onClick={handleReset} label={t("scratchCard.scratchAgain")} />
          </motion.div>
        )}
      </div>

      <FooterBranding className="shrink-0 pb-4" />
    </div>
  );
}
