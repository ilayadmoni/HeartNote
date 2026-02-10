"use client";

/**
 * TemplatesList Component
 * Displays list of user's created pages with active/expired states.
 */

import { motion } from "framer-motion";
import { FileText, ExternalLink, Trash2, Clock } from "lucide-react";
import type { DashboardPage } from "@/hooks/useDashboard";

interface TemplatesListProps {
  pages: DashboardPage[];
  onView: (slug: string) => void;
  onDelete: (slug: string) => void;
}

export function TemplatesList({
  pages,
  onView,
  onDelete,
}: TemplatesListProps) {
  if (pages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <FileText
          size={48}
          className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
        />
        <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
          עדיין לא יצרת תבניות
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white mb-4 text-hebrew-heading">
        התבניות שלי ({pages.length})
      </h3>

      <div className="space-y-3">
        {pages.map((page, index) => (
          <PageRow
            key={page.slug}
            page={page}
            index={index}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

interface PageRowProps {
  page: DashboardPage;
  index: number;
  onView: (slug: string) => void;
  onDelete: (slug: string) => void;
}

function PageRow({ page, index, onView, onDelete }: PageRowProps) {
  const createdDate = new Date(page.created_at).toLocaleDateString("he-IL");
  const isExpired = page.is_expired;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        flex items-center justify-between p-3 rounded-xl transition-colors
        ${
          isExpired
            ? "border-l-4 border-red-500 opacity-75 bg-red-50/50 dark:bg-red-950/20"
            : "border-l-4 border-green-500 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isExpired
              ? "bg-red-100 dark:bg-red-900/30"
              : "bg-[#d4826f]/10"
          }`}
        >
          {isExpired ? (
            <Clock size={18} className="text-red-500" />
          ) : (
            <FileText size={18} className="text-[#d4826f]" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p
              className={`text-sm font-medium text-hebrew-body ${
                isExpired
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-[#2e3c52] dark:text-white"
              }`}
            >
              {page.title || page.template_name || "כרטיס"}
            </p>
            {isExpired && (
              <span className="text-[10px] font-bold text-red-500 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">
                פג תוקף
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {page.template_name ? `${page.template_name} • ` : ""}
            {createdDate}
            {page.view_count > 0 && ` • ${page.view_count} צפיות`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isExpired ? (
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium px-3 py-1.5">
            בארכיון
          </span>
        ) : (
          <button
            onClick={() => onView(page.slug)}
            className="p-2 text-gray-400 hover:text-[#d4826f] transition-colors"
            aria-label="צפייה בתבנית"
          >
            <ExternalLink size={16} />
          </button>
        )}
        <button
          onClick={() => onDelete(page.slug)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="מחיקת תבנית"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
