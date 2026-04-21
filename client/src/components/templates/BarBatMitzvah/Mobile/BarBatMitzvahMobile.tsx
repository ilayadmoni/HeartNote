"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BatFigure } from "../components/BatFigure";
import { BarFigure } from "../components/BarFigure";
import {
  FooterBranding,
  TemplateResetButton,
} from "@/components/templates/components";
import type { BarBatMitzvahData } from "../types";

interface BarBatMitzvahMobileProps {
  data: BarBatMitzvahData;
  primaryColor: string;
}

export function BarBatMitzvahMobile({
  data,
  primaryColor,
}: BarBatMitzvahMobileProps) {
  const [showGreeting, setShowGreeting] = useState(false);

  const introTitle = data.introTitle || "מכונת ההתבגרות";
  const introSubtitle =
    data.introSubtitle || "לחצו על הכתר או הספר כדי לגלות את הברכה";
  const tapHintLabel =
    data.tapHintLabel ||
    (data.kind === "bat" ? "לחצו על הכתר" : "לחצו על הספר");

  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');

  return (
    <div className={`relative w-full bg-white rounded-3xl shadow-lg border border-cream p-6 flex flex-col items-center ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-screen'
    }`}>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <h1
          className="text-2xl font-bold text-center mb-3 text-hebrew-heading break-words w-full"
          style={{ color: primaryColor }}
        >
          {introTitle}
        </h1>
        <p
          className="text-base text-center mb-6 text-hebrew-body break-words w-full"
          style={{ color: primaryColor, opacity: 0.75 }}
        >
          {introSubtitle}
        </p>

        <div className="relative w-full h-64 flex items-center justify-center border-b-2 border-cream pb-4 mb-4">
          <AnimatePresence mode="wait">
            {!showGreeting && data.kind === "bat" && (
              <motion.div
                key="bat"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="scale-75"
              >
                <BatFigure
                  onClick={() => setShowGreeting(true)}
                  primaryColor={primaryColor}
                />
              </motion.div>
            )}

            {!showGreeting && data.kind === "bar" && (
              <motion.div
                key="bar"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="scale-75"
              >
                <BarFigure
                  onClick={() => setShowGreeting(true)}
                  primaryColor={primaryColor}
                />
              </motion.div>
            )}

            {!showGreeting && (
              <motion.div
                className="absolute top-2 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md"
                style={{ backgroundColor: primaryColor }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {tapHintLabel}
              </motion.div>
            )}

            {showGreeting && (
              <motion.div
                key="greeting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-xl shadow-2xl p-6 overflow-hidden"
              >
                {/* Colored accent bar at top */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl"
                  style={{ backgroundColor: primaryColor }}
                />

                <button
                  onClick={() => setShowGreeting(false)}
                  className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-dark" />
                </button>

                <h3
                  className="text-2xl font-black mb-2 text-hebrew-heading text-center break-words w-full"
                  style={{ color: primaryColor }}
                >
                  {data.blessingTitle || "הגיע הזמן לחגוג! 🎉"}
                </h3>

                <div
                  className="w-10 h-0.5 mb-4 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />

                <p className="text-sm text-slate-600 text-center text-hebrew-body leading-relaxed break-words w-full">
                  {data.blessingMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Explicit reset — visible when greeting/blessing panel is open */}
        {showGreeting && (
          <div className="flex justify-center mt-3">
            <TemplateResetButton
              onClick={() => setShowGreeting(false)}
              label="חזור להתחלה"
            />
          </div>
        )}
      </div>

      <FooterBranding />
    </div>
  );
}
