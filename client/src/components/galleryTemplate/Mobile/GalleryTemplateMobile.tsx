"use client";

/**
 * GalleryTemplateMobile Component
 * Mobile view for the gallery template page (single/double column)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterTabs, TemplateCard } from "../components";
import { TEMPLATES } from "../data/templates";
import type { GalleryTemplateProps, TemplateCategory } from "../types";

export function GalleryTemplateMobile({
  className = "",
  onTemplateClick,
}: GalleryTemplateProps) {
  const [activeTab, setActiveTab] = useState<TemplateCategory>("all");

  const filteredTemplates =
    activeTab === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeTab);

  return (
    <section
      className={`min-h-screen bg-[#faf7f5] dark:bg-gray-900 transition-colors duration-300 ${className}`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          {/* Floating Hearts */}
          <div className="flex justify-center gap-2 mb-3">
            {["💕", "✨", "💕"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                className="text-xl"
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
            בחרו את החוויה הבאה
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-hebrew-body">
            תבניות אינטראקטיביות שנוצרו באהבה
          </p>
        </motion.div>

        {/* Filter Tabs - Scrollable on mobile */}
        <div className="mb-6 -mx-4 px-4 overflow-x-auto">
          <FilterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="min-w-max"
          />
        </div>

        {/* Templates Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TemplateCard template={template} onClick={onTemplateClick} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <span className="text-4xl mb-3 block">🔜</span>
            <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
              תבניות חדשות יגיעו בקרוב!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
