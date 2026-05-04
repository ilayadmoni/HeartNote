"use client";

import { useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BatFigure } from "../components/BatFigure";
import { BarFigure } from "../components/BarFigure";
import { fireCandyShower } from "../components/fireCandyShower";
import { FooterBranding } from "@/components/templates/components";
import type { BarBatMitzvahData } from "../types";

interface BarBatMitzvahMobileProps {
  data: BarBatMitzvahData;
  primaryColor: string;
}

const CORAL = "#E28F79";
const NAVY = "#121721";

export function BarBatMitzvahMobile({ data, primaryColor }: BarBatMitzvahMobileProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [isThrowing, setIsThrowing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");

  const handleThrow = useCallback(() => {
    if (isThrowing || showMessage) return;
    setIsThrowing(true);
    fireCandyShower(canvasRef.current);
    setTimeout(() => {
      setShowMessage(true);
      setIsThrowing(false);
    }, 600);
  }, [isThrowing, showMessage]);

  const handleReset = useCallback(() => {
    setShowMessage(false);
  }, []);

  const mazalTitle = data.blessingTitle || "מזל טוב!";
  const mazalMessage =
    data.blessingMessage ||
    "שיהיה מסע ההתבגרות שלך מלא במתיקות, שמחה והצלחה.";
  const buttonLabel = showMessage ? "נסה שוב!" : "זרקו סוכריות!";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl flex flex-col items-center justify-between p-5 ${
        isCreateRoute ? "min-h-[450px]" : "min-h-screen"
      }`}
      style={{ backgroundColor: NAVY }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-50"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col items-center flex-1"
      >
        <h2
          className="text-2xl font-black text-center text-hebrew-heading mb-1 break-words w-full"
          style={{ color: "#F5F1EC" }}
        >
          {data.introTitle || "מכונת ההתבגרות"}
        </h2>
        <p className="text-center text-hebrew-body text-sm text-stone-400 mb-6 break-words">
          {data.introSubtitle || "לחצו על הכפתור כדי לזרוק סוכריות לחתן הבר מצווה!"}
        </p>

        <div className="relative flex-1 w-full flex items-center justify-center">
          <motion.div
            animate={{
              filter: showMessage ? "blur(6px)" : "blur(0px)",
              opacity: showMessage ? 0.45 : 1,
              scale: isThrowing ? 1.03 : 1,
            }}
            transition={{ duration: 0.4 }}
            className="w-full flex items-end justify-center"
          >
            <div className="scale-90">
              {data.kind === "bat" ? (
                <BatFigure onClick={handleThrow} primaryColor={primaryColor} />
              ) : (
                <BarFigure onClick={handleThrow} primaryColor={primaryColor} />
              )}
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
                className="absolute top-1/2 left-1/2 z-40 w-[90%]"
                style={{ maxWidth: 380 }}
              >
                <div className="rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-2xl px-6 py-6 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <span className="text-xl">✡︎</span>
                  </div>
                  <h3
                    className="text-3xl font-black text-hebrew-heading mb-3"
                    style={{ color: CORAL }}
                  >
                    {mazalTitle}
                  </h3>
                  <p className="text-sm text-hebrew-body text-stone-100/90 leading-relaxed">
                    {mazalMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={showMessage ? handleReset : handleThrow}
          disabled={isThrowing}
          whileHover={!isThrowing ? { scale: 1.04 } : {}}
          whileTap={!isThrowing ? { scale: 0.96 } : {}}
          className="w-full mt-6 px-6 py-3.5 text-base font-extrabold rounded-full text-white shadow-xl uppercase tracking-wide"
          style={{
            background: showMessage
              ? "rgba(255,255,255,0.12)"
              : `linear-gradient(135deg, ${CORAL} 0%, #D17560 100%)`,
            cursor: isThrowing ? "not-allowed" : "pointer",
          }}
        >
          {buttonLabel}
        </motion.button>
      </motion.div>

      <div className="mt-4 opacity-80">
        <FooterBranding />
      </div>
    </div>
  );
}
