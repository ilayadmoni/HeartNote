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
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate overflow-hidden">
      <FloatingIcons />
      <BackToGallery className="top-4 right-4 absolute" />
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 py-8">
        {/* Title */}
        {data.title && (
          <h1 className="text-2xl font-bold text-center text-[#5d4e37] dark:text-white mb-6 text-hebrew-heading break-words max-w-[320px]">
            {data.title.length > 50
              ? `${data.title.substring(0, 50)}...`
              : data.title}
          </h1>
        )}

        {/* Lottery Ticket Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md rounded-2xl border-4 shadow-2xl overflow-hidden"
          style={{
            backgroundColor: colorLight,
            borderColor: colorDark,
          }}
        >
          {/* Top Badge */}
          <div
            className="py-2 px-4 text-center"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="text-xs text-white tracking-widest text-hebrew-body">
              ✨ גרד כאן ✨
            </span>
          </div>

          {/* Scratch Area */}
          <div
            className="relative min-h-[120px] m-4 rounded-xl overflow-hidden"
            style={{ backgroundColor: primaryColor + "15" }}
          >
            {/* Prize Layer (Behind) */}
            <div className="flex flex-col items-center justify-center p-6 py-8 z-0">
              <p
                className="text-xs mb-2 text-hebrew-body tracking-widest"
                style={{ color: primaryColor }}
              >
                CONGRATULATIONS
              </p>
              <p
                className="text-xl md:text-2xl font-bold text-center text-hebrew-heading leading-relaxed break-words max-w-[300px]"
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
        <p className="mt-4 text-sm text-gray-800 dark:text-gray-500 text-hebrew-heading">
          👆 גררו את הכרטיס עם האצבע
        </p>

        {/* Reload Button */}
        {isRevealed && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReset}
            className="mt-3 w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-gray-500 hover:text-[#d4826f] transition-colors"
            aria-label="שחק מחדש"
          >
            <RotateCcw size={18} />
          </motion.button>
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
