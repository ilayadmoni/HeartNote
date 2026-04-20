"use client";

/**
 * ScratchCardDesktop Component
 * Lottery ticket style scratch card for desktop with hover interaction
 * Max 150 lines per project rules
 */

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import type { ScratchCardProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
  BackToGallery,
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

const GRID_SIZE = 8; // 8x8 grid
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;
const REVEAL_THRESHOLD = 0.6;

export function ScratchCardDesktop({ data }: ScratchCardProps) {
  const [scratchedBlocks, setScratchedBlocks] = useState<Set<number>>(
    new Set(),
  );
  const [isRevealed, setIsRevealed] = useState(false);
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  // Trigger confetti when card is revealed
  useEffect(() => {
    if (isRevealed) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: 0.3, y: 0.5 },
        colors: [primaryColor, "#ffd700", "#ff6b8a"],
      });
      confetti({
        particleCount: 80,
        spread: 60,
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

  const serialNumber = "LUV-888-WIN";

  // Create 3-level color scale from primaryColor
  const colorLight = adjustBrightness(primaryColor, 80); // Very light tint for background
  const colorDark = adjustBrightness(primaryColor, -25); // Darker for border

  return (
    <div className="flex flex-col min-h-[390px] 2xl:min-h-[650px] bg-transparent relative isolate overflow-hidden">
      <FloatingIcons />
      <BackToGallery className="top-4 right-4 absolute" />
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md 2xl:max-w-2xl mx-auto px-6 py-8 2xl:py-10">
        {/* Title */}
        {data.title && (
          <h1
            className="text-2xl 2xl:text-4xl font-bold text-center mb-6 2xl:mb-8 text-hebrew-heading break-words max-w-[320px] 2xl:max-w-[520px]"
            style={{ color: colorDark }}
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
          className="relative w-full max-w-md 2xl:max-w-2xl rounded-2xl 2xl:rounded-3xl border-4 shadow-2xl overflow-hidden"
          style={{
            backgroundColor: colorLight,
            borderColor: colorDark,
          }}
        >
          {/* Top Badge */}
          <div
            className="relative py-4 px-6 2xl:py-6 2xl:px-10 flex items-center justify-center border-b-2 border-dashed border-white/40"
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: "inset 0px 4px 6px rgba(255, 255, 255, 0.25)"
            }}
          >
            <div className="relative z-10 flex items-center gap-3">
              <motion.span
                animate={{ rotate: [-10, 10, -10], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-xl 2xl:text-3xl drop-shadow-md"
              >
                ✨
              </motion.span>
              <h2 className="text-lg 2xl:text-3xl font-bold text-white tracking-widest text-hebrew-heading drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                גרד כאן
              </h2>
              <motion.span
                animate={{ rotate: [10, -10, 10], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
                className="text-xl 2xl:text-3xl drop-shadow-md"
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
            className="relative min-h-[120px] 2xl:min-h-[180px] m-4 2xl:m-6 rounded-xl 2xl:rounded-2xl overflow-hidden"
            style={{ backgroundColor: primaryColor + "15" }}
          >
            {/* Prize Layer (Behind) */}
            <div className="flex flex-col items-center justify-center p-6 py-8 2xl:p-10 2xl:py-12 z-0">
              <p
                className="text-xs 2xl:text-sm mb-2 2xl:mb-3 text-hebrew-body tracking-widest"
                style={{ color: primaryColor }}
              >
                CONGRATULATIONS
              </p>
              <p
                className="text-xl md:text-2xl 2xl:text-4xl font-bold text-center text-hebrew-heading leading-relaxed break-words max-w-[300px] 2xl:max-w-[520px]"
                style={{ color: colorDark }}
              >
                {getPrizeContent(data)}
              </p>
            </div>

            {/* Scratch Grid Overlay */}
            {!isRevealed && (
              <div
                className="absolute inset-0 grid z-10"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                  cursor: "grab",
                }}
              >
                {Array.from({ length: TOTAL_BLOCKS }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: scratchedBlocks.has(index) ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => handleScratch(index)}
                    className="bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 dark:from-gray-500 dark:via-gray-400 dark:to-gray-600 border border-gray-300/30 dark:border-gray-500/30"
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

          {/* Serial Number Footer */}
          <div
            className="py-3 px-4 flex items-center justify-center gap-3"
            style={{ backgroundColor: primaryColor }}
          ></div>
        </motion.div>

        {/* Hint Text */}
        <p
          className="mt-4 2xl:mt-6 text-sm 2xl:text-base text-hebrew-heading"
          style={{ color: colorDark }}
        >
          👆 גררו את הכרטיס עם האצבע
        </p>

        {/* Reload Button */}
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 2xl:mt-5"
          >
            <TemplateResetButton onClick={handleReset} label="שחק שוב" />
          </motion.div>
        )}
      </div>

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 pb-4" />
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
