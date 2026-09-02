"use client";

/**
 * useExpirationPolicy Hook
 * Reads the template's expiration policy from the shared templates cache
 * and the user's tier from `useProfile`, then derives the formatted
 * expiration date (DD/MM/YYYY) without issuing any new network requests.
 */

import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "./useProfile";
import { useTemplateBySlug } from "./useTemplatesQuery";

interface ExpirationPolicyResult {
  expirationDate: string | null;
  loading: boolean;
}

interface ExpirationPolicy {
  free_days: number;
  paid_days: number;
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function useExpirationPolicy(slug: string): ExpirationPolicyResult {
  const t = useTranslations("editor");
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { template, isLoading: templatesLoading, error } = useTemplateBySlug(slug);

  useEffect(() => {
    if (error) toast.error(t("errors.expirationPolicyLoadFailed"));
  }, [error, t]);

  if (!user || !slug) return { expirationDate: null, loading: false };
  if (templatesLoading || profileLoading) {
    return { expirationDate: null, loading: true };
  }

  const policyRaw = template?.expiration_policy ?? null;
  const policy =
    typeof policyRaw === "string"
      ? (JSON.parse(policyRaw) as ExpirationPolicy)
      : (policyRaw as unknown as ExpirationPolicy | null);

  if (!policy) return { expirationDate: null, loading: false };

  const tier = profile?.subscription.tier ?? "free";
  const days = tier !== "free" ? policy.paid_days : policy.free_days;

  if (!Number.isFinite(days)) {
    return { expirationDate: null, loading: false };
  }

  const expDate = new Date();
  expDate.setDate(expDate.getDate() + days);

  return { expirationDate: formatDate(expDate), loading: false };
}
