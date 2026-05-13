"use client";

/**
 * SuccessModal Component
 * Shows after card creation with shareable link + WhatsApp share.
 * Uses React Portal to break out of DOM hierarchy and cover entire screen.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ExternalLink, X } from "lucide-react";
import { pushToDataLayer } from "@/utils/gtm";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  expiresAt: string | null;
  templateName?: string;
  verificationCode?: string | null;
}

export function SuccessModal({
  isOpen,
  onClose,
  url,
  expiresAt,
  templateName = "unknown",
  verificationCode,
}: SuccessModalProps) {
  const CLOSE_THEN_NAVIGATE_DELAY_MS = 60;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useLockBodyScroll(isOpen);

  // Hydration-safe: only render portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Build shareable URL with dynamic base
  const baseUrl = (typeof window !== "undefined" ? window.location.origin : null) || process.env.NEXT_PUBLIC_SITE_URL || "";
  const rawUrl = url || `${baseUrl}/p/card`;
  const shareUrl = verificationCode
    ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}code=${verificationCode}`
    : rawUrl;

  const handleCopy = async () => {
    pushToDataLayer({ event: "share", method: "copy", template_name: templateName });
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
    pushToDataLayer({ event: "share", method: "whatsapp", template_name: templateName });
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
                הכרטיס נוצר בהצלחה!
              </h2>
            </div>

            {/* Content */}
            <div className="p-4">
              {verificationCode && (
                <div className="mb-4">
                  <label
                    className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    קוד אימות למימוש קופונים
                  </label>
                  <div
                    className="flex justify-center gap-2 mb-2"
                    dir="ltr"
                    aria-label="קוד אימות"
                  >
                    {verificationCode.split("").map((digit, idx) => (
                      <span
                        key={idx}
                        className="w-10 h-12 flex items-center justify-center rounded-lg bg-[#faf1ee] dark:bg-gray-700 border-2 border-[#d4826f]/30 text-xl font-bold text-[#2e3c52] dark:text-white font-mono"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                  <p
                    className="text-[11px] text-gray-500 dark:text-gray-400 text-center leading-relaxed"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    אם תשכחו את הקוד, תמיד תוכלו למצוא אותו בעמוד הפרופיל שלכם.
                  </p>
                </div>
              )}

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
                  className="flex-1 min-w-0 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-base border-0 font-mono"
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
            <div className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4 space-y-3">
              {/* Row 1: WhatsApp + Open - Side by side */}
              <div className="grid grid-cols-2 gap-4">
                {/* WhatsApp Share */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppShare}
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-white font-medium text-xs sm:text-sm shadow-md transition-shadow hover:shadow-lg"
                  style={{
                    backgroundColor: "#25D366",
                    fontFamily: "'Open Sans', sans-serif",
                  }}
                >
                  {/* WhatsApp Icon */}
                  <span className="hidden sm:inline">שיתוף בווצאפ</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </motion.button>

                {/* Open */}
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => pushToDataLayer({ event: "share", method: "new_tab", template_name: templateName })}
                  className="flex items-center justify-center gap-1 py-3 px-3 bg-[#2e3c52] hover:bg-[#3d4f6a] text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  
                  <span className="hidden sm:inline">פתח בעמוד חדש</span>
                  <ExternalLink size={15} />
                </a>
              </div>

              {/* Row 2: Close - Full width */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  window.setTimeout(() => {
                    router.push("/");
                  }, CLOSE_THEN_NAVIGATE_DELAY_MS);
                }}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors font-medium text-xs sm:text-sm"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                סגור וחזור לעמוד הבית
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
