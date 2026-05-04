"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BatFigure } from "../components/BatFigure";
import { BarFigure } from "../components/BarFigure";
import { fireCandyShower } from "../components/fireCandyShower";
import {
  BackToGallery,
  FooterBranding,
  TemplateResetButton,
} from "@/components/templates/components";
import type { BarBatMitzvahData } from "../types";

interface BarBatMitzvahDesktopProps {
  data: BarBatMitzvahData;
  primaryColor: string;
}

export function BarBatMitzvahDesktop({
  data,
  primaryColor,
}: BarBatMitzvahDesktopProps) {
  const [showGreeting, setShowGreeting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleReveal = useCallback(() => {
    fireCandyShower(canvasRef.current);
    setTimeout(() => setShowGreeting(true), 500);
  }, []);

  const introTitle = data.introTitle || "מכונת ההתבגרות";
  const introSubtitle =
    data.introSubtitle || "לחצו על הכתר או הספר כדי לגלות את הברכה";
  const tapHintLabel =
    data.tapHintLabel ||
    (data.kind === "bat" ? "לחצו על הכתר" : "לחצו על הספר");

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-50"
      />
      <BackToGallery />

      <div className="flex-1 flex flex-col items-center justify-center">
        <h1
          className="text-3xl font-bold text-center mb-4 text-hebrew-heading break-words w-full"
          style={{ color: primaryColor }}
        >
          {introTitle}
        </h1>
        <p
          className="text-lg text-center mb-8 text-hebrew-body break-words w-full"
          style={{ color: primaryColor, opacity: 0.75 }}
        >
          {introSubtitle}
        </p>

        <div className="relative w-full h-80 flex items-center justify-center border-b-2 border-cream pb-6 mb-6">
          <AnimatePresence mode="wait">
            {!showGreeting && data.kind === "bat" && (
              <motion.div
                key="bat"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <BatFigure
                  onClick={handleReveal}
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
              >
                <BarFigure
                  onClick={handleReveal}
                  primaryColor={primaryColor}
                />
              </motion.div>
            )}

            {!showGreeting && (
              <motion.div
                className="absolute top-8 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md"
                style={{ backgroundColor: primaryColor }}
                animate={{ y: [0, -8, 0] }}
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
                className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-2xl shadow-2xl p-8 overflow-hidden"
              >
                {/* Colored accent bar at top */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
                  style={{ backgroundColor: primaryColor }}
                />

                <button
                  onClick={() => setShowGreeting(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-dark" />
                </button>

                <h3
                  className="text-4xl font-black mb-3 text-hebrew-heading text-center break-words w-full"
                  style={{ color: primaryColor }}
                >
                  {data.blessingTitle || "הגיע הזמן לחגוג! 🎉"}
                </h3>

                <div
                  className="w-12 h-0.5 mb-5 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />

                <p className="text-xl text-slate-600 text-center text-hebrew-body leading-relaxed break-words w-full">
                  {data.blessingMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Explicit reset — visible when greeting/blessing panel is open */}
        {showGreeting && (
          <div className="flex justify-center mt-4">
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
