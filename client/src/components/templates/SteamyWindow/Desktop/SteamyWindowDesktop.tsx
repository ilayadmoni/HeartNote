"use client";

/**
 * SteamyWindowDesktop Component
 * Desktop layout — centered steamy window card
 */

import { motion } from "framer-motion";
import type { SteamyWindowViewProps } from "../types";
import { SteamCanvas } from "../components";
import { FooterBranding, BackToGallery } from "@/components/templates/components";

export function SteamyWindowDesktop({ data }: SteamyWindowViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8edf2] to-[#faf7f5] dark:from-gray-800 dark:to-gray-900 py-12 px-6 relative overflow-hidden">
      {/* Back to Gallery */}
      <BackToGallery className="absolute top-4 right-4 z-20" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-16 w-48 h-48 bg-[#C7CEEA]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-16 w-56 h-56 bg-[#B5EAD7]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg mx-auto flex flex-col items-center">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading"
          >
            {data.title}
          </motion.h1>
        )}

        {/* Subtitle hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-gray-400 dark:text-gray-500 text-center mb-8 text-hebrew-body"
        >
          העבירו את האצבע על החלון כדי לגלות את ההודעה 🫧
        </motion.p>

        {/* Steam canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <SteamCanvas
            width={400}
            height={320}
            revealMessage={data.revealMessage || "אני אוהב אותך! ❤️"}
            emoji={data.emoji}
            primaryColor={data.primaryColor}
            backgroundImage={data.background_image}
          />
        </motion.div>

        {/* Branding */}
        <div className="mt-10">
          <FooterBranding />
        </div>
      </div>
    </div>
  );
}
