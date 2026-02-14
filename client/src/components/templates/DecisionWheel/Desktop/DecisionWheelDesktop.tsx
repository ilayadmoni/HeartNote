"use client";

/**
 * DecisionWheelDesktop Component
 * Desktop layout — centered wheel with decorative background
 */

import { motion } from "framer-motion";
import type { DecisionWheelViewProps } from "../types";
import { WheelCanvas } from "../components";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";

export function DecisionWheelDesktop({ data }: DecisionWheelViewProps) {
  const options =
    data.options?.length >= 2 ? data.options : ["אופציה 1", "אופציה 2"];

  return (
    <div className="flex flex-col min-h-[390px] bg-[#faf7f5] dark:bg-gray-900 relative">
      <BackToGallery className="top-4 right-4 absolute" />
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-[#F8BBD0]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-[#C7CEEA]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto px-6 py-8">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-[#2e3c52] dark:text-white mb-3 text-hebrew-heading"
          >
            {data.title}
          </motion.h1>
        )}

        {/* Subtitle */}
        {data.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-base text-gray-500 dark:text-gray-400 text-center mb-8 text-hebrew-body"
          >
            {data.subtitle}
          </motion.p>
        )}

        {/* Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <WheelCanvas
            options={options}
            size={340}
            primaryColor={data.primaryColor}
          />
        </motion.div>
      </div>

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 pb-4" />
    </div>
  );
}
