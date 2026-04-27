"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { RefObject } from "react";
import { BackToGallery, FooterBranding } from "@/components/templates/components";
import { GroomFigure } from "../components/GroomFigure";
import { BrideFigure } from "../components/BrideFigure";
import { ShatteringGlass } from "../components/ShatteringGlass";
import type { WeddingGlassData } from "../../types";

interface WeddingGlassDesktopProps {
  data: WeddingGlassData;
  primaryColor: string;
  isStomping: boolean;
  isShattered: boolean;
  showMessage: boolean;
  shakeKey: number;
  confettiCanvasRef: RefObject<HTMLCanvasElement>;
  onStomp: () => void;
  onShatterComplete: () => void;
  onReset: () => void;
}

const shakeAnim = {
  x: [0, -10, 9, -7, 6, -3, 0],
  y: [0, 4, -3, 3, -2, 1, 0],
  rotate: [0, -0.6, 0.5, -0.4, 0.2, 0],
};

export function WeddingGlassDesktop({
  data,
  primaryColor,
  isStomping,
  isShattered,
  showMessage,
  shakeKey,
  confettiCanvasRef,
  onStomp,
  onShatterComplete,
  onReset,
}: WeddingGlassDesktopProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      <canvas
        ref={confettiCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-50"
      />
      <BackToGallery />

      {/* Fade-in once on mount — no key, no remount flash */}
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

        {/* Shake wrapper — key remount has no opacity-0 initial → no flash */}
        <motion.div
          key={shakeKey}
          animate={shakeKey > 0 ? shakeAnim : {}}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative w-full max-w-lg mx-auto h-80 mb-8 border-b-4 border-cream pb-2 overflow-visible"
        >
          {/* Stage: single positioning context for both figures and overlay */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <motion.div
              animate={{
                filter: showMessage ? "blur(6px)" : "blur(0px)",
                opacity: showMessage ? 0.5 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <div className="absolute left-4 bottom-0 w-72 h-96">
                <GroomFigure isStomping={isStomping} />
              </div>

              <div className="absolute left-[45%] -translate-x-1/2 bottom-1 w-24 h-28 z-10">
                <ShatteringGlass isShattered={isShattered} onShatterComplete={onShatterComplete} />
              </div>

              <div className="absolute right-4 md:right-8 bottom-0 w-72 h-96">
                <BrideFigure />
              </div>
            </motion.div>

            <AnimatePresence>
              {showMessage && (
                <motion.div
                  key="mazal-overlay"
                  initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
                  animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                  exit={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-1/2 left-1/2 z-50 w-[80%]"
                  style={{ maxWidth: 448 }}
                >
                  <div className="rounded-3xl bg-white/60 backdrop-blur-md border border-white/50 shadow-xl px-8 py-6 text-center">
                    <h3 className="text-5xl font-black text-hebrew-heading mb-2" style={{ color: primaryColor }}>
                      {data.mazalTovTitle}
                    </h3>
                    <p className="text-lg text-hebrew-body text-stone-600">
                      {data.mazalTovMessage}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-6">
          <motion.button
            onClick={isShattered ? onReset : onStomp}
            disabled={isStomping}
            whileHover={!isStomping ? { scale: 1.05 } : {}}
            whileTap={!isStomping ? { scale: 0.95 } : {}}
            className="px-8 py-4 text-lg font-bold rounded-full text-white transition-all shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: primaryColor,
              cursor: isStomping ? "not-allowed" : "pointer",
            }}
          >
            {isShattered ? "שבור שוב!" : (data.stompButtonLabel || "שבור את הכוס!")}
          </motion.button>
        </div>
      </motion.div>

      <FooterBranding />
    </div>
  );
}
