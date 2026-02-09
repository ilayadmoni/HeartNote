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
import { FooterBranding, BackToGallery } from "@/components/templates/components";

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
      if (newSet.size / TOTAL_BLOCKS > REVEAL_THRESHOLD) {
        setIsRevealed(true);
      }
      return newSet;
    });
  }, []);

  const serialNumber = "LUV-888-WIN";

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#fdf6f3] dark:bg-gray-900 p-6 overflow-auto relative">
      {/* Back to Gallery */}
      <BackToGallery className="absolute top-4 right-4 z-20" />

      {/* Title */}
      {data.title && (
        <h1 className="text-2xl font-bold text-center text-[#5d4e37] dark:text-white mb-6 text-hebrew-heading">
          {data.title}
        </h1>
      )}

      {/* Lottery Ticket Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-[#f5f0e8] dark:bg-gray-800 rounded-2xl border-4 border-[#5d4e37] dark:border-[#8b7355] shadow-2xl overflow-hidden"
      >
        {/* Top Badge */}
        <div className="bg-[#5d4e37] dark:bg-[#8b7355] py-2 px-4 text-center">
          <span className="text-xs text-yellow-300 tracking-widest text-hebrew-body">
            ✨ גרד כאן ✨
          </span>
        </div>

        {/* Scratch Area */}
        <div
          className="relative min-h-[120px] m-4 rounded-xl overflow-hidden"
          style={{ backgroundColor: primaryColor + '15' }}
        >
          {/* Prize Layer (Behind) */}
          <div className="flex flex-col items-center justify-center p-6 py-8 z-0">
            <p
              className="text-xs mb-2 text-hebrew-body tracking-widest"
              style={{ color: primaryColor }}
            >
              CONGRATULATIONS
            </p>
            <p className="text-2xl md:text-3xl font-bold text-[#5d4e37] dark:text-white text-center text-hebrew-heading leading-relaxed">
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
        <div className="bg-[#5d4e37] dark:bg-[#8b7355] py-3 px-4 flex items-center justify-center gap-3"></div>
      </motion.div>

      {/* Hint Text */}
      <p className="mt-4 text-sm text-gray-400 dark:text-gray-500 text-hebrew-body">
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

      {/* Footer Credit */}
      <FooterBranding className="absolute bottom-4" />
    </div>
  );
}
