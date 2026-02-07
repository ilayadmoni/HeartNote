"use client";

/**
 * ScratchCard Component
 * Interactive scratch-to-reveal card with grid-based scratching
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps, ScratchCardData } from "./types";

export function ScratchCard({ data }: TemplateComponentProps<ScratchCardData>) {
  const totalBlocks = data.gridSize.cols * data.gridSize.rows;
  const [scratchedBlocks, setScratchedBlocks] = useState<Set<number>>(
    new Set(),
  );
  const [isRevealed, setIsRevealed] = useState(false);

  const scratchedPercentage = (scratchedBlocks.size / totalBlocks) * 100;

  const handleScratch = useCallback(
    (index: number) => {
      setScratchedBlocks((prev) => {
        const newSet = new Set(prev);
        newSet.add(index);

        // Auto-reveal if more than 60% scratched
        if (newSet.size / totalBlocks > 0.6) {
          setIsRevealed(true);
        }
        return newSet;
      });
    },
    [totalBlocks],
  );

  const handleRevealAll = useCallback(() => {
    setIsRevealed(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf7f5] dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Title */}
        {data.title && (
          <h2 className="text-xl md:text-2xl font-bold text-center text-[#2e3c52] dark:text-white mb-4 text-hebrew-heading">
            {data.title}
          </h2>
        )}

        {/* Scratch Card Container */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Prize Layer (Behind) */}
          <div className="aspect-[4/3] flex items-center justify-center p-8">
            {data.prize.type === "text" ? (
              <p className="text-2xl md:text-3xl font-bold text-[#d4826f] text-center text-hebrew-heading">
                {data.prize.content}
              </p>
            ) : (
              <img
                src={data.prize.content}
                alt="פרס"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
          </div>

          {/* Scratch Layer (On Top) */}
          {!isRevealed && (
            <div
              className="absolute inset-0 grid cursor-crosshair"
              style={{
                gridTemplateColumns: `repeat(${data.gridSize.cols}, 1fr)`,
                gridTemplateRows: `repeat(${data.gridSize.rows}, 1fr)`,
              }}
            >
              {Array.from({ length: totalBlocks }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: scratchedBlocks.has(index) ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  onHoverStart={() => handleScratch(index)}
                  onTouchStart={() => handleScratch(index)}
                  className="border border-gray-300/30"
                  style={{ backgroundColor: data.scratchColor || "#c0c0c0" }}
                />
              ))}
            </div>
          )}

          {/* Sparkle effect on reveal */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 to-transparent pointer-events-none"
            />
          )}
        </div>

        {/* Progress / Hint */}
        <div className="mt-4 text-center">
          {!isRevealed ? (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body mb-2">
                גרד כדי לחשוף • {Math.round(scratchedPercentage)}%
              </p>
              <button
                onClick={handleRevealAll}
                className="text-sm text-[#d4826f] hover:underline text-hebrew-body"
              >
                חשוף הכל
              </button>
            </>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-[#d4826f] font-bold text-hebrew-heading"
            >
              🎉 מזל טוב!
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
