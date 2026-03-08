"use client";

/**
 * HeroVisual Component
 * Hand image + phone frame with synchronized dodge animation
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAccessibility } from "@/components/accessibility";
import { PhoneScreen } from "./PhoneScreen";

const HAND_FLOAT = {
  y: [0, -10, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};

const HAND_STATIC = {
  y: 0,
};

const HAND_POKE = {
  x: [0, 30, 30, 0],
  y: [0, -6, -6, 0],
  transition: { duration: 1.2, ease: "easeInOut" },
};

export function HeroVisual() {
  const { settings } = useAccessibility();
  const shouldAnimate = !settings.stopAnimations;
  
  const [isDodging, setIsDodging] = useState(false);
  const [poking, setPoking] = useState(false);

  const triggerPoke = useCallback(() => {
    if (!shouldAnimate) return; // Don't poke if animations are disabled
    setPoking(true);
    setTimeout(() => setIsDodging(true), 350);
    setTimeout(() => {
      setIsDodging(false);
      setPoking(false);
    }, 1100);
  }, [shouldAnimate]);

  useEffect(() => {
    if (!shouldAnimate) return; // Don't start interval if animations are disabled
    const interval = setInterval(triggerPoke, 4000);
    return () => clearInterval(interval);
  }, [triggerPoke, shouldAnimate]);

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={shouldAnimate ? { duration: 0.6, delay: 0.3 } : { duration: 0 }}
      className="relative w-full max-w-[340px] mx-auto h-[420px] lg:h-[500px]"
    >
      {/* Hand image — bottom-left, overlapping phone, larger and entering from corner */}
      <motion.div
        animate={shouldAnimate ? (poking ? HAND_POKE : HAND_FLOAT) : HAND_STATIC}
        className="absolute bottom-[-170px] md:bottom-[-170px] -left-[90%] md:-left-[110%] w-[160%] md:w-[180%] z-20 pointer-events-none"
      >
        <Image
          src="/assets/images/hand.svg"
          alt="Pointing hand"
          width={400}
          height={100}
          priority
          className="w-full h-auto drop-shadow-lg"
        />
      </motion.div>

      {/* Phone frame — right side */}
      <div className={`absolute top-0 right-0 w-[65%] h-full z-10 ${shouldAnimate ? "hero-float" : ""}`}>
        <div className="bg-[#1a1a1a] rounded-[2rem] p-[5px] shadow-2xl h-full relative">
          {/* Notch */}
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[38%] h-[16px] bg-black rounded-full z-20" />
          {/* Side buttons */}
          <div className="absolute -right-[3px] top-[20%] w-[3px] h-5 bg-[#444] rounded-l-sm" />
          <div className="absolute -right-[3px] top-[30%] w-[3px] h-5 bg-[#444] rounded-l-sm" />
          {/* Screen */}
          <div className="rounded-[1.6rem] overflow-hidden bg-white h-full">
            <PhoneScreen isDodging={isDodging} shouldAnimate={shouldAnimate} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
