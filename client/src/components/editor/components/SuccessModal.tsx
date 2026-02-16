"use client";

/**
 * SuccessModal Component
 * Shows after card creation with shareable link + WhatsApp share.
 * Uses React Portal to break out of DOM hierarchy and cover entire screen.
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ExternalLink, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  expiresAt: string | null;
}

export function SuccessModal({
  isOpen,
  onClose,
  url,
  expiresAt,
}: SuccessModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hydration-safe: only render portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Build shareable URL with dynamic base
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const shareUrl = url || `${baseUrl}/p/card`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const text = encodeURIComponent("הכנתי לך כרטיס מיוחד ב-HeartNote! 💌 ");
    window.open(`https://wa.me/?text=${text}${encodedUrl}`, "_blank");
  };

  if (!mounted) {
    return null;
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto"
        >
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-[#d4826f] p-5 text-center relative">
              <button
                onClick={onClose}
                className="absolute top-3 left-3 text-white/80 hover:text-white transition-colors"
                aria-label="סגור"
              >
                <X size={18} />
              </button>
              <span className="text-4xl block mb-2">🎉</span>
              <h2
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                !הכרטיס נוצר בהצלחה
              </h2>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* URL Input */}
              <label
                className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                קישור לשיתוף
              </label>
              <div className="flex gap-1.5 mb-4">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 min-w-0 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-xs border-0 font-mono"
                  dir="ltr"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg transition-colors ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-[#d4826f] hover:bg-[#c4735f] text-white"
                  }`}
                  aria-label="העתק קישור"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </motion.button>
              </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-3.5 space-y-2">
              {/* WhatsApp Share */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-medium text-sm shadow-md transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: "#25D366",
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                {/* WhatsApp Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                שתף ב-WhatsApp
              </motion.button>

              {/* Row: Open + Close */}
              <div className="flex gap-2">
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#2e3c52] hover:bg-[#3d4f6a] text-white rounded-lg transition-colors font-medium text-sm"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  <ExternalLink size={15} />
                  פתח
                </a>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors font-medium text-sm"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  סגור
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
