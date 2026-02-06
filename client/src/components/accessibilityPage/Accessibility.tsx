"use client";

/**
 * Accessibility Component
 * Main accessibility statement page content
 */

import { Settings } from "lucide-react";
import { AccessibilityHeader, FeatureCard, ContactSection } from "./components";
import { ACCESSIBILITY_INTRO, ACCESSIBILITY_FEATURES } from "./constants";
import type { AccessibilityProps } from "./types";

export function Accessibility({ className = "" }: AccessibilityProps) {
  return (
    <section
      className={`relative py-16 lg:py-24 px-4 min-h-screen bg-[#faf7f5] dark:bg-gray-900 ${className}`}
    >
      {/* Background Decorative Gears */}
      <div className="absolute top-20 left-10 opacity-15 pointer-events-none">
        <Settings size={180} className="animate-spin-slow text-[#2e3c52]" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-15 pointer-events-none">
        <Settings
          size={150}
          className="animate-spin-slow-reverse text-[#2e3c52]"
        />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <AccessibilityHeader />

        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-md mb-8">
          <p className="text-[#2e3c52] dark:text-gray-300 text-lg leading-relaxed text-hebrew-body whitespace-pre-line">
            {ACCESSIBILITY_INTRO}
          </p>
        </div>

        {/* Features Grid */}
        <h2 className="text-2xl font-bold text-[#2e3c52] dark:text-white mb-6 text-hebrew-heading">
          תכונות נגישות באתר
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {ACCESSIBILITY_FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Contact Section */}
        <ContactSection />
      </div>
    </section>
  );
}
