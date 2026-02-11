"use client";

/**
 * SteamyWindowMobile Component
 * Mobile layout — compact steamy window card
 */

import { motion } from "framer-motion";
import type { SteamyWindowViewProps } from "../types";
import { SteamCanvas } from "../components";
import { FooterBranding, BackToGallery } from "@/components/templates/components";

export function SteamyWindowMobile({ data }: SteamyWindowViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8edf2] to-[#faf7f5] dark:from-gray-800 dark:to-gray-900 py-8 px-4 relative overflow-hidden">
      {/* Back to Gallery */}
      <BackToGallery className="absolute top-3 right-3 z-20" />

      {/* Decorative blob */}
      <div className="absolute top-10 left-0 w-28 h-28 bg-[#C7CEEA]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-sm mx-auto flex flex-col items-center pt-6">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading"
          >
            {data.title}
          </motion.h1>
        )}

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xs text-gray-400 dark:text-gray-500 text-center mb-6 text-hebrew-body"
        >
          העבירו את האצבע על החלון 🫧
        </motion.p>

        {/* Steam canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <SteamCanvas
            width={320}
            height={280}
            revealMessage={data.revealMessage || "אני אוהב אותך! ❤️"}
            emoji={data.emoji}
            primaryColor={data.primaryColor}
            backgroundImage={data.background_image}
          />
        </motion.div>

        {/* Branding */}
        <div className="mt-8">
          <FooterBranding />
        </div>
      </div>
    </div>
  );
}
