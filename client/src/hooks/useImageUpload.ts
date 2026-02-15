/**
 * useImageUpload Hook
 *
 * Two-step image handling:
 *  Step 1 (immediate): Validate file, resize client-side, return a local
 *          blob URL for preview. NO Supabase interaction.
 *  Step 2 (deferred):  Upload the prepared blob to Supabase Storage
 *          (`card-assets` bucket) only when explicitly called.
 *
 * This prevents "bucket not found" errors during file selection and
 * ensures the upload only happens when the user confirms creation.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "card-assets";
const MAX_DIMENSION = 1200; // px – longest side
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB (matches bucket policy)
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface UseImageUploadOptions {
  /** Supabase user ID – used to namespace the upload path */
  userId: string;
  /** Called with the local preview URL once the file is prepared */
  onPreviewReady?: (localUrl: string) => void;
  /** Called when an error occurs */
  onError?: (message: string) => void;
}

interface UseImageUploadReturn {
  /** Validate + resize a file and generate a local preview URL (NO upload) */
  prepareFile: (file: File) => Promise<string | null>;
  /** Actually upload the previously-prepared blob to Supabase Storage */
  uploadPreparedFile: () => Promise<string | null>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Most recent error message, if any */
  error: string | null;
  /** The local blob URL for preview (revoked on unmount / new file) */
  previewUrl: string | null;
  /** The prepared Blob ready for upload (null until prepareFile is called) */
  preparedBlob: Blob | null;
  /** The original file name (used to build the storage path) */
  originalFileName: string | null;
  /** Reset the state (clear error / blob / preview) */
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
  onPreviewReady,
  onError,
}: UseImageUploadOptions): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [preparedBlob, setPreparedBlob] = useState<Blob | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);

  // Track the current preview URL so we can revoke it on cleanup
  const previewUrlRef = useRef<string | null>(null);

  // Revoke old blob URL whenever previewUrl changes or on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setError(null);
    setPreviewUrl(null);
    setPreparedBlob(null);
    setOriginalFileName(null);
  }, []);

  /* ── STEP 1: Local-only preparation (NO Supabase) ─────────────── */
  const prepareFile = useCallback(
    async (file: File): Promise<string | null> => {
      setError(null);

      // Validate type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        const msg = "סוג הקובץ לא נתמך. השתמשו ב-JPEG, PNG, WebP או GIF.";
        setError(msg);
        onError?.(msg);
        return null;
      }

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        const msg = "הקובץ גדול מדי. גודל מקסימלי: 2MB.";
        setError(msg);
        onError?.(msg);
        return null;
      }

      try {
        // Resize client-side (produces a webp Blob)
        const resizedBlob = await resizeImage(file, MAX_DIMENSION);
        setPreparedBlob(resizedBlob);
        setOriginalFileName(file.name);

        // Revoke old URL if one exists
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
        }

        // Generate local preview URL
        const localUrl = URL.createObjectURL(resizedBlob);
        previewUrlRef.current = localUrl;
        setPreviewUrl(localUrl);
        onPreviewReady?.(localUrl);
        return localUrl;
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "שגיאה בעיבוד התמונה. נסו שוב.";
        setError(msg);
        onError?.(msg);
        return null;
      }
    },
    [onPreviewReady, onError],
  );

  /* ── STEP 2: Deferred upload to Supabase Storage ──────────────── */
  const uploadPreparedFile = useCallback(async (): Promise<string | null> => {
    if (!preparedBlob || !originalFileName) {
      setError("אין תמונה להעלאה.");
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const safeName = originalFileName
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_{2,}/g, "_");
      const baseName = safeName.replace(/\.[^.]+$/, "");
      const path = `uploads/${userId}/${timestamp}_${baseName}.webp`;

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, preparedBlob, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path);

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
  }, [preparedBlob, originalFileName, userId, onError]);

  return {
    prepareFile,
    uploadPreparedFile,
    isUploading,
    error,
    previewUrl,
    preparedBlob,
    originalFileName,
    reset,
  };
}
