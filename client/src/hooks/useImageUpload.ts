/**
 * useImageUpload Hook
 *
 * Handles uploading images to Supabase Storage (`card-assets` bucket).
 * - Resizes images client-side to max 1200px before uploading.
 * - Path format: uploads/{user_id}/{timestamp}_{filename}
 * - Returns the public URL (never base64).
 */

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "card-assets";
const MAX_DIMENSION = 1200; // px – longest side
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB (matches bucket policy)
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface UseImageUploadOptions {
  /** Supabase user ID – used to namespace the upload path */
  userId: string;
  /** Called with the public URL once the upload succeeds */
  onUploadComplete?: (url: string) => void;
  /** Called when an error occurs */
  onError?: (message: string) => void;
}

interface UseImageUploadReturn {
  /** Trigger the upload flow for a given File */
  upload: (file: File) => Promise<string | null>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Most recent error message, if any */
  error: string | null;
  /** Most recently uploaded public URL */
  uploadedUrl: string | null;
  /** Reset the state (clear error / url) */
  reset: () => void;
}

/**
 * Resize an image on the client before uploading.
 * Returns a Blob (image/webp when supported, else image/jpeg).
 */
async function resizeImage(file: File, maxDim: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create image blob"));
            return;
          }
          resolve(blob);
        },
        "image/webp",
        0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for resizing"));
    };

    img.src = url;
  });
}

export function useImageUpload({
  userId,
  onUploadComplete,
  onError,
}: UseImageUploadOptions): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const reset = useCallback(() => {
    setError(null);
    setUploadedUrl(null);
  }, []);

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      setError(null);

      // ── Validate ──────────────────────────────────────────────────
      if (!ACCEPTED_TYPES.includes(file.type)) {
        const msg = "סוג הקובץ לא נתמך. השתמשו ב-JPEG, PNG, WebP או GIF.";
        setError(msg);
        onError?.(msg);
        return null;
      }

      if (file.size > MAX_FILE_SIZE) {
        const msg = "הקובץ גדול מדי. גודל מקסימלי: 2MB.";
        setError(msg);
        onError?.(msg);
        return null;
      }

      setIsUploading(true);

      try {
        // ── Resize client-side ──────────────────────────────────────
        const resizedBlob = await resizeImage(file, MAX_DIMENSION);

        // ── Build path ──────────────────────────────────────────────
        const timestamp = Date.now();
        const safeName = file.name
          .replace(/[^a-zA-Z0-9._-]/g, "_")
          .replace(/_{2,}/g, "_");
        const ext = "webp"; // we always convert to webp
        const baseName = safeName.replace(/\.[^.]+$/, "");
        const path = `uploads/${userId}/${timestamp}_${baseName}.${ext}`;

        // ── Upload ──────────────────────────────────────────────────
        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, resizedBlob, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // ── Get public URL ──────────────────────────────────────────
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET).getPublicUrl(path);

        setUploadedUrl(publicUrl);
        onUploadComplete?.(publicUrl);
        return publicUrl;
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "שגיאה בהעלאת התמונה. נסו שוב.";
        setError(msg);
        onError?.(msg);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [userId, onUploadComplete, onError]
  );

  return { upload, isUploading, error, uploadedUrl, reset };
}
