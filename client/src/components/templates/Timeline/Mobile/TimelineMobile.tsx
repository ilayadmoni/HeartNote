"use client";

/**
 * Timeline Component - Mobile Version
 * Compact card-based timeline optimized for mobile
 */

import { motion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { TimelineMobileProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
} from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";

export function TimelineMobile({ data }: TimelineMobileProps) {
  const t = useTranslations("templates");
  const locale = useLocale();
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');
  const hasEvents = data.events && data.events.length > 0;
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;
  const entranceX = locale === "he" ? 15 : -15;

  return (
    <div className={`w-full h-full flex flex-col justify-between items-center gap-6 bg-transparent px-4 py-6 overflow-auto relative isolate ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[100dvh]'
    }`}>
      <FloatingIcons />
      {/* Main Content - Top */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[320px] bg-surface-raised rounded-card shadow-card p-5"
        >
          {/* Title */}
          {data.title && (
            <h1
              className="text-title-sm font-bold text-center mb-5 break-words"
              style={{ color: primaryColor }}
              dir="auto"
            >
              {data.title.length > 50
                ? `${data.title.substring(0, 50)}...`
                : data.title}
            </h1>
          )}

          {/* Timeline Content */}
          {hasEvents ? (
            <div className="relative">
              {/* Vertical dashed line — aligned with icon center (w-7 = 28px → center at 14px from the trailing edge) */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  transformOrigin: "top",
                  backgroundImage: `repeating-linear-gradient(to bottom, ${primaryColor}65 0px, ${primaryColor}65 6px, transparent 6px, transparent 11px)`,
                }}
                className="absolute end-[14px] top-2 bottom-2 w-[2px] rounded-full"
              />

              {/* Events */}
              <div className="space-y-3">
                {data.events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: entranceX }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
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
                        className="inline-block px-2 py-0.5 text-caption font-bold rounded-full mb-1 tracking-wide"
                        style={{
                          color: primaryColor,
                          backgroundColor: `${primaryColor}18`,
                        }}
                      >
                        {formatDate(event.date, locale)}
                      </span>

                      {/* Event Title */}
                      <h3 className="text-xs font-bold text-ink mb-0.5 break-words leading-snug" dir="auto">
                        {event.title}
                      </h3>

                      {/* Description */}
                      {event.description && (
                        <p className="text-body-sm text-ink-muted leading-relaxed break-words" dir="auto">
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
              <p className="text-xs text-ink-subtle">{t("timeline.emptyState")}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer Credit - Bottom */}
      <FooterBranding className="mx-auto" />
    </div>
  );
}

/** Format a date string per the active locale. */
function formatDate(dateString: string, locale: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "he" ? "he-IL" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
