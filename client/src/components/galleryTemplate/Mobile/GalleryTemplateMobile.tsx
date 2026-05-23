"use client";

/**
 * GalleryTemplateMobile Component
 * Mobile view for the gallery template page (single column).
 * Receives pre-filtered templates and all filter state as props.
 */

import { motion, AnimatePresence } from "framer-motion";
import { FilterTabs, TemplateCard } from "../components";
import { GallerySearchBar } from "@/components/GallerySearchBar";
import type { GalleryTemplateViewProps } from "../types";

export function GalleryTemplateMobile({
  className = "",
  onTemplateClick,
  templates,
  loading,
  error,
  activeTab,
  onTabChange,
  tabs,
  searchQuery,
  onSearchChange,
}: GalleryTemplateViewProps) {
  return (
    <section
      className={`min-h-screen bg-[#faf7f5] dark:bg-gray-900 transition-colors duration-300 ${className}`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Header */}
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

        {/* Filter Tabs */}
        <div className="mb-6 -mx-4 px-4">
          <div className="flex flex-wrap gap-2">
            <FilterTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              className="flex flex-wrap gap-2"
            />
          </div>
        </div>

        {/* Smart Search Bar */}
        <GallerySearchBar
          value={searchQuery}
          onChange={onSearchChange}
          className="mb-6"
        />

        {/* Templates Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${searchQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-4"
          >
            {templates.map((template, index) => (
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
        {!loading && templates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <span className="text-4xl mb-3 block">🔍</span>
            <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
              לא נמצאו תבניות התואמות לחיפוש שלך
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
