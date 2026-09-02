"use client";

/**
 * CreationRow — individual list item for TemplatesList.
 * Visual state is derived from is_deleted and is_expired flags, shown via
 * an icon chip and status tag (no side-stripe borders).
 */

import { motion } from "framer-motion";
import { FileText, ExternalLink, Trash2, Clock } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { DashboardCreation } from "@/hooks/useDashboard";

interface CreationRowProps {
  creation: DashboardCreation;
  index: number;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CreationRow({ creation, index, onView, onDelete }: CreationRowProps): JSX.Element {
  const t = useTranslations("profile");
  const format = useFormatter();
  const createdDate = format.dateTime(new Date(creation.created_at), { dateStyle: "medium" });
  const { is_expired: isExpired, is_deleted: isDeleted } = creation;
  const templateName = creation.template_name || t("fallbackTemplateName");

  const rowClasses = isDeleted
    ? "opacity-50 grayscale bg-surface-sunken"
    : isExpired
      ? "opacity-75 bg-surface-sunken"
      : "bg-surface-sunken hover:bg-line/30";

  const iconClasses = isDeleted ? "bg-line" : isExpired ? "bg-accent-soft" : "bg-accent-soft";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center justify-between p-3 rounded-control transition-colors duration-base ${rowClasses}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-control flex items-center justify-center shrink-0 ${iconClasses}`}>
          {isDeleted ? (
            <Trash2 size={18} className="text-ink-subtle" />
          ) : isExpired ? (
            <Clock size={18} className="text-accent" />
          ) : (
            <FileText size={18} className="text-accent" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`text-body-sm font-medium truncate ${
                isDeleted ? "text-ink-subtle line-through" : isExpired ? "text-ink-subtle" : "text-ink"
              }`}
            >
              {templateName}
            </p>
            {isDeleted && (
              <span className="text-caption font-bold text-ink-muted bg-surface px-1.5 py-0.5 rounded-control shrink-0">
                {t("creations.statusDeleted")}
              </span>
            )}
            {!isDeleted && isExpired && (
              <span className="text-caption font-bold text-accent bg-accent-soft px-1.5 py-0.5 rounded-control shrink-0">
                {t("creations.statusExpired")}
              </span>
            )}
          </div>
          <p className="text-caption text-ink-muted">
            {templateName ? `${templateName} • ` : ""}
            {createdDate}
          </p>
          {creation.verification_code && !isDeleted && (
            <p className="mt-1 text-caption text-ink-muted flex items-center gap-1.5">
              <span>{t("creations.verificationCode")}</span>
              <span className="font-mono font-bold tracking-wider text-accent bg-accent-soft px-1.5 py-0.5 rounded-control" dir="ltr">
                {creation.verification_code}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isDeleted ? (
          <span className="text-caption text-ink-subtle font-medium px-3 py-1.5">
            {t("creations.statusDeleted")}
          </span>
        ) : isExpired ? (
          <span className="text-caption text-ink-subtle font-medium px-3 py-1.5">
            {t("creations.statusArchived")}
          </span>
        ) : (
          <button
            onClick={() => onView(creation.id)}
            className="p-2 text-ink-subtle hover:text-accent transition-colors"
            aria-label={t("creations.viewAria")}
          >
            <ExternalLink size={16} />
          </button>
        )}
        {!isDeleted && !isExpired && (
          <button
            onClick={() => onDelete(creation.id)}
            className="p-2 text-ink-subtle hover:text-red-500 transition-colors"
            aria-label={t("creations.deleteAria")}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
