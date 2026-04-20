"use client";

import { motion } from "framer-motion";
import { BackToGallery, FooterBranding, TemplateResetButton } from "@/components/templates/components";
import { GroomFigure } from "../components/GroomFigure";
import { BrideFigure } from "../components/BrideFigure";
import { GlassWithShards } from "../components/GlassWithShards";
import type { WeddingGlassData } from "../../types";

interface WeddingGlassDesktopProps {
  data: WeddingGlassData;
  primaryColor: string;
  isShattered: boolean;
  showMessage: boolean;
  onStomp: () => void;
  onShatterComplete: () => void;
  onReset: () => void;
}

export function WeddingGlassDesktop({
  data,
  primaryColor,
  isShattered,
  showMessage,
  onStomp,
  onShatterComplete,
  onReset,
}: WeddingGlassDesktopProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      <BackToGallery />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <h2
          className="text-4xl font-black text-center text-hebrew-heading mb-4 break-words w-full"
          style={{ color: primaryColor }}
        >
          {data.title || "שבירת כוס דיגיטלית"}
        </h2>
        <p className="text-center text-hebrew-body text-stone-600 mb-12 break-words">
          {data.subtitle || "לחצו על הכפתור כדי שהחתן ישבור את הכוס ויתחיל את החגיגה!"}
        </p>

        {/* Main Illustration Area */}
        <div className="relative w-full max-w-lg mx-auto flex justify-center items-end h-72 mb-8 border-b-4 border-cream pb-2 overflow-visible">
          {/* Groom (Left) */}
          <div className="absolute left-4 bottom-0 w-40 h-64">
            <GroomFigure isAnimating={isShattered} />
          </div>

          {/* Glass (Center) */}
          <GlassWithShards isShattered={isShattered} onShatterComplete={onShatterComplete} />

          {/* Bride (Right) */}
          <div className="absolute right-4 md:right-8 bottom-0 w-44 h-64">
            <BrideFigure />
          </div>
        </div>

        {/* Button */}
        <div className="flex flex-col items-center gap-6">
          <motion.button
            onClick={onStomp}
            disabled={isShattered}
            whileHover={!isShattered ? { scale: 1.05 } : {}}
            whileTap={!isShattered ? { scale: 0.95 } : {}}
            className="px-8 py-4 text-lg font-bold rounded-full text-white transition-all shadow-lg"
            style={{
              backgroundColor: isShattered ? "#9ca3af" : primaryColor,
              cursor: isShattered ? "not-allowed" : "pointer",
              opacity: isShattered ? 0.5 : 1,
            }}
          >
            {data.stompButtonLabel || "שבור את הכוס!"}
          </motion.button>

          {/* Mazal Tov Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showMessage ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {showMessage && (
              <>
                <h3 className="text-5xl font-black text-hebrew-heading mb-2" style={{ color: primaryColor }}>
                  {data.mazalTovTitle}
                </h3>
                <p className="text-lg text-hebrew-body text-stone-600 mb-6 max-w-md">
                  {data.mazalTovMessage}
                </p>
                <TemplateResetButton onClick={onReset} label="לסדר את הבלאגן (נסה שוב)" />
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      <FooterBranding />
    </div>
  );
}
