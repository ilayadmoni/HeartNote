"use client";

/**
 * TemplatePreview Component
 * Visual previews for different template types
 * Shared between home page and gallery
 */

import { Heart } from "lucide-react";

export type PreviewType = "viral" | "scratch" | "timeline" | "coupons";

interface TemplatePreviewProps {
  type: PreviewType;
}

export function TemplatePreview({ type }: TemplatePreviewProps) {
  switch (type) {
    case "viral":
      return <ViralPreview />;
    case "scratch":
      return <ScratchPreview />;
    case "timeline":
      return <TimelinePreview />;
    case "coupons":
      return <CouponsPreview />;
    default:
      return null;
  }
}

function ViralPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-600 p-3 rounded-xl shadow-sm text-center">
        <p className="text-xs font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
          רוצה להיות?
        </p>
        <div className="flex gap-2 justify-center">
          <div className="h-6 w-10 bg-green-500 rounded-md flex items-center justify-center text-[8px] text-white">
            כן!
          </div>
          <div className="h-6 w-10 bg-gray-300 rounded-md flex items-center justify-center text-[8px] text-gray-500 opacity-50 transform translate-x-1">
            לא
          </div>
        </div>
      </div>
    </div>
  );
}

function ScratchPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full h-20 rounded-lg bg-gray-100 dark:bg-gray-600 overflow-hidden relative border border-gray-200 dark:border-gray-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-[#d4826f] text-hebrew-heading">
            הסוד שלי אליך
          </span>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 40% 100%, 60% 50%, 0 40%)",
          }}
        />
      </div>
    </div>
  );
}

function TimelinePreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-2 relative">
        <div className="absolute top-2 bottom-2 w-0.5 bg-[#2e3c52]/30" />
        <div className="z-10 bg-white dark:bg-gray-600 p-1 rounded-full border border-[#2e3c52] shadow-sm">
          <Heart size={10} className="text-[#d4826f]" />
        </div>
        <div className="z-10 bg-white dark:bg-gray-600 p-1 rounded-full border border-[#2e3c52] shadow-sm">
          <span className="text-[8px]">👤</span>
        </div>
        <div className="z-10 bg-white dark:bg-gray-600 p-1 rounded-full border border-[#2e3c52] shadow-sm">
          <span className="text-[8px]">⭐</span>
        </div>
      </div>
    </div>
  );
}

function CouponsPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-28 h-14 bg-white dark:bg-gray-600 border-2 border-dashed border-[#d4826f] rounded-lg flex flex-col items-center justify-center shadow-md transform -rotate-3">
        <span className="text-[8px] font-bold text-[#2e3c52] dark:text-gray-300 uppercase tracking-wider text-hebrew-heading">
          קופון אהבה
        </span>
        <span className="text-[10px] font-bold text-[#2e3c52] dark:text-white mt-1 text-hebrew-heading">
          עיסוי מפנק
        </span>
      </div>
    </div>
  );
}
