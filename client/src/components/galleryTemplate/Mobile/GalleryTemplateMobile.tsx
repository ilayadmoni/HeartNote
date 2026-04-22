"use client";

/**
 * GalleryTemplateMobile Component
 * Mobile view for the gallery template page (single/double column)
 * Now dynamically fetches template metadata (categories, premium status) from Supabase
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterTabs, TemplateCard } from "../components";
import { TEMPLATES, CATEGORY_EMOJI_MAP } from "../data/templates";
import { useActiveTemplates } from "@/hooks/useActiveTemplates";
import type { GalleryTemplateProps } from "../types";

export function GalleryTemplateMobile({
  className = "",
  onTemplateClick,
}: GalleryTemplateProps) {
  const [activeTab, setActiveTab] = useState("all");

  // Fetch active templates with metadata from Supabase
  const { enrichedTemplates, loading, error } = useActiveTemplates(TEMPLATES);

  // Derive tabs dynamically from the categories present in active templates
  const tabs = useMemo(() => {
    const seen = new Set<string>();
    const dynamic = enrichedTemplates.flatMap((t) => t.categories ?? []).filter((cat) => {
      if (seen.has(cat)) return false;
      seen.add(cat);
      return true;
    }).map((cat) => ({ id: cat, label: cat, emoji: CATEGORY_EMOJI_MAP[cat] }));
    return [{ id: "all", label: "הכל", emoji: "✨" }, ...dynamic];
  }, [enrichedTemplates]);

  // Filter templates by category
  const filteredTemplates = enrichedTemplates.filter((template) => {
    if (activeTab === "all") return true;
    return template.categories?.includes(activeTab) ?? false;
  });

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
      

          <h1 className="text-2xl font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
            בחרו את החוויה הבאה
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-hebrew-body">
            תבניות אינטראקטיביות שנוצרו באהבה
          </p>
        </motion.div>

        {/* Filter Tabs - Two rows on mobile */}
        <div className="mb-6 -mx-4 px-4">
          <div className="flex flex-wrap gap-2">
            <FilterTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="flex flex-wrap gap-2"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-4"
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

        {/* Empty State - No templates for this category */}
        {!loading && filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <span className="text-4xl mb-3 block">🔜</span>
            <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
              תבניות חדשות בקטגוריה זו יגיעו בקרוב!
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <span className="text-4xl mb-3 block">⚠️</span>
            <p className="text-red-500 dark:text-red-400 text-hebrew-body">
              אירעה שגיאה בטעינת התבניות.
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-3 border-[#d4826f] border-t-transparent rounded-full"
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-hebrew-body mt-4">
              טוען תבניות...
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
