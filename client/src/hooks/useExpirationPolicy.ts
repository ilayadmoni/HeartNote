/**
 * useExpirationPolicy Hook
 * Fetches the user's subscription tier and the template's expiration policy,
 * then calculates and returns the formatted expiration date (DD/MM/YYYY).
 */

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const supabase = createClient();
import { useAuth } from "@/contexts/AuthContext";

interface ExpirationPolicyResult {
  /** Formatted expiration date string (DD/MM/YYYY) or null */
  expirationDate: string | null;
  /** Whether the data is still loading */
  loading: boolean;
}

interface ExpirationPolicy {
  free_days: number;
  paid_days: number;
}

export function useExpirationPolicy(slug: string): ExpirationPolicyResult {
  const { user } = useAuth();
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setExpirationDate(null);

    let cancelled = false;

    async function fetchPolicy() {
      try {
        const [profileRes, templateRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("subscription_tier")
            .eq("id", user!.id)
            .single(),
          supabase
            .from("templates")
            .select("expiration_policy")
            .eq("slug", slug)
            .single(),
        ]);

        if (cancelled) return;

        if (profileRes.error || templateRes.error) {
          toast.error("לא הצלחנו לטעון את מדיניות התוקף. נסו שוב.");
          setLoading(false);
          return;
        }
        const tier = profileRes.data?.subscription_tier ?? "free";
        const policyRaw = templateRes.data?.expiration_policy ?? null;
        const policy =
          typeof policyRaw === "string"
            ? (JSON.parse(policyRaw) as ExpirationPolicy)
            : (policyRaw as ExpirationPolicy | null);

        if (!policy) {
          setLoading(false);
          return;
        }

        const days = tier !== "free" ? policy.paid_days : policy.free_days;
        if (!Number.isFinite(days)) {
          toast.error("מדיניות התוקף אינה תקינה כרגע.");
          setLoading(false);
          return;
        }
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + days);

        const dd = String(expDate.getDate()).padStart(2, "0");
        const mm = String(expDate.getMonth() + 1).padStart(2, "0");
        const yyyy = expDate.getFullYear();

        setExpirationDate(`${dd}/${mm}/${yyyy}`);
      } catch (err) {
        toast.error("לא הצלחנו לחשב את תוקף היצירה. נסו שוב.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    fetchPolicy();

    return () => {
      cancelled = true;
    };
  }, [user, slug]);

  return { expirationDate, loading };
}
