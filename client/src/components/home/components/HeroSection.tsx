"use client";

/**
 * HeroSection Component
 * Welcome section with factory illustration
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Settings } from "lucide-react";
import { useAccessibility } from "@/components/accessibility";
import {
  HERO_BADGE,
  HERO_TITLE_LINE1,
  HERO_TITLE_LINE2,
  HERO_DESCRIPTION,
  HERO_DESCRIPTION_2,
  HERO_CTA,
  HERO_CTA_SECONDARY,
} from "../constants";
import { HeroVisual } from "./HeroVisual";
import type { HeroSectionProps } from "../types";

export function HeroSection({ className = "" }: HeroSectionProps) {
  const { settings } = useAccessibility();
  const shouldAnimate = !settings.stopAnimations;

  return (
    <section className={`relative py-8  px-4 overflow-hidden ${className}`}>
      {/* Background Decorative Gears */}
      <div className="absolute top-0  left-0 -ml-20 -mt-20 opacity-15 pointer-events-none">
        <Settings 
          size={300} 
          className={`text-[#415A77] ${shouldAnimate ? "animate-spin-slow" : ""}`} 
        />
      </div>
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 opacity-15 pointer-events-none">
        <Settings
          size={250}
          className={`text-[#1B263B] ${shouldAnimate ? "animate-spin-slow-reverse" : ""}`}
        />
      </div>

      <div className="w-full px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 lg:justify-between">
          {/* Right Side: Text Content (RTL) */}
          <div className="flex-1 text-center lg:text-right relative z-30 mb-12 lg:mb-0">
            {/* Badge */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldAnimate ? { duration: 0.5 } : { duration: 0 }}
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm mb-6 border border-gray-100 dark:border-gray-700"
            >
              <Sparkles
                size={16}
                className="text-[#d4826f] dark:text-[#e8917a]"
              />
              <span className="text-sm font-semibold text-[#2e3c52] dark:text-gray-300 text-hebrew-heading">
                {HERO_BADGE}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldAnimate ? { duration: 0.5, delay: 0.1 } : { duration: 0 }}
              className="text-4xl lg:text-6xl font-black leading-tight text-[#2e3c52] dark:text-white mb-6 text-hebrew-heading"
            >
              {HERO_TITLE_LINE1}
              <br />
              <span className="relative">
                {HERO_TITLE_LINE2}
                <svg
                  className="absolute w-full h-3 -bottom-1 right-0 text-[#d4826f] dark:text-[#e8917a] opacity-60"
                  viewBox="0 0 200 9"
                  fill="none"
                >
                  <path
                    d="M2 7C48 3 135 -2 198 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldAnimate ? { duration: 0.5, delay: 0.2 } : { duration: 0 }}
              className="text-lg lg:text-xl text-[#2e3c52] dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-hebrew-body"
            >
              {HERO_DESCRIPTION}
              <br />
              {HERO_DESCRIPTION_2}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldAnimate ? { duration: 0.5, delay: 0.3 } : { duration: 0 }}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start relative z-20"
            >
              <Link
                href="/gallery"
                className={`flex items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full text-lg font-bold text-white bg-[#d4826f] hover:bg-[#c4735f] shadow-xl hover:shadow-2xl text-hebrew-heading whitespace-nowrap transition-all duration-300 ${shouldAnimate ? "hover:scale-105" : ""}`}
              >
                {HERO_CTA}
                <ArrowLeft size={20} />
              </Link>

              <Link
                href="/demo"
                className={`flex items-center justify-center w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full text-lg font-bold border border-[#d4826f] text-[#d4826f] dark:text-[#e8917a] dark:border-[#e8917a] bg-white/80 dark:bg-gray-800/80 hover:bg-[#f8ece8] dark:hover:bg-gray-700 text-hebrew-heading whitespace-nowrap transition-all duration-300 ${shouldAnimate ? "hover:scale-105" : ""}`}
              >
                {HERO_CTA_SECONDARY}
              </Link>
            </motion.div>
          </div>

          {/* Left Side: Hand + Phone Visual */}
          <div className="flex-1 w-full max-w-[360px] mx-auto lg:mx-0 lg:max-w-none lg:flex lg:justify-start">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
