import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCreation } from "@/actions/creations";
import { DASHBOARD_QUERY_KEY } from "@/components/profile/ProfileClient";
import type { DashboardCreation } from "@/hooks/useDashboard";
import type { DashboardData } from "@/hooks/useDashboard";

const LOCK_DURATION_MS = 5_000;
const deleteLocks = new Map<string, number>();

export function isHardLocked(id: string): boolean {
  const expiry = deleteLocks.get(id);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    deleteLocks.delete(id);
    return false;
  }
  return true;
}

export function applyDeleteLocks(
  creations: DashboardCreation[],
): DashboardCreation[] {
  return creations.map((c) =>
    c.is_deleted || isHardLocked(c.id) ? { ...c, is_deleted: true } : c,
  );
}

export function useDeleteCreation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (creationId: string) => {
      const result = await deleteCreation(creationId);
      if (!result.success) throw new Error(result.error);
      return result;
    },

    onMutate: async (creationId: string) => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });

      const previous =
        queryClient.getQueryData<DashboardData>(DASHBOARD_QUERY_KEY);

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

      return { previous, creationId };
    },

    onSuccess: (_result, creationId) => {
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
      if (context?.previous) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previous);
      }
      if (context?.creationId) {
        deleteLocks.delete(context.creationId);
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
}
