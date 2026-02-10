"use client";

/**
 * SuccessModal Component
 * Shows after card creation with shareable link + WhatsApp share.
 * Perfectly centered on all devices with sticky bottom actions.
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

  const handleWhatsAppShare = () => {
    const shareUrl = encodeURIComponent(url);
    const text = encodeURIComponent("הכנתי לך כרטיס מיוחד ב-HeartNote! 💌 ");
    window.open(`https://wa.me/?text=${text}${shareUrl}`, "_blank");
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
          {/* Backdrop — centered flex container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-[#d4826f] p-6 text-center relative rounded-t-xl">
                <button
                  onClick={onClose}
                  className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
                  aria-label="סגור"
                >
                  <X size={20} />
                </button>
                <span className="text-5xl block mb-2">🎉</span>
                <h2
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  !הכרטיס נוצר בהצלחה
                </h2>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Expiry warning */}
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-xl mb-4">
                  <Clock size={18} className="flex-shrink-0" />
                  <p
                    className="text-sm"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    זמין עד {formatExpiry(expiresAt)} (10 דקות)
                  </p>
                </div>

                {/* URL */}
                <label
                  className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  קישור לשיתוף
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 min-w-0 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm border-0"
                    dir="ltr"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl transition-colors ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-[#d4826f] hover:bg-[#c4735f] text-white"
                    }`}
                    aria-label="העתק קישור"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </motion.button>
                </div>
              </div>

              {/* Sticky Bottom Actions */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4 rounded-b-xl space-y-2.5">
                {/* WhatsApp Share */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-white font-bold text-sm shadow-md transition-shadow hover:shadow-lg"
                  style={{
                    backgroundColor: "#25D366",
                    fontFamily: "'Open Sans', sans-serif",
                  }}
                >
                  {/* WhatsApp Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  שתף ב-WhatsApp
                </motion.button>

                {/* Row: Open + Close */}
                <div className="flex gap-2.5">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2e3c52] hover:bg-[#3d4f6a] text-white rounded-xl transition-colors font-bold text-sm"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    <ExternalLink size={16} />
                    פתח בטאב חדש
                  </a>
                  <button
                    onClick={onClose}
                    className="px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl transition-colors font-bold text-sm"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    סגור
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
