"use client";

/**
 * WheelCanvas Component
 * Draws the spinning wheel using HTML Canvas.
 * Accepts options + colors from parent and handles spin animation via framer-motion.
 */

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import confetti from "canvas-confetti";

/* ── palette ─────────────────────────────────────────────── */
const SEGMENT_COLORS = [
  "#F8BBD0", // pink
  "#B5EAD7", // mint
  "#C7CEEA", // periwinkle
  "#FFD6A5", // peach
  "#FDFFB6", // lemon
  "#A0C4FF", // baby-blue
  "#BDB2FF", // lavender
  "#FFC6FF", // mauve
];

interface WheelCanvasProps {
  /** Text labels for each segment — 2-8 items */
  options: string[];
  /** Diameter in px */
  size: number;
  /** Called with the winning text when spin ends */
  onResult?: (winner: string) => void;
  /** Accent color for center button */
  primaryColor?: string;
}

/**
 * Calculate slice geometry for text placement.
 * Returns the available width at different radii within the slice.
 */
function getSliceGeometry(
  segCount: number,
  radius: number,
  wheelSize: number
): {
  labelRadius: number;
  maxWidth: number;
  maxHeight: number;
  baseFontSize: number;
} {
  const segAngleRad = (2 * Math.PI) / segCount;
  
  // Position label at ~55% of radius for better centering with multi-line
  const labelRadius = radius * 0.55;
  
  // Calculate the chord length at the label position
  // This is the max width available for text within the slice
  const chordLength = 2 * labelRadius * Math.sin(segAngleRad / 2);
  
  // Use 80% of chord length as max text width
  const maxWidth = chordLength * 0.8;
  
  // Max height is the radial depth available for text
  // From ~35% to ~75% of radius (avoiding center button and edge)
  const maxHeight = radius * 0.4;
  
  // Base font size scales with wheel size and inversely with number of slices
  // Formula: baseFontSize = (wheelSize / 18) * (8 / segCount)^0.35
  const sliceScaleFactor = Math.pow(8 / segCount, 0.35);
  const baseFontSize = (wheelSize / 18) * sliceScaleFactor;
  
  return { labelRadius, maxWidth, maxHeight, baseFontSize };
}

/**
 * Wrap text into multiple lines that fit within maxWidth.
 * Uses word-breaking for long words and natural word wrapping otherwise.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number
): string[] {
  ctx.font = `bold ${fontSize}px "Open Sans", sans-serif`;
  
  // If text fits on one line, return it
  if (ctx.measureText(text).width <= maxWidth) {
    return [text];
  }
  
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;
    
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      // If current line has content, push it
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // Check if the word itself is too long and needs breaking
      if (ctx.measureText(word).width > maxWidth) {
        // Break the word character by character
        let partialWord = "";
        for (const char of word) {
          const testPartial = partialWord + char;
          if (ctx.measureText(testPartial).width <= maxWidth) {
            partialWord = testPartial;
          } else {
            if (partialWord) lines.push(partialWord);
            partialWord = char;
          }
        }
        currentLine = partialWord;
      } else {
        currentLine = word;
      }
    }
  }
  
  // Push the last line
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Calculate the optimal font size and wrapped lines for a label.
 * Balances font size with number of lines to maximize readability.
 */
function calculateWrappedText(
  ctx: CanvasRenderingContext2D,
  label: string,
  segCount: number,
  radius: number,
  wheelSize: number
): { fontSize: number; lines: string[]; labelRadius: number; lineHeight: number } {
  const { labelRadius, maxWidth, maxHeight, baseFontSize } = getSliceGeometry(
    segCount,
    radius,
    wheelSize
  );
  
  // Clamp base font size
  let fontSize = Math.min(Math.max(baseFontSize, 9), wheelSize / 9);
  const minFontSize = 8;
  const maxLines = segCount >= 7 ? 3 : 2; // Allow more lines for narrow slices
  
  let lines = wrapText(ctx, label, maxWidth, fontSize);
  let lineHeight = fontSize * 1.15;
  
  // Reduce font size if we have too many lines or text doesn't fit vertically
  while (
    (lines.length > maxLines || lines.length * lineHeight > maxHeight) &&
    fontSize > minFontSize
  ) {
    fontSize -= 0.5;
    lineHeight = fontSize * 1.15;
    lines = wrapText(ctx, label, maxWidth, fontSize);
  }
  
  // If still too many lines, truncate with ellipsis
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const lastLine = lines[maxLines - 1];
    if (lastLine.length > 3) {
      lines[maxLines - 1] = lastLine.slice(0, -3) + "...";
    }
  }
  
  return { fontSize, lines, labelRadius, lineHeight };
}

