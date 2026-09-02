/**
 * useServerAction — Client-side executor for protected Server Actions.
 *
 * Wraps any `ActionResult<T>` promise and:
 *   1. Returns `T` on success.
 *   2. On 401 → signs out, shows toast, redirects to login modal.
 *   3. On other errors → throws `ActionError` for the caller to handle.
 *
 * Usage:
 *   const { execute } = useServerAction();
 *
 *   // Inside an event handler or React Query mutationFn:
 *   const data = await execute(getDashboard());
 *   // `data` is typed as DashboardResponse
 *
 *   // 401s are handled automatically — no manual checking needed.
 */

"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ActionError, type ActionResult } from "@/lib/action-response";

const LOGIN_REDIRECT = "/gallery?login=true";

export function useServerAction() {
  const { signOut } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  /**
   * Execute a server action and handle 401 automatically.
   * Throws `ActionError` for non-401 failures so the caller
   * can display inline errors, trigger React Query rollbacks, etc.
   */
  const execute = useCallback(
    async <T>(action: Promise<ActionResult<T>>): Promise<T> => {
      const result = await action;

      if (result.success) return result.data;

      if (result.code === 401) {
        try {
          await signOut();
        } catch {
          // Redirect still happens below even if client sign-out fails.
        }
        toast.error(t("session.expiredTitle"), {
          description: t("session.expiredDescription"),
        });
        router.push(LOGIN_REDIRECT);
        throw new ActionError(result.error, result.code);
      }

      throw new ActionError(result.error, result.code);
    },
    [signOut, router, t],
  );

  return { execute };
}
