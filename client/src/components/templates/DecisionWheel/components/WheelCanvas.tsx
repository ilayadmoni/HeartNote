"use client";

/**
 * WheelCanvas Component
 * Draws the spinning wheel using HTML Canvas.
 * Accepts options + colors from parent and handles spin animation via framer-motion.
 */

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useAnimation, useMotionValue, animate } from "framer-motion";
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

export function WheelCanvas({
  options,
  size,
  onResult,
  primaryColor = "#d4826f",
}: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotation = useMotionValue(0);
  const controls = useAnimation();
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

        // label
        const midAngle = (startAngle + endAngle) / 2;
        const labelR = r * 0.62;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(midAngle + Math.PI / 2);
        ctx.fillStyle = "#2e3c52";
        
        // Dynamic font sizing based on text width
        const label = options[i] || "";
        const maxWidth = r * 0.3; // max width available in slice
        let fontSize = Math.max(11, Math.floor(w / 22));
        
        // Measure text and shrink if needed
        ctx.font = `bold ${fontSize}px sans-serif`;
        let textWidth = ctx.measureText(label).width;
        
        // If text is too wide, reduce font size until it fits
        while (textWidth > maxWidth && fontSize > 8) {
          fontSize -= 1;
          ctx.font = `bold ${fontSize}px sans-serif`;
          textWidth = ctx.measureText(label).width;
        }
        
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, 0, 0);
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
