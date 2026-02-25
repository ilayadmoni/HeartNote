"use client";

/**
 * CreationRow — individual list item for TemplatesList.
 *
 * Visual state is derived from is_deleted and is_expired flags.
 * Deleted items show grey/grayscale with disabled buttons.
 */

import { motion } from "framer-motion";
import { FileText, ExternalLink, Trash2, Clock } from "lucide-react";
import type { DashboardCreation } from "@/hooks/useDashboard";

interface CreationRowProps {
  creation: DashboardCreation;
  index: number;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CreationRow({
  creation,
  index,
  onView,
  onDelete,
}: CreationRowProps) {
  const createdDate = new Date(creation.created_at).toLocaleDateString("he-IL");
  const { is_expired: isExpired, is_deleted: isDeleted } = creation;

  const rowClasses = isDeleted
    ? "border-l-4 border-gray-300 opacity-50 grayscale bg-gray-100 dark:bg-gray-800/40"
    : isExpired
      ? "border-l-4 border-red-500 opacity-75 bg-red-50/50 dark:bg-red-950/20"
      : "border-l-4 border-green-500 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700";

  const iconClasses = isDeleted
    ? "bg-gray-200 dark:bg-gray-700"
    : isExpired
      ? "bg-red-100 dark:bg-red-900/30"
      : "bg-[#d4826f]/10";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${rowClasses}`}
    >
      {/* Left: icon + text */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconClasses}`}
        >
          {isDeleted ? (
            <Trash2 size={18} className="text-gray-400" />
          ) : isExpired ? (
            <Clock size={18} className="text-red-500" />
          ) : (
            <FileText size={18} className="text-[#d4826f]" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`text-sm font-medium text-hebrew-body truncate ${
                isDeleted
                  ? "text-gray-400 dark:text-gray-500 line-through"
                  : isExpired
                    ? "text-gray-400 dark:text-gray-500"
                    : "text-[#2e3c52] dark:text-white"
              }`}
            >
              {creation.template_name || "כרטיס"}
            </p>
            {isDeleted && (
              <span className="text-[10px] font-bold text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded shrink-0">
                נמחק
              </span>
            )}
            {!isDeleted && isExpired && (
              <span className="text-[10px] font-bold text-red-500 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded shrink-0">
                פג תוקף
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {creation.template_name ? `${creation.template_name} • ` : ""}
            {createdDate}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 shrink-0">
        {isDeleted ? (
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium px-3 py-1.5">
            נמחק
          </span>
        ) : isExpired ? (
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium px-3 py-1.5">
            בארכיון
          </span>
        ) : (
          <button
            onClick={() => onView(creation.id)}
            className="p-2 text-gray-400 hover:text-[#d4826f] transition-colors"
            aria-label="צפייה בכרטיס"
          >
            <ExternalLink size={16} />
          </button>
        )}
        {!isDeleted && !isExpired && (
          <button
            onClick={() => onDelete(creation.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="מחיקת כרטיס"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
