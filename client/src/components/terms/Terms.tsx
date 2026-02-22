"use client";

/**
 * Terms Component
 * Main terms of use page content
 */

import { Settings } from "lucide-react";
import { TermsHeader, TermsSection } from "./components";
import { TERMS_SECTIONS } from "./constants";
import type { TermsProps } from "./types";

export function Terms({ className = "" }: TermsProps) {
  return (
    <section
      className={`relative py-12 lg:py-20 px-4 min-h-screen bg-[#faf7f5] dark:bg-gray-900 ${className}`}
    >
      {/* Background Decorative Gears */}
      <div className="absolute top-20 left-10 opacity-10 pointer-events-none hidden lg:block">
        <Settings size={160} className="animate-spin-slow text-[#2e3c52]" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 pointer-events-none hidden lg:block">
        <Settings
          size={120}
          className="animate-spin-slow-reverse text-[#2e3c52]"
        />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <TermsHeader />

        {/* Terms Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-10 shadow-lg">
          {TERMS_SECTIONS.map((section, index) => (
            <TermsSection key={section.id} section={section} index={index} />
          ))}

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-8" />

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 text-hebrew-body">
            בשימוש באתר HeartNote, אתם מסכימים לתנאי השימוש ומדיניות הפרטיות.
          </p>
        </div>
      </div>
    </section>
  );
}
