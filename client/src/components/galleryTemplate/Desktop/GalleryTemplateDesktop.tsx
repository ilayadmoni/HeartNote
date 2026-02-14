"use client";

/**
 * GalleryTemplateDesktop Component
 * Desktop view for the gallery template page (responsive grid)
 * Now dynamically fetches template metadata (categories, premium status) from Supabase
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryHeader, FilterTabs, TemplateCard } from "../components";
import { TEMPLATES } from "../data/templates";
import { useActiveTemplates } from "@/hooks/useActiveTemplates";
import type { GalleryTemplateProps, TemplateCategory } from "../types";

export function GalleryTemplateDesktop({
  className = "",
  onTemplateClick,
}: GalleryTemplateProps) {
  const [activeTab, setActiveTab] = useState<TemplateCategory>("all");

  // Fetch active templates with metadata from Supabase
  const { enrichedTemplates, loading, error } = useActiveTemplates(TEMPLATES);

  // Filter templates by category
  const filteredTemplates = enrichedTemplates.filter((template) => {
    if (activeTab === "all") return true;
    // Check if selected category is in the template's categories array
    return template.categories?.includes(activeTab) || template.category === activeTab;
  });

  return (
    <section
      className={`min-h-screen bg-[#faf7f5] dark:bg-gray-900 transition-colors duration-300 ${className}`}
    >
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {/* Header Section */}
        <GalleryHeader
          title="בחרו את החוויה הבאה שלכם"
          subtitle="גלריית תבניות אינטראקטיביות שנוצרו באהבה. התאימו אישית, ושלחו!"
          className="mb-10"
        />

        {/* Filter Tabs */}
        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-10"
        />

        {/* Templates Grid - Responsive */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
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
            className="text-center py-16"
          >
            <span className="text-5xl mb-4 block">🔜</span>
            <p className="text-gray-500 dark:text-gray-400 text-lg text-hebrew-body">
              תבניות חדשות בקטגוריה זו יגיעו בקרוב!
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <span className="text-5xl mb-4 block">⚠️</span>
            <p className="text-red-500 dark:text-red-400 text-lg text-hebrew-body">
              אירעה שגיאה בטעינת התבניות. אנא נסו שוב מאוחר יותר.
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-3 border-[#d4826f] border-t-transparent rounded-full"
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg text-hebrew-body mt-4">
              טוען תבניות...
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
  
  

