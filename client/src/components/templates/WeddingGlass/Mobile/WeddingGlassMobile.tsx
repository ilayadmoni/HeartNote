"use client";

import { motion } from "framer-motion";
import { BackToGallery, FooterBranding, TemplateResetButton } from "@/components/templates/components";
import { GroomFigure } from "../components/GroomFigure";
import { BrideFigure } from "../components/BrideFigure";
import { GlassWithShards } from "../components/GlassWithShards";
import type { WeddingGlassData } from "../../types";

interface WeddingGlassMobileProps {
  data: WeddingGlassData;
  primaryColor: string;
  isShattered: boolean;
  showMessage: boolean;
  onStomp: () => void;
  onShatterComplete: () => void;
  onReset: () => void;
}

export function WeddingGlassMobile({
  data,
  primaryColor,
  isShattered,
  showMessage,
  onStomp,
  onShatterComplete,
  onReset,
}: WeddingGlassMobileProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <BackToGallery />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h2
          className="text-2xl font-black text-center text-hebrew-heading mb-2 break-words w-full"
          style={{ color: primaryColor }}
        >
          {data.title || "שבירת כוס דיגיטלית"}
        </h2>
        <p className="text-center text-hebrew-body text-sm text-stone-600 mb-6 break-words">
          {data.subtitle || "לחצו על הכפתור כדי שהחתן ישבור את הכוס!"}
        </p>

        {/* Main Illustration Area */}
        <div className="relative w-full flex justify-center items-end h-56 mb-6 border-b-4 border-cream pb-2 overflow-visible">
          {/* Groom (Left) */}
          <div className="absolute left-0 bottom-0 w-24 h-44">
            <GroomFigure isAnimating={isShattered} />
          </div>

          {/* Glass (Center) */}
          <GlassWithShards isShattered={isShattered} onShatterComplete={onShatterComplete} />

          {/* Bride (Right) */}
          <div className="absolute right-0 bottom-0 w-28 h-44">
            <BrideFigure />
          </div>
        </div>

        {/* Button and Message */}
        <div className="flex flex-col items-center gap-4">
          <motion.button
            onClick={onStomp}
            disabled={isShattered}
            whileHover={!isShattered ? { scale: 1.05 } : {}}
            whileTap={!isShattered ? { scale: 0.95 } : {}}
            className="w-full px-6 py-3 text-base font-bold rounded-full text-white transition-all shadow-lg"
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
            className="text-center w-full"
          >
            {showMessage && (
              <>
                <h3 className="text-3xl font-black text-hebrew-heading mb-2" style={{ color: primaryColor }}>
                  {data.mazalTovTitle}
                </h3>
                <p className="text-sm text-hebrew-body text-stone-600 mb-4">
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
