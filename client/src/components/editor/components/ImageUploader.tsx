"use client";

/**
 * ImageUploader Component
 *
 * Drag-and-drop / click-to-upload image field for the editor.
 *
 * Two-step flow:
 *  1. On file select → validate, resize, generate a LOCAL blob preview.
 *     No Supabase interaction at this point.
 *  2. The parent retrieves the `uploadPreparedFile` function (via
 *     `onFileReady`) and calls it only when the user confirms creation.
 */

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploaderProps {
  /** Current image URL (blob preview or remote URL from form state) */
  value: string | undefined;
  /** Called with the local blob URL (or empty string to clear) */
  onChange: (url: string) => void;
  /** Supabase user ID */
  userId: string;
  /** Label shown above the uploader */
  label?: string;
  /**
   * Called when a file is prepared and ready for deferred upload.
   * The parent should store the returned `uploadFn` and call it
   * during the creation flow to get the final Supabase public URL.
   */
  onFileReady?: (uploadFn: (() => Promise<string | null>) | null) => void;
}

export function ImageUploader({
  value,
  onChange,
  userId,
  label = " ",
  onFileReady,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { prepareFile, uploadPreparedFile, isUploading, error, reset } =
    useImageUpload({
      userId,
      onPreviewReady: (localUrl) => {
        // Set the local blob URL as the value for the preview
        onChange(localUrl);
        // Expose the deferred upload function to the parent
        onFileReady?.(uploadPreparedFile);
      },
    });

  // ── Handlers ────────────────────────────────────────────────────
  const handleFile = useCallback(
    async (file: File) => {
      // Step 1 only: validate, resize, generate local preview.
      // NO Supabase interaction.
      await prepareFile(file);
    },
    [prepareFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset the input so re-selecting the same file works
      e.target.value = "";
    },
    [handleFile],
  );

  const handleClear = useCallback(() => {
    reset();
    onChange("");
    onFileReady?.(null);
  }, [onChange, reset, onFileReady]);

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#2e3c52] dark:text-gray-200 text-hebrew-heading">
          {label}
        </label>
      )}

      <AnimatePresence mode="wait">
        {/* ── Preview (has image) ── */}
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded background"
              className="w-full h-40 object-cover"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="הסרת תמונה"
            >
              <X size={14} />
            </button>
          </motion.div>
        ) : (
          /* ── Drop zone (no image) ── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              flex flex-col items-center justify-center gap-2 p-6
              rounded-xl border-2 border-dashed cursor-pointer
              transition-colors duration-200
              ${
                isDragging
                  ? "border-[#d4826f] bg-[#d4826f]/10"
                  : "border-gray-300 dark:border-gray-600 hover:border-[#d4826f]/60 hover:bg-gray-50 dark:hover:bg-gray-700/40"
              }
            `}
          >
            {isUploading ? (
              <Loader2 size={28} className="text-[#d4826f] animate-spin" />
            ) : (
              <>
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  {isDragging ? (
                    <ImageIcon size={24} className="text-[#d4826f]" />
                  ) : (
                    <Upload size={24} className="text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center text-hebrew-body">
                  {isDragging ? "שחררו כאן" : "גררו תמונה או לחצו לבחירה"}
                </p>
                <p className="text-xs text-gray-400">
                  JPEG, PNG, WebP, GIF — עד 2MB
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 text-hebrew-body">{error}</p>
      )}
    </div>
  );
}
