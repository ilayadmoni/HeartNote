"use client";

/**
 * CreateCardPage Component
 *
 * Main creation form for the "Steamy Window" card.
 *
 * Flow:
 *  1. User picks an image  → opens a 3:4 crop overlay (react-easy-crop)
 *  2. User confirms the crop → cropped blob URL is pushed into the REAL
 *     creation object via `onChange("background_image", url)`
 *  3. User writes a dedication text → `onChange("revealMessage", text)`
 *  4. Right column shows a live SteamyWindowPreview
 *  5. "Proceed to Creation" opens ConfirmationModal → Server Action
 *
 * State architecture:
 *  NO isolated local state for creation data. The parent passes `data`
 *  and `onChange` (same pattern as EditorSidebar) so the image URL and
 *  text are always part of the real creation object.
 *
 * Memory-safe: cleans up blob URLs via refs + useEffect.
 * Auth-aware: fetches the current Supabase user with a loading guard.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { SteamyWindowPreview } from "./SteamyWindowPreview";
import { ConfirmationModal } from "./ConfirmationModal";

/* ------------------------------------------------------------------ */
/*  Crop utility helpers                                               */
/* ------------------------------------------------------------------ */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.setAttribute("crossOrigin", "anonymous");
    img.src = src;
  });
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  ctx.drawImage(
    img,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }
        resolve(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.92,
    );
  });
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface CreateCardPageProps {
  /** Current creation data — single source of truth from parent */
  data: Record<string, unknown>;
  /** Updates a key in the parent creation data */
  onChange: (key: string, value: unknown) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function CreateCardPage({ data, onChange }: CreateCardPageProps) {
  /* ── Cropping UI state (temporary, NOT part of creation data) ──── */
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  /* ── Modal state ────────────────────────────────────────────────── */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ── Auth ────────────────────────────────────────────────────────── */
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  /* ── Blob URL lifecycle tracking ────────────────────────────────── */
  const croppedUrlRef = useRef<string | null>(null);

  /* ── Read from parent data (keys match steamy-window config) ────── */
  const previewUrl = (data.background_image as string) || "";
  const dedicationText = (data.revealMessage as string) || "";

  /* ── Fetch current Supabase user on mount ───────────────────────── */
  useEffect(() => {
    let cancelled = false;
    async function fetchUser() {
      try {
        const {
          data: { user: u },
        } = await supabase.auth.getUser();
        if (!cancelled) setUser(u);
      } catch {
        /* gracefully handle */
      } finally {
        if (!cancelled) setIsLoadingUser(false);
      }
    }
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Cleanup blob URLs on unmount ───────────────────────────────── */
  useEffect(() => {
    return () => {
      if (croppedUrlRef.current) URL.revokeObjectURL(croppedUrlRef.current);
    };
  }, []);

  /* ── Handlers ───────────────────────────────────────────────────── */

  /** Select a file → open the cropper overlay */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Revoke any previous raw URL
      if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);

      const url = URL.createObjectURL(file);
      setRawImageUrl(url);
      setIsCropping(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);

      // Reset input so re-selecting the same file works
      e.target.value = "";
    },
    [rawImageUrl],
  );

  /** react-easy-crop fires this on every crop/zoom change */
  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  /** Confirm the crop → generate cropped blob → push into parent data */
  const handleCropConfirm = useCallback(async () => {
    if (!rawImageUrl || !croppedAreaPixels) return;

    try {
      // Revoke previous cropped blob URL
      if (croppedUrlRef.current) URL.revokeObjectURL(croppedUrlRef.current);

      const url = await getCroppedImg(rawImageUrl, croppedAreaPixels);
      croppedUrlRef.current = url;

      // ✅ Push the cropped URL into the REAL creation object
      onChange("background_image", url);

      // Cleanup raw image & close cropper
      URL.revokeObjectURL(rawImageUrl);
      setRawImageUrl(null);
      setIsCropping(false);
    } catch (err) {
      console.error("Crop failed:", err);
    }
  }, [rawImageUrl, croppedAreaPixels, onChange]);

  /** Cancel the crop → discard raw image */
  const handleCropCancel = useCallback(() => {
    if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
    setRawImageUrl(null);
    setIsCropping(false);
  }, [rawImageUrl]);

  const isReady = !!previewUrl && dedicationText.trim().length > 0;

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 py-10 px-4 sm:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-8 text-hebrew-heading">
          יצירת כרטיס חלון מאודה
        </h1>

        {/* Two-column grid (stacks on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ── Left column – Form inputs ────────────────────────── */}
          <div className="space-y-6">
            {/* File input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-hebrew-body">
                בחרו תמונה
              </label>

              <label
                htmlFor="card-image"
                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#c77d67] transition-colors bg-white dark:bg-gray-800"
              >
                {previewUrl ? (
                  <p className="text-sm text-[#c77d67] font-semibold text-hebrew-body">
                    ✓ תמונה נבחרה — לחצו לשינוי
                  </p>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-gray-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
                      לחצו להעלאת תמונה
                    </span>
                  </div>
                )}

                <input
                  id="card-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Dedication textarea */}
            <div>
              <label
                htmlFor="dedication"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-hebrew-body"
              >
                הקדשה
              </label>
              <textarea
                id="dedication"
                rows={5}
                value={dedicationText}
                onChange={(e) => onChange("revealMessage", e.target.value)}
                placeholder="כתבו כאן את ההקדשה שלכם..."
                className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c77d67]/40 transition resize-none text-hebrew-body"
              />
            </div>

            {/* Proceed button */}
            <button
              type="button"
              disabled={!isReady}
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 cursor-pointer text-hebrew-body"
              style={{ backgroundColor: "#c77d67" }}
            >
              המשך ליצירה
            </button>
          </div>

          {/* ── Right column – Live preview ──────────────────────── */}
          <div className="flex items-start justify-center">
            {previewUrl ? (
              <SteamyWindowPreview
                previewUrl={previewUrl}
                dedicationText={dedicationText || "ההקדשה שלכם תופיע כאן…"}
              />
            ) : (
              <div className="aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <p className="text-sm text-gray-400 dark:text-gray-500 text-hebrew-body">
                  התצוגה המקדימה תופיע כאן
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Crop overlay (full-screen, z-50) ────────────────────── */}
      {isCropping && rawImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
          {/* Cropper area */}
          <div className="relative flex-1">
            <Cropper
              image={rawImageUrl}
              crop={crop}
              zoom={zoom}
              aspect={3 / 4}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom slider */}
          <div className="px-8 py-3 flex items-center gap-4 justify-center bg-black/60">
            <span className="text-white text-sm">🔍</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-48 accent-[#c77d67]"
            />
          </div>

          {/* Confirm / cancel buttons */}
          <div
            dir="rtl"
            className="flex items-center justify-center gap-4 px-6 py-4 bg-black/60"
          >
            <button
              type="button"
              onClick={handleCropConfirm}
              className="px-8 py-2.5 rounded-xl text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity text-hebrew-body"
              style={{ backgroundColor: "#c77d67" }}
            >
              אישור חיתוך
            </button>
            <button
              type="button"
              onClick={handleCropCancel}
              className="px-8 py-2.5 rounded-xl border border-white/30 text-white font-semibold text-sm cursor-pointer hover:bg-white/10 transition-colors text-hebrew-body"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* ── Confirmation modal ──────────────────────────────────── */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templateSlug="steamy-window"
        creationMetadata={{ revealMessage: dedicationText }}
        previewUrl={previewUrl}
        bucketName="image_steamy_Window"
        creationType="חלון מאודה"
        user={user}
        isLoadingUser={isLoadingUser}
      />
    </div>
  );
}
