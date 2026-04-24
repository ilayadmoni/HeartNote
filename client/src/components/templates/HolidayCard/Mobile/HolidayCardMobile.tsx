"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FooterBranding } from "@/components/templates/components";
import { HolidayEnvironment } from "../components/HolidayEnvironment";
import type { HolidayCardData } from "../../types";

interface HolidayCardMobileProps {
  data: HolidayCardData;
  primaryColor: string;
}

export function HolidayCardMobile({
  data,
  primaryColor,
}: HolidayCardMobileProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-4 ${
        isCreateRoute ? "min-h-[450px]" : "min-h-[650px]"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h2 className="text-2xl font-black text-center text-hebrew-heading mb-2">
          מפעל החגים שלנו
        </h2>
        <p className="text-center text-hebrew-body text-stone-600 mb-6 text-sm">
          בחרו חג והתאימו את הברכה לאהובים עליכם.
        </p>

        <div className="flex justify-center mb-6">
          <div className="w-full aspect-[3/4] max-w-sm">
            <HolidayEnvironment
              data={data}
              primaryColor={primaryColor}
              variant="mobile"
            />
          </div>
        </div>
      </motion.div>

      <FooterBranding />
    </div>
  );
}
