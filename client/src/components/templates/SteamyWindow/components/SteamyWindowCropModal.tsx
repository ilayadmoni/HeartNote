"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import {
  STEAMY_WINDOW_CROP_WIDTH,
  STEAMY_WINDOW_CROP_HEIGHT,
  STEAMY_WINDOW_ASPECT_RATIO,
} from "../constants";

const OUT_W = STEAMY_WINDOW_CROP_WIDTH;
const OUT_H = STEAMY_WINDOW_CROP_HEIGHT;
const ASPECT = STEAMY_WINDOW_ASPECT_RATIO;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;

interface SteamyWindowCropModalProps {
  imageSrc: string;
  onCropDone: (croppedBlobUrl: string) => void;
  onCancel: () => void;
}

export function SteamyWindowCropModal({
  imageSrc,
  onCropDone,
  onCancel,
}: SteamyWindowCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const stateRef = useRef({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    minScale: 1,
  });
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startOX: 0,
    startOY: 0,
  });
  const pinchRef = useRef({ active: false, startDist: 0, startScale: 0 });
  const frameRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useLockBodyScroll(true);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x: fx, y: fy, w: fw, h: fh } = frameRef.current;
    const { offsetX, offsetY, scale, minScale } = stateRef.current;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cw, ch);

    const s = minScale * scale;
    const iw = img.naturalWidth * s;
    const ih = img.naturalHeight * s;

    const imgX = fx + fw / 2 - iw / 2 + offsetX;
    const imgY = fy + fh / 2 - ih / 2 + offsetY;

    ctx.globalAlpha = 0.2;
    ctx.drawImage(img, imgX, imgY, iw, ih);
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.beginPath();
    ctx.rect(fx, fy, fw, fh);
    ctx.clip();
    ctx.drawImage(img, imgX, imgY, iw, ih);
    ctx.restore();

    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(fx, fy, fw, fh);

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(fx + (fw / 3) * i, fy);
      ctx.lineTo(fx + (fw / 3) * i, fy + fh);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(fx, fy + (fh / 3) * i);
      ctx.lineTo(fx + fw, fy + (fh / 3) * i);
      ctx.stroke();
    }

    const hLen = 20;
    const hW = 3;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = hW;
    const corners = [
      [fx, fy, 1, 1],
      [fx + fw, fy, -1, 1],
      [fx, fy + fh, 1, -1],
      [fx + fw, fy + fh, -1, -1],
    ] as const;
    corners.forEach(([cx2, cy2, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx2, cy2);
      ctx.lineTo(cx2 + dx * hLen, cy2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx2, cy2);
      ctx.lineTo(cx2, cy2 + dy * hLen);
      ctx.stroke();
    });

    ctx.restore();
  }, []);

  const clampOffset = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const { w: fw, h: fh } = frameRef.current;
    const { scale, minScale } = stateRef.current;
    const s = minScale * scale;
    const iw = img.naturalWidth * s;
    const ih = img.naturalHeight * s;

    const maxOX = Math.max(0, (iw - fw) / 2);
    const maxOY = Math.max(0, (ih - fh) / 2);
    stateRef.current.offsetX = Math.max(-maxOX, Math.min(maxOX, stateRef.current.offsetX));
    stateRef.current.offsetY = Math.max(-maxOY, Math.min(maxOY, stateRef.current.offsetY));
  }, []);

  const applyZoom = useCallback(
    (nextScale: number) => {
      stateRef.current.scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextScale));
      setZoomLevel(stateRef.current.scale);
      clampOffset();
      draw();
    },
    [clampOffset, draw],
  );

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;

      const dpr = window.devicePixelRatio || 1;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;

      const padding = 0.88;
      let fw = cw * padding;
      let fh = fw / ASPECT;
      if (fh > ch * padding) {
        fh = ch * padding;
        fw = fh * ASPECT;
      }
      frameRef.current = {
        x: (cw - fw) / 2,
        y: (ch - fh) / 2,
        w: fw,
        h: fh,
      };

      const scaleX = fw / img.naturalWidth;
      const scaleY = fh / img.naturalHeight;
      stateRef.current.minScale = Math.max(scaleX, scaleY);
      stateRef.current.scale = 1;
      stateRef.current.offsetX = 0;
      stateRef.current.offsetY = 0;
      setZoomLevel(1);

      setIsReady(true);
      draw();
    };
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
  }, [imageSrc, draw]);

  useEffect(() => {
    if (isReady) draw();
  }, [isReady, draw]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "touch") return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startOX: stateRef.current.offsetX,
      startOY: stateRef.current.offsetY,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!dragRef.current.active) return;
      stateRef.current.offsetX = dragRef.current.startOX + (e.clientX - dragRef.current.startX);
      stateRef.current.offsetY = dragRef.current.startOY + (e.clientY - dragRef.current.startY);
      clampOffset();
      draw();
    },
    [clampOffset, draw],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      applyZoom(stateRef.current.scale * delta);
    },
    [applyZoom],
  );

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      dragRef.current = {
        active: true,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        startOX: stateRef.current.offsetX,
        startOY: stateRef.current.offsetY,
      };
    } else if (e.touches.length === 2) {
      dragRef.current.active = false;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      pinchRef.current = {
        active: true,
        startDist: dist,
        startScale: stateRef.current.scale,
      };
    }
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (e.touches.length === 1 && dragRef.current.active) {
        stateRef.current.offsetX =
          dragRef.current.startOX + (e.touches[0].clientX - dragRef.current.startX);
        stateRef.current.offsetY =
          dragRef.current.startOY + (e.touches[0].clientY - dragRef.current.startY);
        clampOffset();
        draw();
      } else if (e.touches.length === 2 && pinchRef.current.active) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const newScale = pinchRef.current.startScale * (dist / pinchRef.current.startDist);
        applyZoom(newScale);
      }
    },
    [applyZoom, clampOffset, draw],
  );

  const onTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length < 2) pinchRef.current.active = false;
    if (e.touches.length === 0) dragRef.current.active = false;
  }, []);

  const handleApply = useCallback(async () => {
    const img = imgRef.current;
    if (!img) return;
    setIsProcessing(true);

    try {
      const { x: fx, y: fy, w: fw, h: fh } = frameRef.current;
      const { offsetX, offsetY, scale, minScale } = stateRef.current;
      const s = minScale * scale;
      const iw = img.naturalWidth * s;
      const ih = img.naturalHeight * s;
      const imgX = fx + fw / 2 - iw / 2 + offsetX;
      const imgY = fy + fh / 2 - ih / 2 + offsetY;

      const srcX = (fx - imgX) / s;
      const srcY = (fy - imgY) / s;
      const srcW = fw / s;
      const srcH = fh / s;

      const output = document.createElement("canvas");
      output.width = OUT_W;
      output.height = OUT_H;
      const ctx = output.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUT_W, OUT_H);

      const url = await new Promise<string>((resolve, reject) => {
        output.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("toBlob failed"));
              return;
            }
            resolve(URL.createObjectURL(blob));
          },
          "image/jpeg",
          0.92,
        );
      });

      onCropDone(url);
    } catch {
      /* silent */
    } finally {
      setIsProcessing(false);
    }
  }, [onCropDone]);

  const handleZoomOut = useCallback(() => {
    applyZoom(stateRef.current.scale - ZOOM_STEP);
  }, [applyZoom]);

  const handleZoomIn = useCallback(() => {
    applyZoom(stateRef.current.scale + ZOOM_STEP);
  }, [applyZoom]);

  const handleResetView = useCallback(() => {
    stateRef.current.offsetX = 0;
    stateRef.current.offsetY = 0;
    applyZoom(MIN_ZOOM);
  }, [applyZoom]);

  return (
    <div
      className="fixed inset-0 z-[9999] w-full h-full bg-black flex flex-col touch-none overscroll-none pointer-events-auto"
      style={{ height: "100dvh", width: "100vw" }}
      role="dialog"
      aria-modal="true"
      aria-label="חיתוך תמונה"
    >
      {/* ── Canvas area — clean, no overlays ── */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden touch-none overscroll-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      </div>

      {/* ── Footer ── */}
      <div
        className="flex-shrink-0 bg-black border-t border-white/10"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        {/* Zoom row */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={!isReady}
            aria-label="הקטן"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xl transition-colors flex-shrink-0"
          >
            −
          </button>

          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoomLevel}
            onChange={(e) => applyZoom(Number(e.target.value))}
            disabled={!isReady}
            className="flex-1 accent-[#c77d67] disabled:opacity-30"
          />

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={!isReady}
            aria-label="הגדל"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xl transition-colors flex-shrink-0"
          >
            +
          </button>

          <span className="w-10 text-xs text-center text-white/50 tabular-nums flex-shrink-0">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Action buttons row */}
        <div className="flex items-center justify-between px-5 pt-1 pb-1">
          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            aria-label="ביטול"
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Reset — center */}
          <button
            type="button"
            onClick={handleResetView}
            disabled={!isReady}
            className="text-sm text-white/50 hover:text-white/80 disabled:opacity-30 transition-colors px-4 py-2"
          >
            איפוס
          </button>

          {/* Confirm */}
          <button
            type="button"
            onClick={handleApply}
            disabled={!isReady || isProcessing}
            aria-label="אישור"
            className="w-12 h-12 rounded-full flex items-center justify-center bg-[#c77d67] hover:bg-[#b56a55] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5"
                   strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
