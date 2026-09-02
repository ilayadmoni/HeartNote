"use client";

/**
 * useDashboard Hook
 *
 * Fetches user dashboard stats and creation history using
 * server actions. Handles auth expiry via useServerAction.
 * Aligned with new DB schema (creations table, subscription_tier).
 */

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { getDashboard } from "@/actions/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useServerAction } from "@/hooks/useServerAction";

// =============================================================================
// Types (mirror the backend DashboardResponse)
// =============================================================================

export interface DashboardStats {
  creations_count_free: number;
  creations_count_pro: number;
  additional_creation_free: number;
  additional_creation_pro: number;
  subscription_tier: string;
}

export interface DashboardCreation {
  id: string;
  template_slug: string;
  template_name: string | null;
  created_at: string;
  expires_at: string | null;
  is_expired: boolean;
  is_paid: boolean | null;
  is_deleted: boolean;
  verification_code: string | null;
}

export interface DashboardData {
  stats: DashboardStats;
  creations: DashboardCreation[];
}

// =============================================================================
// Hook
// =============================================================================

interface UseDashboardReturn {
  dashboard: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { execute } = useServerAction();
  const t = useTranslations("profile");

  const fetchDashboard = useCallback(async () => {
    if (!user) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await execute(getDashboard());
      setDashboard(data);
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || t("dashboard.loadError"));
    } finally {
      setLoading(false);
    }
  }, [user, execute, t]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refresh: fetchDashboard,
  };
}
