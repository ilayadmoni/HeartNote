"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/utils/image-utils";

interface ImageCropperModalProps {
  imageSrc: string;
  aspect: number;
  onCropDone: (croppedUrl: string) => void;
  onCancel: () => void;
}

export function ImageCropperModal({
  imageSrc,
  aspect,
  onCropDone,
  onCancel,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = useCallback(async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const url = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(url);
    } catch {
      /* canvas/blob failure — silent */
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, croppedAreaPixels, onCropDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="חיתוך תמונה"
    >
      {/* Cropper area */}
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-center gap-8 py-6 bg-black">
        <button
          type="button"
          onClick={onCancel}
          aria-label="ביטול"
          autoFocus
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5"
               strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={handleApply}
          disabled={!croppedAreaPixels?.width}
          aria-label="אישור"
          className="w-14 h-14 rounded-full flex items-center justify-center bg-[#c77d67] hover:bg-[#b56a55] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
