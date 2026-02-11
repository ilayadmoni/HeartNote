/**
 * useDashboard Hook
 *
 * Fetches user dashboard stats and creation history from
 * GET /api/v1/user/dashboard.
 * Aligned with new DB schema (creations table, subscription_tier).
 */

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/fetchClient";
import { useAuth } from "@/contexts/AuthContext";

// =============================================================================
// Types (mirror the backend DashboardResponse)
// =============================================================================

export interface DashboardStats {
  creations_count: number;
  creations_left_free: number;
  creations_left_pro: number | null;
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

  const fetchDashboard = useCallback(async () => {
    if (!user) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: apiErr } = await api.get<DashboardData>(
        "/user/dashboard",
      );

      if (apiErr) {
        throw apiErr;
      }

      if (!data) {
        throw { message: "No dashboard data returned", status: 500 };
      }

      setDashboard(data);
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || "שגיאה בטעינת הנתונים");
    } finally {
      setLoading(false);
    }
  }, [user]);

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
