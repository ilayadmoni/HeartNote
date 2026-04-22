"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FooterBranding } from "@/components/templates/components";
import { HOLIDAY_PRESETS } from "../constants/holidays";
import type { HolidayCardData } from "../../types";

interface HolidayCardMobileProps {
  data: HolidayCardData;
  primaryColor: string;
}

export function HolidayCardMobile({
  data,
  primaryColor,
}: HolidayCardMobileProps) {
  const preset = HOLIDAY_PRESETS[data.holidayKind];
  const displayTitle = data.customTitle || preset.defaultTitle;
  const displayGreeting = data.customGreeting || preset.defaultGreeting;

  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center p-4 ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[650px]'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h2 className="text-2xl font-black text-center text-hebrew-heading mb-2">
          מפעל החגים שלנו
        </h2>
        <p className="text-center text-hebrew-body text-stone-600 mb-8 text-sm">
          בחרו חג והתאימו את הברכה לאהובים עליכם.
        </p>

        {/* Holiday Card */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xs p-8 rounded-3xl shadow-lg border-2 flex flex-col items-center text-center relative overflow-hidden"
            style={{
              backgroundColor: preset.bgColor,
              borderColor: preset.borderColor,
            }}
          >
            {/* Decorative background icon */}
            <motion.div
              className="absolute -right-3 -top-3 text-6xl opacity-10 transition-all duration-500 transform rotate-12"
              animate={{ rotate: [12, 20, 12] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {preset.icon}
            </motion.div>

            {/* Main content */}
            <motion.div
              className="text-4xl mb-3 relative z-10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {preset.icon}
            </motion.div>

            <h3
              className="text-xl font-black text-hebrew-heading mb-2 relative z-10 break-words w-full"
              style={{ color: primaryColor }}
            >
              {displayTitle}
            </h3>

            <p className="text-stone-600 text-hebrew-body text-sm min-h-[1.5rem] relative z-10 break-words w-full">
              {displayGreeting}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <FooterBranding />
    </div>
  );
}
