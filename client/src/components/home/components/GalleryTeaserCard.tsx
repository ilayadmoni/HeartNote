"use client";

/**
 * GalleryTeaserCard Component
 * Template card with preview for the home page gallery teaser
 */

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import {
  TemplatePreview,
  type PreviewType,
} from "@/components/galleryTemplate/components";

export interface TeaserCardData {
  id: number;
  title: string;
  description: string;
  tag?: string;
  isPremium?: boolean;
  previewType: PreviewType;
}

interface GalleryTeaserCardProps {
  template: TeaserCardData;
  index?: number;
}

export function GalleryTeaserCard({
  template,
  index = 0,
}: GalleryTeaserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-[#d4826f]/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      {/* Preview Area */}
      <div className="h-40 w-full relative bg-[#F2E9E4] dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
        <TemplatePreview type={template.previewType} />

        {template.isPremium && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-1.5 rounded-full shadow-md z-20">
            <Crown size={14} fill="currentColor" />
          </div>
        )}

        {template.tag && (
          <div className="absolute top-3 right-3 bg-[#2e3c52] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md z-20 text-hebrew-heading">
            {template.tag}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#2e3c52]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white border border-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white hover:text-[#2e3c52] transition-colors text-hebrew-heading">
            צפה בתבנית
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white group-hover:text-[#d4826f] transition-colors mb-2 text-hebrew-heading">
          {template.title}
        </h3>
        <p className="text-[#2e3c52] dark:text-gray-300 text-sm leading-relaxed text-hebrew-body">
          {template.description}
        </p>
      </div>
    </motion.div>
  );
}
