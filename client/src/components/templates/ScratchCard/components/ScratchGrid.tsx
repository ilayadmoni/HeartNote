"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ScratchGridProps {
  primaryColor: string;
  cardTextColor: string;
  prizeContent: string;
  scratchedBlocks: Set<number>;
  isRevealed: boolean;
  gridSize: number;
  totalBlocks: number;
  onScratch: (index: number) => void;
  mode?: "hover" | "touch";
  compact?: boolean;
}

/** Prize layer plus the interactive scratch-off overlay grid. */
export function ScratchGrid({
  primaryColor,
  cardTextColor,
  prizeContent,
  scratchedBlocks,
  isRevealed,
  gridSize,
  totalBlocks,
  onScratch,
  mode = "hover",
  compact = false,
}: ScratchGridProps) {
  const t = useTranslations("templates");

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const idx = element?.getAttribute("data-index");
    if (idx) onScratch(parseInt(idx, 10));
  }

  return (
    <div
      className={`relative overflow-hidden ${
        compact ? "min-h-[180px] m-3 rounded-control" : "min-h-[120px] 2xl:min-h-[180px] m-4 2xl:m-6 rounded-control 2xl:rounded-card"
      }`}
      style={{ backgroundColor: primaryColor + "15" }}
    >
      <div
        className={`flex flex-col items-center justify-center z-0 ${
          compact ? "absolute inset-0 p-4" : "p-6 py-8 2xl:p-10 2xl:py-12"
        }`}
      >
        <p
          className={`${compact ? "text-[10px] mb-1" : "text-xs 2xl:text-sm mb-2 2xl:mb-3"} tracking-widest`}
          style={{ color: primaryColor }}
          dir="ltr"
        >
          {t("scratchCard.congratulations")}
        </p>
        <p
          className={`${compact ? "text-base max-w-[240px]" : "text-xl md:text-2xl 2xl:text-display-md max-w-[300px] 2xl:max-w-[520px]"} font-bold text-center leading-relaxed break-words`}
          style={{ color: cardTextColor }}
          dir="auto"
        >
          {prizeContent}
        </p>
      </div>

      {!isRevealed && (
        <div
          className={`absolute inset-0 grid z-10 ${mode === "touch" ? "touch-none" : ""}`}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            cursor: mode === "hover" ? "grab" : undefined,
          }}
        >
          {Array.from({ length: totalBlocks }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 1 }}
              animate={{ opacity: scratchedBlocks.has(index) ? 0 : 1 }}
              transition={{ duration: mode === "touch" ? 0.15 : 0.2 }}
              onMouseEnter={mode === "hover" ? () => onScratch(index) : undefined}
              onTouchStart={mode === "touch" ? () => onScratch(index) : undefined}
              onTouchMove={mode === "touch" ? handleTouchMove : undefined}
              data-index={index}
              className="bg-gradient-to-br from-line-strong via-line to-line-strong border border-line/30"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1d5db 0%, #e5e7eb 50%, #9ca3af 100%)",
              }}
            />
          ))}
        </div>
      )}

      {isRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-br from-yellow-200/60 to-transparent pointer-events-none z-20"
        />
      )}
    </div>
  );
}
