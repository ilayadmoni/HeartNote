"use client";

/**
 * Timeline Component - Mobile Version
 * Compact card-based timeline optimized for mobile
 */

import { motion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import type { TimelineMobileProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
} from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";

export function TimelineMobile({ data }: TimelineMobileProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');
  const hasEvents = data.events && data.events.length > 0;
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  return (
    <div className={`w-full h-full flex flex-col justify-between items-center gap-6 bg-transparent px-4 py-6 overflow-auto relative isolate ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[650px]'
    }`}>
      <FloatingIcons />
      {/* Main Content - Top */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[320px] bg-white dark:bg-gray-800 rounded-[24px] shadow-xl shadow-black/8 dark:shadow-black/25 p-5"
        >
          {/* Title */}
          {data.title && (
            <h1
              className="text-lg font-bold text-center mb-5 text-hebrew-heading break-words"
              style={{ color: primaryColor }}
            >
              {data.title.length > 50
                ? `${data.title.substring(0, 50)}...`
                : data.title}
            </h1>
          )}

          {/* Timeline Content */}
          {hasEvents ? (
            <div className="relative" dir="rtl">
              {/* Vertical dashed line — aligned with icon center (w-7 = 28px → center at 14px from right) */}
              <div
                className="absolute right-[14px] top-2 bottom-2 w-[2px] rounded-full"
                style={{
                  backgroundImage: `repeating-linear-gradient(to bottom, ${primaryColor}65 0px, ${primaryColor}65 6px, transparent 6px, transparent 11px)`,
                }}
              />

              {/* Events */}
              <div className="space-y-3">
                {data.events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.3, ease: "easeOut" }}
                    className="relative flex items-start gap-3"
                  >
                    {/* Icon Circle */}
                    <div
                      className="relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}22, ${primaryColor}0d)`,
                        boxShadow: `0 0 0 2px ${primaryColor}60, 0 2px 8px ${primaryColor}20`,
                      }}
                    >
                      <span className="text-sm leading-none">{event.icon || "📌"}</span>
                    </div>

                    {/* Event Card */}
                    <div
                      className="flex-1 rounded-xl p-2.5 border min-w-0"
                      style={{
                        backgroundColor: `${primaryColor}07`,
                        borderColor: `${primaryColor}22`,
                        boxShadow: `0 1px 3px ${primaryColor}0e`,
                      }}
                    >
                      {/* Date Badge */}
                      <span
                        className="inline-block px-2 py-0.5 text-[9px] font-bold rounded-full mb-1 tracking-wide"
                        style={{
                          color: primaryColor,
                          backgroundColor: `${primaryColor}18`,
                        }}
                      >
                        {formatDate(event.date)}
                      </span>

                      {/* Event Title */}
                      <h3 className="text-xs font-bold text-[#2e3c52] dark:text-white mb-0.5 text-hebrew-heading break-words leading-snug">
                        {event.title}
                      </h3>

                      {/* Description */}
                      {event.description && (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 text-hebrew-body leading-relaxed break-words">
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
