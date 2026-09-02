"use client";

/**
 * ScratchCardMobile Component
 * Lottery ticket style scratch card for mobile with touch interaction
 */

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import type { ScratchCardProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { FooterBranding, TemplateResetButton } from "@/components/templates/components";
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

const GRID_SIZE = 8;
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;
const REVEAL_THRESHOLD = 0.6;

export function ScratchCardMobile({ data }: ScratchCardProps) {
  const t = useTranslations("templates");
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");
  const [scratchedBlocks, setScratchedBlocks] = useState<Set<number>>(new Set());
  const [isRevealed, setIsRevealed] = useState(false);
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;
  const isPrimaryBlack = primaryColor.toUpperCase() === "#000000";

  useEffect(() => {
    if (isRevealed) {
      confetti({ particleCount: 60, spread: 50, origin: { x: 0.3, y: 0.5 }, colors: [primaryColor, "#ffd700", "#ff6b8a"] });
      confetti({ particleCount: 60, spread: 50, origin: { x: 0.7, y: 0.5 }, colors: [primaryColor, "#ffd700", "#ff6b8a"] });
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
    <div
      className={`w-full h-full flex flex-col items-center justify-center bg-transparent px-4 py-5 overflow-auto relative isolate ${
        isCreateRoute ? "min-h-[400px]" : "min-h-[100dvh]"
      }`}
    >
      <FloatingIcons />

      {data.title && (
        <h1
          className="text-xl font-bold text-center mb-4 break-words max-w-[280px]"
          style={{ color: cardTextColor }}
          dir="auto"
        >
          {data.title.length > 50 ? `${data.title.substring(0, 50)}...` : data.title}
        </h1>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[320px] rounded-card border-4 shadow-xl overflow-hidden"
        style={{ backgroundColor: cardBackgroundColor, borderColor: cardTextColor }}
      >
        <ScratchCardBadge
          badgeBackgroundColor={badgeBackgroundColor}
          badgeTextColor={badgeTextColor}
          colorLight={colorLight}
          size="sm"
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
          mode="touch"
          compact
        />
      </motion.div>

      <p className="mt-3 text-xs text-ink-subtle">{t("scratchCard.dragHint")}</p>

      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3"
        >
          <TemplateResetButton onClick={handleReset} label={t("scratchCard.scratchAgain")} />
        </motion.div>
      )}

      <div className="mt-6" />

      <FooterBranding className="absolute bottom-2" />
    </div>
  );
}
