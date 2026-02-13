"use client";

/**
 * Timeline Component - Mobile Version
 * Compact card-based timeline optimized for mobile
 */

import { motion } from "framer-motion";
import type { TimelineMobileProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";

export function TimelineMobile({ data }: TimelineMobileProps) {
  const hasEvents = data.events && data.events.length > 0;
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  return (
    <div className="w-full h-full min-h-[420px] flex flex-col justify-between gap-6 bg-[#faf7f5] dark:bg-gray-900 px-4 py-6 overflow-auto relative">
      {/* Main Content - Top */}
      <div className="flex flex-col items-center w-full">
        <BackToGallery className="mb-3" />

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[320px] bg-white dark:bg-gray-800 rounded-[24px] shadow-xl shadow-black/8 dark:shadow-black/25 p-5"
        >
          {/* Title - Limited to 50 characters */}
          {data.title && (
            <h1 className="text-lg font-bold text-center text-[#2e3c52] dark:text-white mb-5 text-hebrew-heading break-words">
              {data.title.length > 50
                ? `${data.title.substring(0, 50)}...`
                : data.title}
            </h1>
          )}

          {/* Timeline Content */}
          {hasEvents ? (
            <div className="relative">
              {/* Vertical Line */}
              <div
                className="absolute left-3 top-2 bottom-2 w-0.5 rounded-full"
                style={{
                  background: `linear-gradient(to bottom, ${primaryColor}30, ${primaryColor}50, ${primaryColor}30)`,
                }}
              />

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
                    <div
                      className="relative z-10 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}08)`,
                      }}
                    >
                      <span className="text-xs">{event.icon || "📌"}</span>
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 pb-1 min-w-0">
                      {/* Date Badge */}
                      <span
                        className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-full mb-1"
                        style={{
                          color: primaryColor,
                          backgroundColor: `${primaryColor}15`,
                        }}
                      >
                        {formatDate(event.date)}
                      </span>

                      {/* Title - with word breaking */}
                      <h3 className="text-xs font-bold text-[#2e3c52] dark:text-white mb-0.5 text-hebrew-heading break-words max-w-[200px]">
                        {event.title}
                      </h3>

                      {/* Description - with word breaking */}
                      {event.description && (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 text-hebrew-body leading-relaxed break-words max-w-[200px]">
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
      </div>

      {/* Footer Credit - Bottom */}
      <FooterBranding className="mx-auto" />
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