/**
 * Draw multi-line text centered at (0, 0) in the current transform.
 */
function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  fontSize: number,
  lineHeight: number
): void {
  ctx.font = `bold ${fontSize}px "Open Sans", sans-serif`;
  ctx.fillStyle = "#2e3c52";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Calculate total text block height
  const totalHeight = lines.length * lineHeight;
  
  // Start Y position to center the block vertically
  const startY = -totalHeight / 2 + lineHeight / 2;
  
  // Draw each line
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    ctx.fillText(line, 0, y);
  });
}

export function WheelCanvas({
  options,
  size,
  onResult,
  primaryColor = "#d4826f",
}: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotation = useMotionValue(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const segCount = options.length || 1;
  const segAngle = 360 / segCount;

  /* ── draw static wheel ──────────────────────────────────── */
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number) => {
      const cx = w / 2;
      const cy = w / 2;
      const r = w / 2 - 4;

      ctx.clearRect(0, 0, w, w);

      for (let i = 0; i < segCount; i++) {
        const startAngle = ((i * segAngle - 90) * Math.PI) / 180;
        const endAngle = (((i + 1) * segAngle - 90) * Math.PI) / 180;

        // segment fill
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
        ctx.fill();

        // border
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // label with dynamic font sizing and multi-line wrapping
        const label = options[i] || "";
        const midAngle = (startAngle + endAngle) / 2;
        
        // Calculate wrapped text with dynamic font size
        const { fontSize, lines, labelRadius, lineHeight } = calculateWrappedText(
          ctx,
          label,
          segCount,
          r,
          w
        );
        
        // Position label at calculated radius
        const lx = cx + Math.cos(midAngle) * labelRadius;
        const ly = cy + Math.sin(midAngle) * labelRadius;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(midAngle + Math.PI / 2);
        
        // Draw multi-line wrapped text
        drawWrappedText(ctx, lines, fontSize, lineHeight);
        
        ctx.restore();
      }
    },
    [segCount, segAngle, options],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    draw(ctx, size);
  }, [draw, size]);

  /* ── spin logic ─────────────────────────────────────────── */
  const handleSpin = useCallback(() => {
    if (spinning || segCount < 2) return;
    setSpinning(true);
    setWinner(null);

    const targetSegment = Math.floor(Math.random() * segCount);

    // Calculate the absolute angle where target segment center aligns with pointer (top).
    // Segment i center is at (i * segAngle + segAngle / 2) degrees from top (0°).
    // The wheel must rotate so that this center aligns with the pointer.
    const segmentCenterOffset = targetSegment * segAngle + segAngle / 2;
    // We want (finalAngle mod 360) == (360 - segmentCenterOffset) so segment aligns at top
    const desiredMod = (360 - segmentCenterOffset + 360) % 360;

    const start = rotation.get();
    const currentMod = ((start % 360) + 360) % 360;
    // How much more we need to rotate past full rotations to land on desired position
    let delta = desiredMod - currentMod;
    if (delta < 0) delta += 360;

    // Add 5-8 full rotations for visual effect
    const extraRotations = 5 + Math.random() * 3;
    const targetAngle = 360 * Math.floor(extraRotations) + delta;

    animate(rotation, start + targetAngle, {
      duration: 4,
      ease: [0.15, 0.85, 0.25, 1], // custom ease-out
      onComplete: () => {
        const winnerText = options[targetSegment];
        setWinner(winnerText);
        setSpinning(false);
        onResult?.(winnerText);

        // confetti burst 🎉
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
          colors: SEGMENT_COLORS.slice(0, 4),
        });
      },
    });
  }, [spinning, segCount, segAngle, rotation, options, onResult]);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Pointer triangle */}
      <div className="relative">
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
          style={{
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: `20px solid ${primaryColor}`,
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
          }}
        />

        {/* Wheel */}
        <motion.div
          style={{ rotate: rotation, width: size, height: size }}
          className="rounded-full shadow-xl"
        >
          <canvas
            ref={canvasRef}
            style={{ width: size, height: size }}
            className="rounded-full"
          />
        </motion.div>

        {/* Center spin button */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-70 text-hebrew-heading z-10"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            fontSize: Math.max(12, size * 0.048),
            backgroundColor: primaryColor,
          }}
        >
          {spinning ? "🎯" : "סובב!"}
        </button>
      </div>

      {/* Result */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 text-hebrew-body">
            התוצאה שלך:
          </p>
          <p
            className="text-2xl font-black text-hebrew-heading"
            style={{ color: primaryColor }}
          >
            {winner}
          </p>
        </motion.div>
      )}
    </div>
  );
}
