"use client";

/**
 * ScratchCardMobile Component
 * Lottery ticket style scratch card for mobile with touch interaction
 * Max 150 lines per project rules
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { ScratchCardProps } from "../types";

interface ExtendedData {
  title?: string;
  prizeContent?: string;
  prize?: { content: string };
}

const getPrizeContent = (data: unknown): string => {
  const d = data as ExtendedData;
  return d.prizeContent || d.prize?.content || "זכית בהפתעה!";
};

const GRID_SIZE = 8;
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;
const REVEAL_THRESHOLD = 0.6;

export function ScratchCardMobile({ data }: ScratchCardProps) {
  const [scratchedBlocks, setScratchedBlocks] = useState<Set<number>>(
    new Set(),
  );
  const [isRevealed, setIsRevealed] = useState(false);

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
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[#fdf6f3] dark:bg-gray-900 px-4 py-5 overflow-auto relative">
      {/* Title */}
      {data.title && (
        <h1 className="text-xl font-bold text-center text-[#5d4e37] dark:text-white mb-4 text-hebrew-heading">
          {data.title}
        </h1>
      )}

      {/* Lottery Ticket Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[320px] bg-[#f5f0e8] dark:bg-gray-800 rounded-2xl border-4 border-[#5d4e37] dark:border-[#8b7355] shadow-xl overflow-hidden"
      >
        {/* Top Badge */}
        <div className="bg-[#5d4e37] dark:bg-[#8b7355] py-2 px-3 text-center">
          <span className="text-[10px] text-yellow-300 tracking-widest text-hebrew-body">
            ✨ גרד כאן ✨
          </span>
        </div>

        {/* Scratch Area */}
        <div className="relative aspect-[4/3] m-3 rounded-xl overflow-hidden bg-white dark:bg-gray-700">
          {/* Prize Layer (Behind) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-0">
            <p className="text-[10px] text-[#d4826f] mb-1 text-hebrew-body tracking-widest">
              CONGRATULATIONS
            </p>
            <p className="text-xl font-bold text-[#5d4e37] dark:text-white text-center text-hebrew-heading leading-relaxed">
              {getPrizeContent(data)}
            </p>
            <span className="text-3xl mt-3">💋</span>
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

        {/* Serial Number Footer */}
        <div className="bg-[#5d4e37] dark:bg-[#8b7355] py-2 px-3 flex items-center justify-center gap-2">
          <span className="text-gray-400 text-sm">☆</span>
          <span className="text-[10px] text-[#d4826f] font-bold tracking-wider">
            {serialNumber}
          </span>
          <span className="text-gray-400 text-sm">☆</span>
        </div>
      </motion.div>

      {/* Hint Text */}
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 text-hebrew-body">
        👆 גררו את הכרטיס עם האצבע
      </p>

      {/* Footer Credit */}
      <p className="absolute bottom-2 text-[10px] text-gray-300 dark:text-gray-600 text-hebrew-body">
        HeartNote Factory © 2024
      </p>
    </div>
  );
}
