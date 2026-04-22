"use client";

/**
 * CreateCardPage Component
 *
 * Main creation form for the "Steamy Window" card.
 *
 * Flow:
 *  1. User picks an image  → opens ImageCropperModal (square aspect)
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
import { createPortal } from "react-dom";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { SteamyWindowPreview } from "./SteamyWindowPreview";
import { SteamyWindowCropModal } from "./SteamyWindowCropModal";
import { ConfirmationModal } from "./ConfirmationModal";

const supabase = createClient();


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

  /* ── Modal state ────────────────────────────────────────────────── */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ── Auth ────────────────────────────────────────────────────────── */
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  /* ── Blob URL lifecycle tracking ────────────────────────────────── */
  const croppedUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  /** Select a file → open the cropper modal */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Revoke any previous raw URL
      if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);

      const url = URL.createObjectURL(file);
      setRawImageUrl(url);
      setIsCropping(true);

      // Reset input so re-selecting the same file works
      e.target.value = "";
    },
    [rawImageUrl],
  );

  /** Cropper confirmed → store cropped blob → push into parent data */
  const handleCropDone = useCallback(
    (croppedUrl: string) => {
      // Revoke previous cropped blob URL
      if (croppedUrlRef.current) URL.revokeObjectURL(croppedUrlRef.current);
      croppedUrlRef.current = croppedUrl;

      // ✅ Push the cropped URL into the REAL creation object
      onChange("background_image", croppedUrl);

      // Cleanup raw image & close cropper
      if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
      setRawImageUrl(null);
      setIsCropping(false);
    },
    [rawImageUrl, onChange],
  );

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

              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#c77d67] transition-colors bg-white dark:bg-gray-800"
              >
                {previewUrl ? (
                  <p className="text-sm text-[#c77d67] font-semibold text-hebrew-body">
                    ✓ תמונה נבחרה — לחצו לשינוי
                  </p>
                ) : (
                  <div className="flex flex-col items-center pointer-events-none">
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
              </div>

              {/* Hidden input — triggered imperatively, Safari-safe */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
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
                key={previewUrl}
                previewUrl={previewUrl}
                dedicationText={dedicationText || "ההקדשה שלכם תופיע כאן…"}
              />
            ) : (
              <div className="aspect-square w-full max-w-sm mx-auto rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <p className="text-sm text-gray-400 dark:text-gray-500 text-hebrew-body">
                  התצוגה המקדימה תופיע כאן
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Crop modal ────────────────────────────────────────────── */}
      {isCropping && rawImageUrl &&
        typeof document !== "undefined" &&
        createPortal(
          <SteamyWindowCropModal
            imageSrc={rawImageUrl}
            onCropDone={handleCropDone}
            onCancel={handleCropCancel}
          />,
          document.body,
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
