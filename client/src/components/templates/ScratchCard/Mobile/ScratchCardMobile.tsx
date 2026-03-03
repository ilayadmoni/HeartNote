"use client";

/**
 * ScratchCardMobile Component
 * Lottery ticket style scratch card for mobile with touch interaction
 * Max 150 lines per project rules
 */

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";
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

const GRID_SIZE = 8;
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;
const REVEAL_THRESHOLD = 0.6;

export function ScratchCardMobile({ data }: ScratchCardProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');
  const [scratchedBlocks, setScratchedBlocks] = useState<Set<number>>(
    new Set(),
  );
  const [isRevealed, setIsRevealed] = useState(false);
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

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

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-transparent px-4 py-5 overflow-auto relative isolate ${
      isCreateRoute ? 'min-h-[400px]' : 'min-h-[650px]'
    }`}>
      <FloatingIcons />
      <BackToGallery className="mb-3" />

      {/* Title */}
      {data.title && (
        <h1 className="text-xl font-bold text-center text-[#5d4e37] dark:text-white mb-4 text-hebrew-heading break-words max-w-[280px]">
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
          backgroundColor: colorLight,
          borderColor: colorDark,
        }}
      >
        {/* Top Badge */}
        <div
          className="py-2 px-3 text-center"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="text-[10px] text-white tracking-widest text-hebrew-body">
            ✨ גרד כאן ✨
          </span>
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
              style={{ color: colorDark }}
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
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 text-hebrew-body">
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
          className="mt-3 w-9 h-9 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-gray-500 hover:text-[#d4826f] transition-colors"
          aria-label="שחק מחדש"
        >
          <RotateCcw size={16} />
        </motion.button>
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
