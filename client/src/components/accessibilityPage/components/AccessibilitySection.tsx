"use client";

/**
 * AccessibilitySection Component
 * Individual accessibility statement section
 */

import { motion } from "framer-motion";
import type { AccessibilitySection as AccessibilitySectionType } from "../types";

interface AccessibilitySectionProps {
  section: AccessibilitySectionType;
  index: number;
}

export function AccessibilitySection({
  section,
  index,
}: AccessibilitySectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="mb-8 last:mb-0"
      aria-labelledby={section.title ? `section-${section.id}` : undefined}
    >
      {section.title && (
        <h2
          id={`section-${section.id}`}
          className="text-xl font-bold text-[#2e3c52] dark:text-white mb-3 text-hebrew-heading"
        >
          {section.title}
        </h2>
      )}
      <div className="space-y-2">
        {section.content.map((paragraph, pIndex) => (
          <p
            key={pIndex}
            className="text-[#2e3c52] dark:text-gray-300 text-sm leading-relaxed text-hebrew-body"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  );
}
