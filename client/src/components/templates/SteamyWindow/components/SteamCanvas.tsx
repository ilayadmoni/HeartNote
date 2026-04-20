"use client";

/**
 * SteamCanvas Component
 *
 * Simulates a steamy/foggy window that the user wipes to reveal
 * the hidden message underneath.
 *
 * Works via two stacked layers:
 *  1. Background layer — shows the revealed message / emoji
 *  2. Canvas overlay   — filled with a translucent fog;
 *     pointer events erase the fog (scratch-to-reveal)
 */

import { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { TemplateResetButton } from "@/components/templates/components";

interface SteamCanvasProps {
  /** Width in px */
  width: number;
  /** Height in px */
  height: number;
  /** The message to reveal */
  revealMessage: string;
  /** Fog color (rgba) */
  fogColor?: string;
  /** Accent color */
  primaryColor?: string;
  /** Optional background image URL from Supabase Storage */
  backgroundImage?: string;
  /** Threshold (0-1) of erased area to auto-reveal */
  revealThreshold?: number;
}

export function SteamCanvas({
  width,
  height,
  revealMessage,
  fogColor = "rgba(200, 210, 220, 0.92)",
  primaryColor = "#d4826f",
  backgroundImage,
  revealThreshold = 0.45,
}: SteamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isDrawing = useRef(false);

  /* ── draw initial fog ──────────────────────────────────── */
  const initFog = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = fogColor;
      ctx.fillRect(0, 0, w, h);

      // Fake condensation droplets
      for (let i = 0; i < 60; i++) {
        const dx = Math.random() * w;
        const dy = Math.random() * h;
        const dr = 1 + Math.random() * 3;
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fill();
      }
    },
    [fogColor],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    initFog(ctx, width, height);
  }, [width, height, initFog]);

  /* ── erase (scratch) logic ──────────────────────────────── */
  const erase = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas || revealed) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
    [revealed],
  );

  const checkReveal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) transparent++;
    }
    const ratio = transparent / (imgData.data.length / 4);

    if (ratio >= revealThreshold) {
      setRevealed(true);
      // Clear remaining fog
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.55 },
        colors: ["#F8BBD0", "#B5EAD7", "#C7CEEA", "#FFD6A5"],
      });
    }
  }, [revealed, revealThreshold]);

  /* ── pointer handlers ───────────────────────────────────── */
  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!hasInteracted) setHasInteracted(true);
    isDrawing.current = true;
    const { x, y } = getPos(e);
    erase(x, y);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const { x, y } = getPos(e);
    erase(x, y);
  };

  const onPointerUp = () => {
    isDrawing.current = false;
    checkReveal();
  };

  const handleReset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    setRevealed(false);
    setHasInteracted(false);
    isDrawing.current = false;
    initFog(ctx, width, height);
  }, [height, initFog, width]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xl select-none"
      style={{ width, height }}
    >
      {/* Revealed content background (Layer 1 - Bottom) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-6 z-0">
        {/* Optional background image */}
        {backgroundImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}

        {/* Main visible text that is ALWAYS hidden by fog initially */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 0.15 }}
          className="relative text-2xl font-bold text-center whitespace-pre-wrap text-hebrew-heading z-10"
          style={{ color: primaryColor }}
        >
          {revealMessage}
        </motion.p>
      </div>

      {/* Dedication Text Overlay (Layer 2 - Middle) 
          Using z-10 to stay above background but below canvas (z-20) 
      */}
      {revealMessage && (
        <div className="absolute bottom-4 right-4 z-10 max-w-[80%] pointer-events-none">
          <div className="bg-[#2e3c52]/90 backdrop-blur-md text-white px-3 py-2 rounded-lg shadow-lg border border-white/10">
            <p className="text-sm sm:text-base font-normal leading-relaxed text-right dir-rtl">
              {revealMessage}
            </p>
          </div>
        </div>
      )}

      {/* Fog overlay canvas (Layer 3 - Top) */}
      <canvas
        ref={canvasRef}
        style={{ width, height, touchAction: "none" }}
        className="absolute inset-0 cursor-pointer z-20"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />

      {/* Hint text on fog */}
      {!hasInteracted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          // z-30 to stay above the canvas so user sees it clearly
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
        >
          <span className="text-3xl mb-2">🫧</span>
          <p className="text-sm font-medium text-[#2e3c52]/70 text-hebrew-body">
            העבירו את האצבע כדי לגלות
          </p>
        </motion.div>
      )}

      {revealed && (
        <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
          <TemplateResetButton onClick={handleReset} label="גלה שוב" />
        </div>
      )}
    </div>
  );
}
