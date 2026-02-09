"use client";

/**
 * FAQ Component
 * Main FAQ page content with accordion
 */

import { HelpCircle } from "lucide-react";
import { FAQHeader, FAQAccordion } from "./components";
import type { FAQProps } from "./types";

export function FAQ({ className = "" }: FAQProps) {
  return (
    <section
      className={`relative py-12 lg:py-20 px-4 min-h-screen bg-[#faf7f5] dark:bg-gray-900 ${className}`}
      dir="rtl"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-5 pointer-events-none hidden lg:block">
        <HelpCircle size={180} className="text-[#2e3c52] dark:text-white" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-5 pointer-events-none hidden lg:block">
        <HelpCircle size={140} className="text-[#2e3c52] dark:text-white" />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <FAQHeader />
        <FAQAccordion />

        {/* Contact CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
            לא מצאת את התשובה שחיפשת?{" "}
            <a
              href="/contact"
              className="text-[#d4826f] dark:text-[#e8917a] hover:underline font-medium"
            >
              צרו איתנו קשר
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
