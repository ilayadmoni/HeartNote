"use client";

/**
 * usePolicies — Fetches free and paid subscription_policies rows.
 * Used by CreationConfirmModal to display per-tier quota and expiry info.
 */

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface PolicyData {
  /** Max creations allowed (null = unlimited) */
  limit: number | null;
  /** Seconds until expiry (null = no expiry) */
  expirySeconds: number | null;
}

export interface UsePoliciesResult {
  freePolicy: PolicyData;
  paidPolicy: PolicyData;
}

export function usePolicies(subscriptionTier: string): UsePoliciesResult {
  const [freePolicy, setFreePolicy] = useState<PolicyData>({ limit: 3, expirySeconds: null });
  const [paidPolicy, setPaidPolicy] = useState<PolicyData>({ limit: null, expirySeconds: null });

  useEffect(() => {
    let cancelled = false;

    async function fetchPolicies() {
      const { data: fp } = await supabase
        .from("subscription_policies")
        .select("creation_limit, default_expiry")
        .eq("tier_code", "free")
        .single();

      if (!cancelled) {
        setFreePolicy({
          limit: Number.isFinite(Number(fp?.creation_limit)) ? Number(fp!.creation_limit) : 3,
          expirySeconds: Number.isFinite(Number(fp?.default_expiry)) ? Number(fp!.default_expiry) : null,
        });
      }

      if (subscriptionTier !== "free") {
        const { data: pp } = await supabase
          .from("subscription_policies")
          .select("creation_limit, default_expiry")
          .eq("tier_code", subscriptionTier)
          .single();

        if (!cancelled) {
          const rawLimit = pp?.creation_limit;
          setPaidPolicy({
            limit: rawLimit == null ? null : Number.isFinite(Number(rawLimit)) ? Number(rawLimit) : null,
            expirySeconds: Number.isFinite(Number(pp?.default_expiry)) ? Number(pp!.default_expiry) : null,
          });
        }
      }
    }

    fetchPolicies();
    return () => { cancelled = true; };
  }, [subscriptionTier]);

  return { freePolicy, paidPolicy };
}
