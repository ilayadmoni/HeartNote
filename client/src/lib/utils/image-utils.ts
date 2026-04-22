/**
 * Image Utility Functions
 *
 * Client-side image processing utilities used by the useImageUpload hook.
 * Handles validation and resizing before upload.
 */

export const IMAGE_CONSTANTS = {
  BUCKET: "image_steamy_Window",
  MAX_DIMENSION: 1200,          // px – longest side
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2 MB (matches bucket policy)
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
} as const;

export interface ImageUploadOptions {
  /** Supabase user ID – used to namespace the upload path */
  userId: string;
  /** Called with the local preview URL once the file is prepared */
  onPreviewReady?: (localUrl: string) => void;
  /** Called when an error occurs */
  onError?: (message: string) => void;
}

export interface ImageUploadReturn {
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
export async function resizeImage(file: File, maxDim: number): Promise<Blob> {
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

/** Validate file type against accepted types */
export function validateFileType(file: File): string | null {
  if (!(IMAGE_CONSTANTS.ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
    return "סוג הקובץ לא נתמך. השתמשו ב-JPEG, PNG, WebP או GIF.";
  }
  return null;
}

/** Validate file size against max limit */
export function validateFileSize(file: File): string | null {
  if (file.size > IMAGE_CONSTANTS.MAX_FILE_SIZE) {
    return "הקובץ גדול מדי. גודל מקסימלי: 2MB.";
  }
  return null;
}

/** Build a safe storage path for the uploaded file */
export function buildStoragePath(userId: string, originalFileName: string): string {
  const timestamp = Date.now();
  const safeName = originalFileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_");
  const baseName = safeName.replace(/\.[^.]+$/, "");
  return `uploads/${userId}/${timestamp}_${baseName}.webp`;
}

/* ------------------------------------------------------------------ */
/*  Canvas-based image cropping (used with react-easy-crop)            */
/* ------------------------------------------------------------------ */

/** Load an image element from a URL (supports cross-origin). */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.setAttribute("crossOrigin", "anonymous");
    img.src = src;
  });
}

/**
 * Crop an image on the client and return a blob Object URL.
 *
 * @param imageSrc    – source URL (blob URL or remote)
 * @param pixelCrop   – `Area` from react-easy-crop's `onCropComplete`
 * @param outputWidth – output canvas width in px (default 390)
 * @param outputHeight – output canvas height in px (default 520)
 * @param quality     – JPEG quality (0–1, default 0.92)
 * @returns Object URL pointing to the cropped blob
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  outputWidth = 390,
  outputHeight = 520,
  quality = 0.92,
): Promise<string> {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
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
    outputWidth,
    outputHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create cropped blob"));
          return;
        }
        resolve(URL.createObjectURL(blob));
      },
      "image/jpeg",
      quality,
    );
  });
}
