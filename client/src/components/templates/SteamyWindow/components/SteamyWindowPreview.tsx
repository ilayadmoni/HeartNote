"use client";

/**
 * SteamyWindowPreview Component
 *
 * Overlays a semi-transparent "steamy" canvas over a 3:4 cropped image
 * and a dedication text. The user wipes the canvas (scratch-off style)
 * to reveal the content underneath.
 *
 * Fixed 3:4 aspect ratio — container uses CSS `aspect-[3/4]`.
 * No dynamic width/height calculations.
 *
 * Layer stack (bottom → top):
 *  1. `<img>`    — cropped photo (object-cover, no z-index)
 *  2. `<div>`    — dedication text (z-10, bottom-right, readable backdrop)
 *  3. `<canvas>` — fog layer (z-20, interactive, destination-out erasing)
 *  4. hint       — pulsing hint (z-30, pointer-events-none, auto-hidden)
 */

import { useRef, useEffect, useCallback, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface SteamyWindowPreviewProps {
  /** Blob URL or remote URL of the cropped image */
  previewUrl: string;
  /** RTL dedication / love-note text */
  dedicationText: string;
  /** Fog colour */
  fogColor?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function SteamyWindowPreview({
  previewUrl,
  dedicationText,
  fogColor = "rgba(255, 255, 255, 0.85)",
}: SteamyWindowPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  /* ── Initialise fog on mount / image change ─────────────────────── */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Wait one frame so the container has CSS-computed dimensions
    const raf = requestAnimationFrame(() => {
      const { width: w, height: h } = container.getBoundingClientRect();
      if (w === 0 || h === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      // Fill with fog
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = fogColor;
      ctx.fillRect(0, 0, w, h);

      // Condensation droplets for realism
      const count = Math.round((w * h) / 3200);
      for (let i = 0; i < count; i++) {
        const dx = Math.random() * w;
        const dy = Math.random() * h;
        const dr = 1 + Math.random() * 3;
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();
      }

      setHasInteracted(false);
    });

    return () => cancelAnimationFrame(raf);
  }, [fogColor, previewUrl]);

  /* ── Erase (wipe) a circular area ───────────────────────────────── */
  const erase = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, []);

  /* ── Pointer helpers ────────────────────────────────────────────── */
  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
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
  };

  /* ── Touch helpers (older mobile browsers) ──────────────────────── */
  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!hasInteracted) setHasInteracted(true);
    isDrawing.current = true;
    const { x, y } = getTouchPos(e);
    erase(x, y);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const { x, y } = getTouchPos(e);
    erase(x, y);
  };

  const onTouchEnd = () => {
    isDrawing.current = false;
  };

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="aspect-[3/4] w-full max-w-sm mx-auto relative rounded-2xl overflow-hidden shadow-xl select-none"
    >
      {/* Layer 1 – Image (fills container) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Layer 2 – Dedication text (z-10, bottom-right with readable backdrop) */}
      {dedicationText && (
        <div className="absolute bottom-4 right-4 max-w-[80%] z-10 pointer-events-none">
          <p
            className="bg-black/40 backdrop-blur-md text-white p-2 rounded-lg font-bold text-lg text-right whitespace-pre-wrap text-hebrew-body"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
          >
            {dedicationText}
          </p>
        </div>
      )}

      {/* Layer 3 – Fog canvas (z-20, interactive scratch layer) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-20 cursor-pointer"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* Layer 4 – Hint (z-30, auto-hidden after first interaction) */}
      {!hasInteracted && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none animate-pulse">
          <span className="text-3xl mb-2">🫧</span>
          <p className="text-sm font-medium text-gray-700/80 text-hebrew-body">
            העבירו את האצבע כדי לגלות
          </p>
        </div>
      )}
    </div>
  );
}
