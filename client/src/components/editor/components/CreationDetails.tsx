"use client";

/**
 * CreationDetails — Bottom stats box inside CreationConfirmModal.
 * Shows: template name, expiry date, remaining after this creation, and tier badge.
 * Logic is unchanged from the original modal — only extracted for modularity.
 */

import { motion } from "framer-motion";

interface CreationDetailsProps {
  templateName: string;
  expirationDate: string;
  /** Remaining quota after this creation is made */
  remainingAfterCreate: number | typeof Infinity;
  selectedQuota: "free" | "pro";
}

export function CreationDetails({ templateName, expirationDate, remainingAfterCreate, selectedQuota }: CreationDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-50 dark:bg-navy-700/70 rounded-2xl p-3 mb-4"
    >
      {/* Template name row */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-200 dark:border-navy-600">
        <p className="text-xs text-gray-600 dark:text-gray-300 text-hebrew-body">סוג יצירה</p>
        <p className="text-sm font-bold text-navy-700 dark:text-white text-hebrew-heading text-right">{templateName}</p>
      </div>

      {/* Expiry + remaining grid */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 p-2.5 text-right">
          <p className="text-[11px] text-gray-500 dark:text-gray-300 text-hebrew-body mb-1">תוקף היצירה</p>
          <p className="text-sm font-bold text-navy-700 dark:text-white text-hebrew-heading">{expirationDate}</p>
        </div>

        <div className="rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 p-2.5 text-right">
          <p className="text-[11px] text-gray-500 dark:text-gray-300 text-hebrew-body mb-1">יתרה לאחר היצירה</p>
          <motion.p
            key={remainingAfterCreate === Infinity ? "unlimited" : `${selectedQuota}-${remainingAfterCreate}`}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-navy-700 dark:text-white text-hebrew-heading"
          >
            {remainingAfterCreate === Infinity ? "ללא הגבלה" : remainingAfterCreate}
          </motion.p>
        </div>
      </div>

      {/* Tier badge */}
      <div className="flex items-center justify-end gap-2 pt-3">
        <span className={`px-3 py-1 text-xs font-bold rounded-full text-white text-hebrew-body ${selectedQuota === "pro" ? "bg-coral-500" : "bg-navy-600"}`}>
          {selectedQuota === "pro" ? "בחירת פרימיום" : "בחירה חינמית"}
        </span>
      </div>
    </motion.div>
  );
}
