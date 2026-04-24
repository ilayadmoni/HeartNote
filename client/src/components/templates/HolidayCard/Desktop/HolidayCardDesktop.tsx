"use client";

import { motion } from "framer-motion";
import { BackToGallery, FooterBranding } from "@/components/templates/components";
import { HolidayEnvironment } from "../components/HolidayEnvironment";
import type { HolidayCardData } from "../../types";

interface HolidayCardDesktopProps {
  data: HolidayCardData;
  primaryColor: string;
}

export function HolidayCardDesktop({
  data,
  primaryColor,
}: HolidayCardDesktopProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      <BackToGallery />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <h2 className="text-4xl font-black text-center text-hebrew-heading mb-4">
          מפעל החגים שלנו
        </h2>
        <p className="text-center text-hebrew-body text-stone-600 mb-8">
          בחרו חג והתאימו את הברכה לאהובים עליכם.
        </p>

        <div className="flex justify-center mb-10">
          <div className="w-full aspect-[4/3] max-h-[560px]">
            <HolidayEnvironment
              data={data}
              primaryColor={primaryColor}
              variant="desktop"
            />
          </div>
        </div>
      </motion.div>

      <FooterBranding />
    </div>
  );
}
