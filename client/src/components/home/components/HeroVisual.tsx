"use client";

/**
 * HeroVisual Component
 * Hand image + phone frame with synchronized dodge animation.
 * Logical offsets keep the hand pointing at the phone in both directions.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMotionOk } from "@/lib/motion";
import { PhoneScreen } from "./PhoneScreen";

const HAND_FLOAT = { y: [0, -10, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } };
const HAND_STATIC = { y: 0 };
const HAND_POKE = { x: [0, 30, 30, 0], y: [0, -6, -6, 0], transition: { duration: 1.2, ease: "easeInOut" } };

export function HeroVisual(): JSX.Element {
  const t = useTranslations("home.hero");
  const motionOk = useMotionOk();

  const [isDodging, setIsDodging] = useState(false);
  const [poking, setPoking] = useState(false);
  const dodgeStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dodgeEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerPoke = useCallback(() => {
    if (!motionOk) return;
    if (dodgeStartTimeoutRef.current) clearTimeout(dodgeStartTimeoutRef.current);
    if (dodgeEndTimeoutRef.current) clearTimeout(dodgeEndTimeoutRef.current);

    setPoking(true);
    dodgeStartTimeoutRef.current = setTimeout(() => setIsDodging(true), 350);
    dodgeEndTimeoutRef.current = setTimeout(() => {
      setIsDodging(false);
      setPoking(false);
    }, 1100);
  }, [motionOk]);

  useEffect(() => {
    if (!motionOk) return;
    const interval = setInterval(triggerPoke, 4000);
    return () => {
      clearInterval(interval);
      if (dodgeStartTimeoutRef.current) clearTimeout(dodgeStartTimeoutRef.current);
      if (dodgeEndTimeoutRef.current) clearTimeout(dodgeEndTimeoutRef.current);
    };
  }, [triggerPoke, motionOk]);

  return (
    <motion.div
      initial={motionOk ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={motionOk ? { duration: 0.6, delay: 0.3 } : { duration: 0 }}
      className="relative w-full max-w-[340px] mx-auto h-[420px] lg:h-[500px] overflow-visible"
    >
      {/* Hand image — extends toward the outer edge, poking the phone */}
      <motion.div
        animate={motionOk ? (poking ? HAND_POKE : HAND_FLOAT) : HAND_STATIC}
        className="absolute bottom-[-170px] -end-[90%] md:-end-[110%] w-[160%] md:w-[180%] z-20 pointer-events-none ltr:-scale-x-100"
      >
        <Image
          src="/assets/images/hand.svg"
          alt={t("visualAlt")}
          width={400}
          height={100}
          priority
          className="w-full h-auto drop-shadow-lg"
        />
      </motion.div>

      {/* Phone frame — anchored on the edge nearest the text column */}
      <div className={`absolute top-0 start-0 w-[65%] h-full z-10 ${motionOk ? "hero-float" : ""}`}>
        <div className="bg-navy-950 rounded-[2rem] p-[5px] shadow-lift h-full relative">
          <div className="absolute top-[6px] start-1/2 -translate-x-1/2 w-[38%] h-[16px] bg-black rounded-full z-20" />
          <div className="absolute -end-[3px] top-[20%] w-[3px] h-5 bg-navy-700 rounded-s-sm" />
          <div className="absolute -end-[3px] top-[30%] w-[3px] h-5 bg-navy-700 rounded-s-sm" />
          <div className="rounded-[1.6rem] overflow-hidden bg-surface h-full">
            <PhoneScreen isDodging={isDodging} motionOk={motionOk} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
