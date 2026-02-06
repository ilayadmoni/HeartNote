/**
 * FilterTabs Component
 * Category filter tabs for the gallery - responsive grid layout
 */

import { FILTER_TABS } from "../data/templates";
import type { FilterTabsProps } from "../types";

export function FilterTabs({
  activeTab,
  onTabChange,
  className = "",
}: FilterTabsProps) {
  return (
    <div
      className={`
        flex flex-wrap justify-center gap-2
        md:gap-3
        ${className}
      `}
    >
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-5 py-2.5 rounded-full text-sm
            transition-all duration-200 text-hebrew-body
            ${
              activeTab === tab.id
                ? "bg-[#d4826f] text-white shadow-md"
                : "bg-[#e8e0da] dark:bg-gray-700 text-[#2e3c52] dark:text-gray-200 hover:bg-[#ddd5cf] dark:hover:bg-gray-600"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
