/**
 * useDeleteCreation Hook
 *
 * React Query mutation with a Hard-Lock strategy to prevent UI flicker.
 *
 * Architecture:
 * - Module-level `deleteLocks` Map stores hard-locked IDs with expiry timestamps
 * - Survives React re-renders and component remounts
 * - Lock persists for 5 seconds, ensuring no background fetch can revert UI
 *
 * Mutation lifecycle:
 * 1. onMutate: Cancel queries → snapshot → lock ID → update cache
 * 2. onSuccess: Re-lock cache aggressively (guards against revalidatePath)
 * 3. onError: Rollback cache + remove lock
 * 4. onSettled: Await final invalidation (300ms server delay ensures consistency)
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCreation } from "@/actions/creations";
import { DASHBOARD_QUERY_KEY } from "../ProfileClient";
import type { DashboardCreation } from "@/hooks/useDashboard";
import type { DashboardData } from "@/hooks/useDashboard";

// ─── Module-level hard-lock map (survives re-renders & remounts) ────────────

const LOCK_DURATION_MS = 5_000;
const deleteLocks = new Map<string, number>();

/** Check if an ID is currently hard-locked. */
export function isHardLocked(id: string): boolean {
  const expiry = deleteLocks.get(id);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    deleteLocks.delete(id);
    return false;
  }
  return true;
}

/** Apply hard-locks + is_deleted to a creations array for rendering. */
export function applyDeleteLocks(
  creations: DashboardCreation[],
): DashboardCreation[] {
  return creations.map((c) =>
    c.is_deleted || isHardLocked(c.id) ? { ...c, is_deleted: true } : c,
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useDeleteCreation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (creationId: string) => {
      const result = await deleteCreation(creationId);
      if ("error" in result) throw new Error(result.error);
      return result;
    },

    onMutate: async (creationId: string) => {
      // 1. BLOCK: Cancel all outgoing dashboard fetches (MUST await)
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });

      // 2. SNAPSHOT: Capture current cache for rollback
      const previous =
        queryClient.getQueryData<DashboardData>(DASHBOARD_QUERY_KEY);

      // 3. HARD-LOCK: Register ID in module-level lock (5-second TTL)
      deleteLocks.set(creationId, Date.now() + LOCK_DURATION_MS);

      // 4. CACHE TRANSFORM: Set is_deleted: true immediately
      queryClient.setQueryData<DashboardData>(
        DASHBOARD_QUERY_KEY,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            creations: old.creations.map((c) =>
              c.id === creationId ? { ...c, is_deleted: true } : c,
            ),
          };
        },
      );

      return { previous, creationId };
    },

    onSuccess: (_result, creationId) => {
      // LOCK THE CACHE: Re-assert is_deleted: true so any background
      // fetch or revalidatePath response cannot overwrite it.
      deleteLocks.set(creationId, Date.now() + LOCK_DURATION_MS);

      queryClient.setQueryData<DashboardData>(
        DASHBOARD_QUERY_KEY,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            creations: old.creations.map((c) =>
              c.id === creationId ? { ...c, is_deleted: true } : c,
            ),
          };
        },
      );
    },

    onError: (_err, _id, context) => {
      // ROLLBACK: Restore cache and remove lock
      if (context?.previous) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previous);
      }
      if (context?.creationId) {
        deleteLocks.delete(context.creationId);
      }
    },

    onSettled: async () => {
      // FINAL SYNC: The 300ms server-side delay ensures DB consistency.
      // Await the refetch so React Query finishes before mutation ends.
      await queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
}
