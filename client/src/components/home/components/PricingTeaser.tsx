"use client";

/**
 * PricingTeaser Component
 * Upgrade call-to-action section
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, ArrowLeft } from "lucide-react";
import {
  PRICING_BADGE,
  PRICING_TITLE,
  PRICING_TITLE_HIGHLIGHT,
  PRICING_TITLE_END,
  PRICING_DESCRIPTION,
  PRICING_CTA,
} from "../constants";
import type { PricingTeaserProps } from "../types";

export function PricingTeaser({ className = "" }: PricingTeaserProps) {
  return (
    <section
      className={`py-20 px-4 bg-[#F2E9E4] dark:bg-gray-800 text-center relative overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#1B263B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-sm mb-6 border border-gray-100 dark:border-gray-600"
        >
          <Crown size={16} className="text-[#d4826f] dark:text-[#e8917a]" />
          <span className="text-sm font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
            {PRICING_BADGE}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl lg:text-5xl font-black text-[#2e3c52] dark:text-white mb-6 text-hebrew-heading"
        >
          {PRICING_TITLE}{" "}
          <span className="text-[#2e3c52] dark:text-white">
            {PRICING_TITLE_HIGHLIGHT}
          </span>{" "}
          {PRICING_TITLE_END}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[#2e3c52] dark:text-gray-300 mb-10 max-w-2xl mx-auto text-hebrew-body"
        >
          {PRICING_DESCRIPTION}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold text-white bg-[#2e3c52] hover:bg-[#415A77] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-hebrew-heading"
          >
            {PRICING_CTA}
            <ArrowLeft size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
