"use client";

/**
 * FactoryIllustration Component
 * Animated conveyor belt illustration for the hero section
 */

import { motion } from "framer-motion";
import { Gift, Layers, Heart } from "lucide-react";

export function FactoryIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
    >
      {/* Machine Dots Header */}
      <div className="flex justify-center gap-2 mb-6 opacity-30">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-12 h-2 rounded-full bg-[#2e3c52]" />
        ))}
      </div>

      <div className="h-56 flex flex-col items-center justify-center relative">
        {/* Floating Items on Belt */}
        <div className="flex justify-between w-full px-4 absolute top-4 z-10">
          <div className="animate-float bg-[#F2E9E4] dark:bg-gray-700 p-3 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600">
            <Gift className="text-[#2e3c52] dark:text-white h-8 w-8" />
          </div>
          <div
            className="animate-float bg-[#F2E9E4] dark:bg-gray-700 p-3 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600"
            style={{ animationDelay: "0.5s" }}
          >
            <Layers className="text-[#2e3c52] dark:text-gray-300 h-8 w-8" />
          </div>
          <div
            className="animate-float bg-[#F2E9E4] dark:bg-gray-700 p-3 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600"
            style={{ animationDelay: "1s" }}
          >
            <Heart className="text-[#d4826f] h-8 w-8" />
          </div>
        </div>

        {/* Processing Area */}
        <div className="w-full h-24 bg-[#F2E9E4] dark:bg-gray-700 rounded-2xl border-2 border-dashed border-[#2e3c52]/30 mt-16 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-gray-600/50 to-transparent animate-pulse" />
          <span className="text-[#2e3c52] dark:text-gray-300 font-bold z-20 bg-white dark:bg-gray-800 px-4 py-1 rounded shadow-sm text-hebrew-heading">
            ...Processing
          </span>
        </div>

        {/* Conveyor Belt */}
        <div className="w-full h-3 bg-gray-300 dark:bg-gray-600 mt-6 rounded-full relative overflow-hidden border border-gray-400 dark:border-gray-500">
          <div className="absolute inset-0 conveyor-belt opacity-50" />
        </div>

        {/* Finished Product Label */}
        <div className="absolute -bottom-4 left-4 bg-[#2e3c52] text-white px-4 py-2 rounded-t-xl text-sm font-bold shadow-lg transform rotate-3 text-hebrew-heading">
          תוצאה מושלמת!
        </div>
      </div>
    </motion.div>
  );
}
