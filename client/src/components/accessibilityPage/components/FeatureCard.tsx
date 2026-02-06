"use client";

/**
 * FeatureCard Component
 * Displays a single accessibility feature
 */

import { motion } from "framer-motion";
import {
  Keyboard,
  Eye,
  MousePointer2,
  Volume2,
  Monitor,
  Smartphone,
} from "lucide-react";
import type { AccessibilityFeature } from "../types";

interface FeatureCardProps {
  feature: AccessibilityFeature;
  index: number;
}

const iconMap = {
  keyboard: Keyboard,
  eye: Eye,
  mouse: MousePointer2,
  volume: Volume2,
  monitor: Monitor,
  smartphone: Smartphone,
};

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = iconMap[feature.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#d4826f]/10 dark:bg-[#e8917a]/10 flex items-center justify-center">
          <Icon size={24} className="text-[#d4826f] dark:text-[#e8917a]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
            {feature.title}
          </h3>
          <p className="text-[#2e3c52] dark:text-gray-300 text-sm text-hebrew-body leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
