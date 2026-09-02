"use client";

/**
 * TemplatesList — Displays user creations with hard-lock delete strategy.
 *
 * Data flows from React Query cache (via ProfileClient useQuery → props).
 * The useDeleteCreation mutation updates THE SAME cache key, so cache
 * changes propagate through useQuery → props → this component instantly.
 *
 * Hard-lock: Module-level Map in useDeleteCreation ensures deleted items
 * stay deleted for 5 seconds, even if a background refetch returns stale data.
 *
 * NO local useState for creations — React Query cache is the sole truth.
 */

import { useState, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDeleteCreation, applyDeleteLocks } from "@/hooks/useDeleteCreation";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { CreationRow } from "./CreationRow";
import type { DashboardCreation } from "@/hooks/useDashboard";

interface TemplatesListProps {
  creations: DashboardCreation[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

function sortCreations(list: DashboardCreation[]): DashboardCreation[] {
  return [...list].sort((a, b) => {
    const rankOf = (c: DashboardCreation) => (c.is_deleted ? 2 : c.is_expired ? 1 : 0);
    const diff = rankOf(a) - rankOf(b);
    if (diff !== 0) return diff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function TemplatesList({ creations, onView, onDelete }: TemplatesListProps): JSX.Element {
  const t = useTranslations("profile");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteCreation();

  const handleDeleteClick = useCallback((id: string) => setPendingDeleteId(id), []);

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDeleteId) return;
    deleteMutation.mutate(pendingDeleteId);
    onDelete(pendingDeleteId);
    setPendingDeleteId(null);
  }, [pendingDeleteId, deleteMutation, onDelete]);

  const handleCancelDelete = useCallback(() => setPendingDeleteId(null), []);

  const sorted = useMemo(() => sortCreations(applyDeleteLocks(creations)), [creations]);
  const activeCount = useMemo(() => sorted.filter((c) => !c.is_deleted).length, [sorted]);

  if (sorted.length === 0) {
    return (
      <div className="bg-surface-raised rounded-card p-8 shadow-soft border border-line text-center">
        <FileText size={48} className="mx-auto text-ink-subtle mb-4" />
        <p className="text-body-md text-ink-muted">{t("creations.empty")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface-raised rounded-card p-6 shadow-soft border border-line">
        <h3 className="text-title-sm font-bold text-ink mb-4">
          {t("creations.title", { count: activeCount })}
        </h3>

        <div className="max-h-[340px] overflow-y-auto">
          <div className="space-y-3 pe-1">
            {sorted.map((creation, index) => (
              <CreationRow
                key={creation.id}
                creation={creation}
                index={index}
                onView={onView}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {pendingDeleteId && (
          <DeleteConfirmModal
            isPending={deleteMutation.isPending}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
