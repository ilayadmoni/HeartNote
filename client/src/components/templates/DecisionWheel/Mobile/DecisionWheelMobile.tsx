"use client";

/**
 * DecisionWheelMobile Component
 * Mobile layout — compact wheel with stacked layout
 */

import { motion } from "framer-motion";
import type { DecisionWheelViewProps } from "../types";
import { WheelCanvas } from "../components";

import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";


export function DecisionWheelMobile({ data }: DecisionWheelViewProps) {
  const options =
    data.options?.length >= 2 ? data.options : ["אופציה 1", "אופציה 2"];

  return (
    <div className="min-h-[420px] bg-[#faf7f5] dark:bg-gray-900 px-4 relative overflow-hidden flex flex-col justify-between gap-6 py-6">
      <FloatingIcons/>
      {/* Decorative blobs */}
      <div className="absolute top-5 left-0 w-28 h-28 bg-[#F8BBD0]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-36 h-36 bg-[#C7CEEA]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Main Content - Top */}
      <div className="max-w-sm mx-auto flex flex-col items-center w-full">
        <BackToGallery className="mb-3" />

        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center dark:text-white mb-2 text-hebrew-heading"
            style={{ color: data.primaryColor || "#2e3c52" }}
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
            className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 text-hebrew-body"
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
            size={280}
            primaryColor={data.primaryColor}
          />
        </motion.div>
      </div>

      {/* Branding - Bottom */}
      <FooterBranding className="mx-auto" />
    </div>
  );
}
