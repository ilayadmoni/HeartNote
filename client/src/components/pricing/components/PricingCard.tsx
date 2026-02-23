"use client";

/**
 * PricingCard Component
 * Individual pricing plan card with features
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import type { PricingCardProps } from "../types";

export function PricingCard({ plan, index }: PricingCardProps) {
  const isComingSoon = !!plan.badge;
  const isFree = plan.price === 0;

  const baseCardStyles = plan.isFeatured
    ? "bg-[#d4826f] text-white shadow-2xl scale-105 z-10"
    : "bg-white dark:bg-gray-800 text-[#2e3c52] dark:text-white shadow-lg";

  const featureTextStyles = plan.isFeatured
    ? "text-white/90"
    : "text-[#2e3c52] dark:text-gray-300";

  const buttonStyles = plan.isFeatured
    ? "bg-white text-[#d4826f] hover:bg-gray-100"
    : "bg-transparent border-2 border-[#2e3c52] dark:border-gray-400 text-[#2e3c52] dark:text-gray-200 hover:border-[#d4826f] hover:text-[#d4826f] dark:hover:border-[#e8917a] dark:hover:text-[#e8917a]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`relative rounded-3xl p-8 transition-all duration-300 ${baseCardStyles} ${isComingSoon ? "opacity-60" : ""}`}
    >
      {/* Coming Soon Badge */}
      {isComingSoon && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold text-hebrew-heading shadow-lg flex items-center gap-1.5 border border-amber-400/30 z-10">
          <span>🔒</span>
          <span>{plan.badge}</span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-xl font-bold text-center mb-4 text-hebrew-heading">
        {plan.name}
      </h3>

      {/* Price */}
      <div className="text-center mb-6">
        <span className="text-5xl font-black text-hebrew-heading">
          {plan.price}
        </span>
        <span className="text-2xl font-bold mr-1 text-hebrew-heading">₪</span>
        {plan.period && (
          <p className={`text-sm mt-1 ${featureTextStyles} text-hebrew-body`}>
            {plan.period}
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature.id} className="flex items-center gap-3 justify-end">
            <span className={`text-sm ${featureTextStyles} text-hebrew-body`}>
              {feature.text}
            </span>
            {feature.included ? (
              <Check
                size={18}
                className={plan.isFeatured ? "text-white" : "text-[#d4826f]"}
              />
            ) : (
              <Lock
                size={16}
                className={plan.isFeatured ? "text-white/50" : "text-gray-400"}
              />
            )}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      {isFree ? (
        <Link href="/gallery" className="block w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-6 rounded-full font-bold transition-all duration-200 text-hebrew-heading ${buttonStyles}`}
          >
            {plan.ctaText}
          </motion.button>
        </Link>
      ) : (
        <button
          disabled
          className="w-full py-3 px-6 rounded-full font-bold text-hebrew-heading bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
        >
          {plan.ctaText}
        </button>
      )}
    </motion.div>
  );
}
