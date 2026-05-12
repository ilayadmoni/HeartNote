"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { RefObject } from "react";
import { usePathname } from "next/navigation";
import { FooterBranding } from "@/components/templates/components";
import { GroomFigure } from "../components/GroomFigure";
import { BrideFigure } from "../components/BrideFigure";
import { ShatteringGlass } from "../components/ShatteringGlass";
import type { WeddingGlassData } from "../../types";

interface WeddingGlassMobileProps {
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
  x: [0, -8, 7, -5, 4, -2, 0],
  y: [0, 3, -2, 2, -1, 0],
  rotate: [0, -0.5, 0.4, -0.3, 0.1, 0],
};

export function WeddingGlassMobile({
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
}: WeddingGlassMobileProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center p-4 ${
      isCreateRoute ? "min-h-[450px]" : "min-h-[650px]"
    }`}>
      <canvas
        ref={confettiCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-50"
      />

      {/* Fade-in once on mount — no key, no remount flash */}
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

        {/* Shake wrapper — key remount has no opacity-0 initial → no flash */}
        <motion.div
          key={shakeKey}
          animate={shakeKey > 0 ? shakeAnim : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full h-56 mb-6 border-b-4 border-cream pb-2 overflow-visible"
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
              <div className="absolute left-2 bottom-0 w-28 h-48">
                <GroomFigure isStomping={isStomping} />
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-16 h-20 z-10">
                <ShatteringGlass isShattered={isShattered} onShatterComplete={onShatterComplete} />
              </div>

              <div className="absolute right-2 bottom-0 w-32 h-48">
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
                  className="absolute top-1/2 left-1/2 z-50 w-[90%]"
                  style={{ maxWidth: 400 }}
                >
                  <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/50 shadow-xl px-5 py-4 text-center">
                    <h3 className="text-3xl font-black text-hebrew-heading mb-2" style={{ color: primaryColor }}>
                      {data.mazalTovTitle}
                    </h3>
                    <p className="text-sm text-hebrew-body text-stone-600">
                      {data.mazalTovMessage}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-4">
          <motion.button
            onClick={isShattered ? onReset : onStomp}
            disabled={isStomping}
            whileHover={!isStomping ? { scale: 1.05 } : {}}
            whileTap={!isStomping ? { scale: 0.95 } : {}}
            className="w-full px-6 py-3 text-base font-bold rounded-full text-white transition-all shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: primaryColor,
              cursor: isStomping ? "not-allowed" : "pointer",
            }}
          >
            {isShattered ? "נסה שוב!" : (data.stompButtonLabel || "שבור את הכוס!")}
          </motion.button>
        </div>
      </motion.div>

      <div className="mt-8">
        <FooterBranding />
      </div>
    </div>
  );
}
