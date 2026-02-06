"use client";

/**
 * GalleryTemplateMobile Component
 * Mobile view for the gallery template page (single column)
 */

import { useState } from "react";
import { FilterTabs, TemplateCard } from "../components";
import { TEMPLATES } from "../data/templates";
import type { GalleryTemplateProps, TemplateCategory } from "../types";

export function GalleryTemplateMobile({
  className = "",
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
      <div className="container mx-auto px-7 py-8">
        {/* Mobile Header - Compact width */}
        <div className="mb-8 text-center w-[95%] mx-auto">
          <h1 className="text-3xl w-full font-bold text-[#2e3c52] dark:text-white mb-4 leading-tight text-hebrew-heading">
            בחרו את החוויה
            <br />
            הבאה שלכם
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed text-hebrew-body">
            הגלריה שלנו מתעדכנת כל שבוע
            <br />
            בתבניות מקוריות שנוצרו באהבה.
          </p>
        </div>

        {/* Filter Tabs - Wrapped grid layout */}
        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-10"
        />

        {/* Templates Grid - Increased spacing between cards */}
        <div className="space-y-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
              אין תבניות בקטגוריה זו עדיין.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
