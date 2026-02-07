"use client";

/**
 * SuccessModal Component
 * Shows after card creation with shareable link
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ExternalLink, Clock, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  expiresAt: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  url,
  expiresAt,
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatExpiry = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "10 דקות";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#d4826f] p-6 text-center relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 left-4 text-white/80 hover:text-white"
                  aria-label="סגור"
                >
                  <X size={20} />
                </button>
                <span className="text-5xl block mb-2">🎉</span>
                <h2 className="text-xl font-bold text-white text-hebrew-heading">
                  !הכרטיס נוצר בהצלחה
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Expiry warning */}
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-xl mb-4">
                  <Clock size={18} />
                  <p className="text-sm text-hebrew-body">
                    זמין עד {formatExpiry(expiresAt)} (10 דקות)
                  </p>
                </div>

                {/* URL */}
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 text-hebrew-body">
                  קישור לשיתוף
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm border-0"
                    dir="ltr"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`px-4 py-3 rounded-xl transition-colors ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-[#d4826f] hover:bg-[#c4735f] text-white"
                    }`}
                    aria-label="העתק קישור"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </motion.button>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2e3c52] hover:bg-[#3d4f6a] text-white rounded-xl text-hebrew-heading transition-colors"
                  >
                    <ExternalLink size={16} />
                    פתח בטאב חדש
                  </a>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl text-hebrew-heading transition-colors"
                  >
                    סגור
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
