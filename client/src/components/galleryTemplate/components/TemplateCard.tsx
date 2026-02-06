/**
 * TemplateCard Component
 * Individual template card with preview, title, description, and badge
 */

import Link from "next/link";
import type { TemplateCardProps } from "../types";

export function TemplateCard({ template, className = "" }: TemplateCardProps) {
  return (
    <div
      className={`
        group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
        shadow-sm hover:shadow-lg transition-all duration-300
        border border-gray-100 dark:border-gray-700
        ${className}
      `}
    >
      {/* Image Preview Container */}
      <div className="relative aspect-[4/3] bg-[#f5f0eb] dark:bg-gray-700 overflow-hidden">
        {/* Badge */}
        {template.badge && (
          <div
            className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center z-10"
            style={{ backgroundColor: template.badge.color }}
          >
            {template.badge.type === "heart" && (
              <span className="text-white text-sm">💛</span>
            )}
            {template.badge.type === "star" && (
              <span className="text-white text-sm">⭐</span>
            )}
          </div>
        )}

        {/* Free Badge */}
        {template.isFree && (
          <div className="absolute top-3 right-3 bg-[#d4826f] text-white text-xs px-2 py-1 rounded-md z-10 text-hebrew-body">
            חינם
          </div>
        )}

        {/* Template Preview Image */}
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-[85%] h-[85%] bg-white dark:bg-gray-600 rounded-lg shadow-md flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500 text-sm text-hebrew-body">
              תצוגה מקדימה
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-bold text-[#2e3c52] dark:text-white mb-2 transition-colors duration-300 text-hebrew-heading">
          {template.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 transition-colors duration-300 text-hebrew-body">
          {template.description}
        </p>

        {template.linkText && (
          <Link
            href={template.link}
            className="text-sm text-[#d4826f] hover:text-[#c4735f] transition-colors duration-200 text-hebrew-body"
          >
            ✨ {template.linkText}
          </Link>
        )}
      </div>
    </div>
  );
}
