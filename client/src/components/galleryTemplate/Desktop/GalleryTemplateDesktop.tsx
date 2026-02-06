"use client";

/**
 * GalleryTemplateDesktop Component
 * Desktop view for the gallery template page (4-column grid)
 */

import { useState } from "react";
import { GalleryHeader, FilterTabs, TemplateCard } from "../components";
import { TEMPLATES } from "../data/templates";
import type { GalleryTemplateProps, TemplateCategory } from "../types";

export function GalleryTemplateDesktop({
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
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {/* Header Section */}
        <GalleryHeader
          title="בחרו את החוויה הבאה שלכם"
          subtitle="הגלריה שלנו מתעדכנת כל שבוע בתבניות מקוריות שנוצרו באהבה."
          className="mb-10"
        />

        {/* Filter Tabs */}
        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-10"
        />

        {/* Templates Grid - 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg text-hebrew-body">
              אין תבניות בקטגוריה זו עדיין. חזרו בקרוב!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
