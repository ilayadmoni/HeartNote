"use client";

/**
 * Timeline Component - Mobile Version
 * Compact card-based timeline optimized for mobile
 */

import { motion } from "framer-motion";
import type { TimelineMobileProps } from "../types";

export function TimelineMobile({ data }: TimelineMobileProps) {
  const hasEvents = data.events && data.events.length > 0;

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[#fdf6f3] dark:bg-gray-900 px-4 py-5 overflow-auto relative">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[320px] bg-white dark:bg-gray-800 rounded-[24px] shadow-xl shadow-black/8 dark:shadow-black/25 p-5"
      >
        {/* Title */}
        {data.title && (
          <h1 className="text-lg font-bold text-center text-[#2e3c52] dark:text-white mb-5 text-hebrew-heading">
            {data.title}
          </h1>
        )}

        {/* Timeline Content */}
        {hasEvents ? (
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#d4826f]/30 via-[#e8917a]/50 to-[#d4826f]/30 rounded-full" />

            {/* Events */}
            <div className="space-y-3">
              {data.events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative flex items-start gap-3"
                >
                  {/* Icon Circle */}
                  <div className="relative z-10 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#ffe4e6] to-[#fff1f2] dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shadow-sm">
                    <span className="text-xs">{event.icon || "📌"}</span>
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 pb-1">
                    {/* Date Badge */}
                    <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold text-[#d4826f] bg-[#d4826f]/10 rounded-full mb-1">
                      {formatDate(event.date)}
                    </span>

                    {/* Title */}
                    <h3 className="text-xs font-bold text-[#2e3c52] dark:text-white mb-0.5 text-hebrew-heading">
                      {event.title}
                    </h3>

                    {/* Description */}
                    {event.description && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 text-hebrew-body leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-6">
            <span className="text-3xl mb-2 block">📅</span>
            <p className="text-xs text-gray-400 text-hebrew-body">
              הוסף אירועים לציר הזמן שלך
            </p>
          </div>
        )}
      </motion.div>

      {/* Footer Credit */}
      <p className="absolute bottom-2 text-[10px] text-gray-300 dark:text-gray-600 text-hebrew-body">
        HeartNote Factory © 2024
      </p>
    </div>
  );
}

/** Format date to Hebrew format */
function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
