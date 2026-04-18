"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { FooterBranding, BackToGallery } from "@/components/templates/components";
import type { ApologySearchMobileProps } from "../types";

export function ApologySearchMobile({
  data,
  phase,
  typedText,
  primaryColor,
  onStart,
  onReset,
}: ApologySearchMobileProps) {
  return (
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate overflow-hidden">
      <BackToGallery className="absolute top-3 right-3" />

      <div className="flex-1 flex flex-col items-center justify-center w-full px-5 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {phase !== "result" ? (
            <motion.div
              key="search-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full gap-6"
            >
              {/* Search icon heading */}
              <div className="flex flex-col items-center gap-1">
                <Search size={36} color={primaryColor} strokeWidth={1.5} />
                <p className="text-[#415a77] text-xs text-hebrew-body">
                  חיפוש סליחה
                </p>
              </div>

              {/* Search bar */}
              <div className="w-full bg-white border-2 border-[#e8ddd8] rounded-full px-4 py-3 flex items-center shadow-md gap-2">
                <Search size={16} color="#415a77" />
                <span
                  dir="rtl"
                  className="flex-1 text-base text-[#1b263b] bg-transparent outline-none text-hebrew-body min-h-[1.25rem]"
                >
                  {typedText || (
                    <span className="text-[#9baab5]">הקלידי חיפוש...</span>
                  )}
                  {phase === "typing" && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-4 bg-[#1b263b] align-middle mr-0.5"
                    />
                  )}
                </span>
              </div>

              {/* Bouncing dots */}
              <AnimatePresence>
                {phase === "loading" && (
                  <motion.div
                    key="dots"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Start button */}
              <AnimatePresence>
                {phase === "idle" && (
                  <motion.button
                    key="start-btn"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    onClick={onStart}
                    className="px-7 py-2.5 rounded-full font-medium text-white text-sm text-hebrew-body shadow-md hover:opacity-90 active:scale-95 transition-all"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {data.startButtonLabel ?? "התחל חיפוש"}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="result-area"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center gap-5"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill={primaryColor}
                  stroke={primaryColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </motion.div>

              <div className="bg-[#fdf6f2] border border-[#e8ddd8] rounded-[24px] px-6 py-6 shadow-lg flex flex-col items-center gap-2 w-full max-w-xs">
                <h2 className="text-2xl font-extrabold text-[#1b263b] text-hebrew-heading">
                  {data.resultTitle}
                </h2>
                {data.resultSubtitle && (
                  <p className="text-[#415a77] text-sm text-hebrew-body leading-relaxed">
                    {data.resultSubtitle}
                  </p>
                )}
              </div>

              <button
                onClick={onReset}
                className="text-sm text-[#9baab5] hover:text-[#415a77] underline transition-colors text-hebrew-body"
              >
                חפש שוב
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterBranding className="shrink-0 pb-3 relative z-10" />
    </div>
  );
}
