"use client";

import { motion } from "framer-motion";
import { BackToGallery } from "@/components/templates/components";
import { FooterBranding } from "@/components/templates/components";
import { HOLIDAY_PRESETS } from "../constants/holidays";
import type { HolidayCardData } from "../../types";

interface HolidayCardDesktopProps {
  data: HolidayCardData;
  primaryColor: string;
}

export function HolidayCardDesktop({
  data,
  primaryColor,
}: HolidayCardDesktopProps) {
  const preset = HOLIDAY_PRESETS[data.holidayKind];
  const displayTitle = data.customTitle || preset.defaultTitle;
  const displayGreeting = data.customGreeting || preset.defaultGreeting;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      <BackToGallery />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-4xl font-black text-center text-hebrew-heading mb-4">
          מפעל החגים שלנו
        </h2>
        <p className="text-center text-hebrew-body text-stone-600 mb-12">
          בחרו חג והתאימו את הברכה לאהובים עליכם.
        </p>

        {/* Holiday Card */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md p-12 rounded-3xl shadow-lg border-2 flex flex-col items-center text-center relative overflow-hidden"
            style={{
              backgroundColor: preset.bgColor,
              borderColor: preset.borderColor,
            }}
          >
            {/* Decorative background icon */}
            <motion.div
              className="absolute -right-4 -top-4 text-8xl opacity-10 transition-all duration-500 transform rotate-12"
              animate={{ rotate: [12, 20, 12] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {preset.icon}
            </motion.div>

            {/* Main content */}
            <motion.div
              className="text-5xl mb-4 relative z-10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {preset.icon}
            </motion.div>

            <h3
              className="text-2xl font-black text-hebrew-heading mb-2 relative z-10 break-words w-full"
              style={{ color: primaryColor }}
            >
              {displayTitle}
            </h3>

            <p className="text-stone-600 text-hebrew-body min-h-[1.5rem] relative z-10 break-words w-full">
              {displayGreeting}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <FooterBranding />
    </div>
  );
}
