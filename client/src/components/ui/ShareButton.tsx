"use client";

/**
 * ShareButton Component
 *
 * Reusable button for sharing a creation's link.
 * - Uses Web Share API on supported browsers (native mobile/WhatsApp sharing).
 * - Falls back to clipboard on unsupported browsers.
 * - Shows temporary success message ("Link copied!" or "Shared!").
 * - Supports custom absolute URL or uses current window.location.href.
 */

import { useState, useEffect } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  /** The absolute URL to share (e.g., "https://example.com/p/card-id"). Defaults to window.location.href */
  url?: string;
  /** Button label (defaults to "שתף"). Hebrew/English/custom. */
  label?: string;
  /** CSS classes for the button */
  className?: string;
  /** Icon size in pixels */
  iconSize?: number;
}

export function ShareButton({
  url,
  label = "שתף",
  className = "",
  iconSize = 18,
}: ShareButtonProps) {
  const [supportsShare, setSupportsShare] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("הקישור הועתק!");

  // Detect Web Share API support
  useEffect(() => {
    const hasShare = "share" in navigator;
    setSupportsShare(hasShare);
  }, []);

  const getShareUrl = (): string => {
    // Use provided URL or current page URL
    if (url) {
      return url;
    }
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const handleShare = async () => {
    const shareUrl = getShareUrl();

    if (!shareUrl) {
      console.warn("[ShareButton] No URL to share");
      return;
    }

    try {
      if (supportsShare && navigator.share) {
        // Use native Share API if available
        await navigator.share({
          title: "HeartNote - כרטיס דיגיטלי",
          text: "הכנתי לך כרטיס מיוחד ב-HeartNote! 💌",
          url: shareUrl,
        });
        setSuccessMessage("שותף!");
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setSuccessMessage("הקישור הועתק!");
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      // Handle user cancellation or clipboard errors gracefully
      if (
        error instanceof Error &&
        error.name !== "AbortError" &&
        error.name !== "NotAllowedError"
      ) {
        console.error("[ShareButton] Share failed:", error);
      }
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleShare}
        aria-label={`${label} כרטיס`}
        title="שתף את הכרטיס"
        className={
          className ||
          `inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors`
        }
      >
        {showSuccess ? (
          <>
            <Check size={iconSize} />
            <span className="text-sm">{successMessage}</span>
          </>
        ) : (
          <>
            <Share2 size={iconSize} />
            <span className="text-sm">{label}</span>
          </>
        )}
      </button>

      {/* Toast message alternative (if you prefer a floating label) */}
      {showSuccess && !className && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
          {successMessage}
        </div>
      )}
    </div>
  );
}
