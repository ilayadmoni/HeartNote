"use client";

/**
 * ShareSection
 * Positioned below the template content, above the Footer.
 * Contains: WhatsApp share (primary CTA) + Copy Link.
 * Clearly visible on mobile with large touch targets.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pushToDataLayer } from "@/utils/gtm";

export function ShareSection({ templateName = "unknown" }: { templateName?: string }) {
  const [copied, setCopied] = useState(false);

  const handleWhatsAppShare = () => {
    pushToDataLayer({ event: "share", method: "whatsapp", template_name: templateName });
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("הכנתי לך כרטיס מיוחד ב-HeartNote! 💌 ");
    window.open(`https://wa.me/?text=${text}${url}`, "_blank");
  };

  const handleCopyLink = async () => {
    pushToDataLayer({ event: "share", method: "copy", template_name: templateName });
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-transparent to-[#faf7f5] dark:to-gray-900">
      <div className="max-w-md mx-auto px-5 py-8">
        {/* Section label */}
        <p
          className="text-center text-sm text-gray-400 dark:text-gray-500 mb-4"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          אהבת? שתפו את הכרטיס! 💌
        </p>

        {/* Buttons row */}
        <div className="flex items-center gap-1"> 
          {/* WhatsApp Share — Primary CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleWhatsAppShare}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
            style={{
              backgroundColor: "#25D366",
              fontFamily: "'Open Sans', sans-serif",
            }}
            aria-label="שתף ב-WhatsApp"
          >
            {/* WhatsApp SVG */}
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

          {/* Copy Link */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={handleCopyLink}
            className="relative flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#d4826f] dark:hover:border-[#e8917a] text-gray-600 dark:text-gray-300 text-sm font-medium shadow-sm transition-all"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
            aria-label="העתק קישור"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.svg
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </motion.svg>
              )}
            </AnimatePresence>
            {copied ? "הועתק!" : "העתק"}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
