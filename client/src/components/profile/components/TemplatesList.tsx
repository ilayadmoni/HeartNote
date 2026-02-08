"use client";

/**
 * TemplatesList Component
 * Displays list of user's created templates
 */

import { motion } from "framer-motion";
import { FileText, ExternalLink, Trash2 } from "lucide-react";
import type { UserTemplate } from "../types";

interface TemplatesListProps {
  templates: UserTemplate[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const TEMPLATE_TYPE_NAMES: Record<string, string> = {
  "date-invite": "הזמנה לדייט",
  "love-coupons": "קופוני אהבה",
  timeline: "ציר זמן",
  "scratch-card": "גירוד",
  "relationship-quiz": "חידון זוגי",
  "open-when": "פתח כש...",
};

export function TemplatesList({
  templates,
  onView,
  onDelete,
}: TemplatesListProps) {
  if (templates.length === 0) {
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
        התבניות שלי ({templates.length})
      </h3>

      <div className="space-y-3">
        {templates.map((template, index) => (
          <TemplateRow
            key={template.id}
            template={template}
            index={index}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

interface TemplateRowProps {
  template: UserTemplate;
  index: number;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

function TemplateRow({ template, index, onView, onDelete }: TemplateRowProps) {
  const typeName = TEMPLATE_TYPE_NAMES[template.type] || template.type;
  const createdDate = new Date(template.createdAt).toLocaleDateString("he-IL");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#d4826f]/10 flex items-center justify-center">
          <FileText size={18} className="text-[#d4826f]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#2e3c52] dark:text-white text-hebrew-body">
            {template.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {typeName} • {createdDate}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(template.id)}
          className="p-2 text-gray-400 hover:text-[#d4826f] transition-colors"
          aria-label="צפייה בתבנית"
        >
          <ExternalLink size={16} />
        </button>
        <button
          onClick={() => onDelete(template.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="מחיקת תבנית"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
