"use client";

import { useRef, useEffect } from "react";
import { motion, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useWheelAnimation } from "./useWheelAnimation";
import { drawWheel } from "./wheelDrawing";

interface WheelCanvasProps {
  /** Text labels for each segment — 2-8 items */
  options: string[];
  /** Diameter in px */
  size: number;
  /** Called with the winning text when spin ends */
  onResult?: (winner: string) => void;
  /** Accent color for center button */
  primaryColor?: string;
  /** Optional "no take-backs" style subtitle rendered near the wheel */
  noTakeBacksText?: string;
}

export function WheelCanvas({
  options,
  size,
  onResult,
  primaryColor = "#d4826f",
  noTakeBacksText,
}: WheelCanvasProps) {
  const t = useTranslations("templates");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const { rotation, spinning, winner, handleSpin } = useWheelAnimation({
    options,
    onResult,
  });

  const segAngle = 360 / (options.length || 1);
  const pointerTilt = useTransform(rotation, (value) => {
    const mod = ((value % segAngle) + segAngle) % segAngle;
    const progress = mod / segAngle;
    return Math.sin(progress * Math.PI * 2) * 6;
  });

  useEffect(() => {
    if (!winner) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [winner]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    drawWheel(ctx, size, options);
  }, [size, options]);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Pointer triangle */}
      <div className="relative">
        <motion.div
          className="absolute -top-3 left-1/2 z-10"
          style={{
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: `20px solid ${primaryColor}`,
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
            x: "-50%",
            rotate: pointerTilt,
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
            aria-label={t("decisionWheel.canvasLabel", { count: options.length, options: options.join(", ") })}
            role="img"
          />
        </motion.div>

        {/* Center spin button */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full font-bold text-accent-ink shadow-lg transition-transform active:scale-95 disabled:opacity-70 z-10"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            fontSize: Math.max(12, size * 0.048),
            backgroundColor: primaryColor,
          }}
        >
          {spinning ? (
            <span className="flex items-center justify-center gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block rounded-full bg-accent-ink"
                  style={{ width: Math.max(3, size * 0.014), height: Math.max(3, size * 0.014) }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </span>
          ) : (
            t("decisionWheel.spin")
          )}
        </button>
      </div>

      {/* Optional "no take-backs" subtitle */}
      {noTakeBacksText && (
        <p className="text-xs text-ink-muted text-center" dir="auto">
          {noTakeBacksText}
        </p>
      )}

      {/* Result */}
      {winner && (
        <motion.div
          ref={resultRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center rounded-card border border-line bg-surface shadow-card px-6 py-4"
        >
          <p className="text-sm text-ink-muted mb-1">{t("decisionWheel.resultLabel")}</p>
          <p className="text-title-lg font-black" style={{ color: primaryColor }} dir="auto">
            {winner}
          </p>
        </motion.div>
      )}
    </div>
  );
}
