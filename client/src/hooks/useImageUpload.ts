/**
 * useImageUpload Hook
 *
 * Two-step image handling:
 *  Step 1 (immediate): Validate file, resize client-side, return a local
 *          blob URL for preview. NO Supabase interaction.
 *  Step 2 (deferred):  Upload the prepared blob to Supabase Storage
 *          (`image_steamy_Window` bucket) only when explicitly called.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  IMAGE_CONSTANTS,
  type ImageUploadOptions,
  type ImageUploadReturn,
  resizeImage,
  validateFileType,
  validateFileSize,
  buildStoragePath,
} from "@/lib/utils/image-utils";

export function useImageUpload({
  userId,
  onPreviewReady,
  onError,
}: ImageUploadOptions): ImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [preparedBlob, setPreparedBlob] = useState<Blob | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);

  const previewUrlRef = useRef<string | null>(null);

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

      const typeError = validateFileType(file);
      if (typeError) { setError(typeError); onError?.(typeError); return null; }

      const sizeError = validateFileSize(file);
      if (sizeError) { setError(sizeError); onError?.(sizeError); return null; }

      try {
        const resizedBlob = await resizeImage(file, IMAGE_CONSTANTS.MAX_DIMENSION);
        setPreparedBlob(resizedBlob);
        setOriginalFileName(file.name);

        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

        const localUrl = URL.createObjectURL(resizedBlob);
        previewUrlRef.current = localUrl;
        setPreviewUrl(localUrl);
        onPreviewReady?.(localUrl);
        return localUrl;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "שגיאה בעיבוד התמונה. נסו שוב.";
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
      const path = buildStoragePath(userId, originalFileName);
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(IMAGE_CONSTANTS.BUCKET)
        .upload(path, preparedBlob, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from(IMAGE_CONSTANTS.BUCKET)
        .getPublicUrl(path);

      return publicUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "שגיאה בהעלאת התמונה. נסו שוב.";
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
