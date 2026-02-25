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
import { useDeleteCreation, applyDeleteLocks } from "../hooks/useDeleteCreation";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { CreationRow } from "./CreationRow";
import type { DashboardCreation } from "@/hooks/useDashboard";

// ─── Props ──────────────────────────────────────────────────────────────────

interface TemplatesListProps {
  creations: DashboardCreation[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

// ─── Stable sort: Active → Expired → Deleted, newest first ─────────────────

function sortCreations(list: DashboardCreation[]): DashboardCreation[] {
  return [...list].sort((a, b) => {
    const rankOf = (c: DashboardCreation) =>
      c.is_deleted ? 2 : c.is_expired ? 1 : 0;
    const diff = rankOf(a) - rankOf(b);
    if (diff !== 0) return diff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

// ═════════════════════════════════════════════════════════════════════════════

export function TemplatesList({
  creations,
  onView,
  onDelete,
}: TemplatesListProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteCreation();

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleDeleteClick = useCallback((id: string) => {
    setPendingDeleteId(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDeleteId) return;
    deleteMutation.mutate(pendingDeleteId);
    onDelete(pendingDeleteId);
    setPendingDeleteId(null);
  }, [pendingDeleteId, deleteMutation, onDelete]);

  const handleCancelDelete = useCallback(() => {
    setPendingDeleteId(null);
  }, []);

  // ── MEMOIZED: apply hard-locks then sort ──────────────────────────────
  // applyDeleteLocks checks module-level Map for any ID locked in the
  // last 5 seconds, enforcing is_deleted: true regardless of server data.
  const sorted = useMemo(
    () => sortCreations(applyDeleteLocks(creations)),
    [creations],
  );

  const activeCount = useMemo(
    () => sorted.filter((c) => !c.is_deleted).length,
    [sorted],
  );

  // ── Empty state ───────────────────────────────────────────────────────
  if (sorted.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <FileText
          size={48}
          className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
        />
        <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
          עדיין לא יצרת כרטיסים
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white mb-4 text-hebrew-heading">
          הכרטיסים שלי ({activeCount})
        </h3>

        <div
          className="
            max-h-[340px] overflow-y-auto
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:dark:bg-gray-600
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:hover:bg-gray-400
            [&::-webkit-scrollbar-thumb]:dark:hover:bg-gray-500
          "
        >
          <div className="space-y-3 pr-1">
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

      {/* Delete Confirmation Modal */}
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
