"use client";

/**
 * ScratchCardMobile Component
 * Lottery ticket style scratch card for mobile with touch interaction
 * Max 150 lines per project rules
 */

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import confetti from "canvas-confetti";
import type { ScratchCardProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
  TemplateResetButton,
} from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";

interface ExtendedData {
  title?: string;
  prizeContent?: string;
  prize?: { content: string };
  primaryColor?: string;
}

const getPrizeContent = (data: unknown): string => {
  const d = data as ExtendedData;
  return d.prizeContent || d.prize?.content || "זכית בהפתעה!";
};

const GRID_SIZE = 8;
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;
const REVEAL_THRESHOLD = 0.6;

export function ScratchCardMobile({ data }: ScratchCardProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");
  const [scratchedBlocks, setScratchedBlocks] = useState<Set<number>>(
    new Set(),
  );
  const [isRevealed, setIsRevealed] = useState(false);
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;
  const isPrimaryBlack = primaryColor.toUpperCase() === "#000000";

  // Trigger confetti when card is revealed
  useEffect(() => {
    if (isRevealed) {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { x: 0.3, y: 0.5 },
        colors: [primaryColor, "#ffd700", "#ff6b8a"],
      });
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { x: 0.7, y: 0.5 },
        colors: [primaryColor, "#ffd700", "#ff6b8a"],
      });
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
      if (newSet.size / TOTAL_BLOCKS > REVEAL_THRESHOLD) {
        setIsRevealed(true);
      }
      return newSet;
    });
  }, []);

  // Create 3-level color scale from primaryColor
  const colorLight = adjustBrightness(primaryColor, 80); // Very light tint for background
  const colorDark = adjustBrightness(primaryColor, -25); // Darker for border
  const cardBackgroundColor = isPrimaryBlack ? "#FFFFFF" : colorLight;
  const cardTextColor = isPrimaryBlack ? "#000000" : colorDark;
  const badgeBackgroundColor = isPrimaryBlack ? "#FFFFFF" : primaryColor;
  const badgeTextColor = isPrimaryBlack ? "#000000" : "#FFFFFF";

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center bg-transparent px-4 py-5 overflow-auto relative isolate ${
        isCreateRoute ? "min-h-[400px]" : "min-h-[650px]"
      }`}
    >
      <FloatingIcons />


      {/* Title */}
      {data.title && (
        <h1
          className="text-xl font-bold text-center mb-4 text-hebrew-heading break-words max-w-[280px]"
          style={{ color: cardTextColor }}
        >
          {data.title.length > 50
            ? `${data.title.substring(0, 50)}...`
            : data.title}
        </h1>
      )}

      {/* Lottery Ticket Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[320px] rounded-2xl border-4 shadow-xl overflow-hidden"
        style={{
          backgroundColor: cardBackgroundColor,
          borderColor: cardTextColor,
        }}
      >
        {/* Top Badge */}
        <div
          className="relative py-3 px-4 flex items-center justify-center border-b-2 border-dashed border-white/40"
          style={{ 
            backgroundColor: badgeBackgroundColor,
            boxShadow: "inset 0px 4px 6px rgba(255, 255, 255, 0.25)"
          }}
        >
          <div className="relative z-10 flex items-center gap-2">
            <motion.span
              animate={{ rotate: [-10, 10, -10], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-base drop-shadow-md"
            >
              ✨
            </motion.span>
            <h2
              className="text-sm font-bold tracking-widest text-hebrew-heading drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
              style={{ color: badgeTextColor }}
            >
              גרד כאן
            </h2>
            <motion.span
              animate={{ rotate: [10, -10, 10], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
              className="text-base drop-shadow-md"
            >
              ✨
            </motion.span>
          </div>

          {/* Side ticket notches mimicking perforations */}
          <div 
            className="absolute -bottom-[10px] -left-2 w-5 h-5 rounded-full border-t border-r border-white/20 z-10"
            style={{ backgroundColor: colorLight }}
          />
          <div 
            className="absolute -bottom-[10px] -right-2 w-5 h-5 rounded-full border-t border-l border-white/20 z-10"
            style={{ backgroundColor: colorLight }}
          />
        </div>

        {/* Scratch Area */}
        <div
          className="relative min-h-[180px] m-3 rounded-xl overflow-hidden"
          style={{ backgroundColor: primaryColor + "15" }}
        >
          {/* Prize Layer (Behind) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-0">
            <p
              className="text-[10px] mb-1 text-hebrew-body tracking-widest"
              style={{ color: primaryColor }}
            >
              CONGRATULATIONS
            </p>
            <p
              className="text-base font-bold text-center text-hebrew-heading leading-relaxed break-words max-w-[240px]"
              style={{ color: cardTextColor }}
            >
              {getPrizeContent(data)}
            </p>
          </div>

          {/* Scratch Grid Overlay */}
          {!isRevealed && (
            <div
              className="absolute inset-0 grid z-10 touch-none"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
              }}
            >
              {Array.from({ length: TOTAL_BLOCKS }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: scratchedBlocks.has(index) ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                  onTouchStart={() => handleScratch(index)}
                  onTouchMove={(e) => {
                    const touch = e.touches[0];
                    const element = document.elementFromPoint(
                      touch.clientX,
                      touch.clientY,
                    );
                    const idx = element?.getAttribute("data-index");
                    if (idx) handleScratch(parseInt(idx));
                  }}
                  data-index={index}
                  className="border border-gray-300/30 dark:border-gray-500/30"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #d1d5db 0%, #e5e7eb 50%, #9ca3af 100%)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Reveal Sparkle Effect */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-200/60 to-transparent pointer-events-none z-20"
            />
          )}
        </div>
      </motion.div>

      {/* Hint Text */}
      <p className="mt-3 text-xs text-gray-800 dark:text-gray-500 text-hebrew-heading">
        👆 גררו את הכרטיס עם האצבע
      </p>

      {/* Reload Button */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3"
        >
          <TemplateResetButton onClick={handleReset} label="גרד שוב" />
        </motion.div>
      )}

      {/* Spacer for footer */}
      <div className="mt-6" />

      {/* Footer Credit */}
      <FooterBranding className="absolute bottom-2" />
    </div>
  );
}

/** Adjust hex color brightness by percentage (-100 to 100) */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(
    255,
    Math.max(0, (num >> 16) + ((num >> 16) * percent) / 100),
  );
  const g = Math.min(
    255,
    Math.max(
      0,
      ((num >> 8) & 0x00ff) + (((num >> 8) & 0x00ff) * percent) / 100,
    ),
  );
  const b = Math.min(
    255,
    Math.max(0, (num & 0x0000ff) + ((num & 0x0000ff) * percent) / 100),
  );
  return `#${(0x1000000 + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
}
