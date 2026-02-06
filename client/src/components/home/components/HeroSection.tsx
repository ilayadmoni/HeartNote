"use client";

/**
 * HeroSection Component
 * Welcome section with factory illustration
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Settings } from "lucide-react";
import {
  HERO_BADGE,
  HERO_TITLE_LINE1,
  HERO_TITLE_LINE2,
  HERO_DESCRIPTION,
  HERO_DESCRIPTION_2,
  HERO_CTA,
} from "../constants";
import { FactoryIllustration } from "./FactoryIllustration";
import type { HeroSectionProps } from "../types";

export function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <section
      className={`relative py-16 lg:py-24 px-4 overflow-hidden ${className}`}
    >
      {/* Background Decorative Gears */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 opacity-15">
        <Settings size={300} className="animate-spin-slow text-[#415A77]" />
      </div>
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 opacity-15">
        <Settings
          size={250}
          className="animate-spin-slow-reverse text-[#1B263B]"
        />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Right Side: Text Content (RTL) */}
          <div className="flex-1 text-center lg:text-right z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg lg:text-xl text-[#2e3c52] dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-hebrew-body"
            >
              {HERO_DESCRIPTION}
              <br />
              {HERO_DESCRIPTION_2}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold text-white bg-[#d4826f] hover:bg-[#c4735f] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-hebrew-heading"
              >
                {HERO_CTA}
                <ArrowLeft size={20} />
              </Link>
            </motion.div>
          </div>

          {/* Left Side: Factory Illustration */}
          <div className="flex-1 w-full max-w-lg lg:max-w-xl">
            <FactoryIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
