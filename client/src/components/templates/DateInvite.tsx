"use client";

/**
 * DateInvite Component
 * Interactive "Will you go out with me?" card with confetti celebration
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { TemplateComponentProps, DateInviteData } from "./types";

export function DateInvite({ data }: TemplateComponentProps<DateInviteData>) {
  const [answered, setAnswered] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  const handleYes = useCallback(() => {
    setAnswered(true);
    // Fire confetti from both sides
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.3, y: 0.6 },
      colors: ["#d4826f", "#e8917a", "#faf7f5", "#2e3c52"],
    });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.7, y: 0.6 },
      colors: ["#d4826f", "#e8917a", "#faf7f5", "#2e3c52"],
    });
  }, []);

  const handleNoHover = useCallback(() => {
    // Random position within bounds
    const maxX = 500;
    const maxY = 500;
    setNoPosition({
      x: (Math.random() - 0.5) * maxX * 2,
      y: (Math.random() - 0.5) * maxY * 2,
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf7f5] dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 3 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Background Image */}
        {data.backgroundImage && (
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.backgroundImage})` }}
          />
        )}

        {/* Content */}
        <div className="relative p-8 text-center">
          {!answered ? (
            <>
              {/* Hearts decoration */}
              <div className="flex justify-center gap-2 mb-6">
                {["❤️", "💕", "❤️"].map((heart, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.2,
                    }}
                    className="text-3xl"
                  >
                    {heart}
                  </motion.span>
                ))}
              </div>

              {/* Question */}
              <h1 className="text-2xl md:text-3xl font-bold text-[#2e3c52] dark:text-white mb-8 text-hebrew-heading leading-relaxed">
                {data.question}
              </h1>

              {/* Buttons Container */}
              <div className="relative flex justify-center gap-6 h-24">
                {/* Yes Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                  className="px-10 py-4 bg-[#d4826f] hover:bg-[#c4735f] text-white text-xl font-bold rounded-full shadow-lg transition-colors text-hebrew-heading"
                >
                  {data.yesText}
                </motion.button>

                {/* No Button (runs away) */}
                <motion.button
                  animate={{ x: noPosition.x, y: noPosition.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onHoverStart={handleNoHover}
                  onTouchStart={handleNoHover}
                  className="px-10 py-4 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xl font-bold rounded-full shadow-lg text-hebrew-heading"
                >
                  {data.noText}
                </motion.button>
              </div>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-6xl block mb-6"
              >
                💖
              </motion.span>
              <h2 className="text-3xl font-bold text-[#d4826f] text-hebrew-heading">
                {data.successMessage}
              </h2>
            </motion.div>
          )}
        </div>

        {/* Bottom Accent */}
        <div className="h-2 bg-gradient-to-r from-[#d4826f] to-[#2e3c52]" />
      </motion.div>
    </div>
  );
}
