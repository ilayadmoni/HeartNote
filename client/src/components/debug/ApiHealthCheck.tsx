"use client";

/**
 * ApiHealthCheck Component
 *
 * Debug component to test API connectivity.
 * Shows health status of backend and database.
 */

import { useState, useEffect } from "react";
import { checkHealth, type HealthCheckResponse } from "@/lib/fetchClient";

interface HealthStatus {
  loading: boolean;
  connected: boolean;
  data: HealthCheckResponse | null;
  error: string | null;
}

export function ApiHealthCheck() {
  const [status, setStatus] = useState<HealthStatus>({
    loading: true,
    connected: false,
    data: null,
    error: null,
  });

  const runHealthCheck = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));

    const { data, error } = await checkHealth();

    setStatus({
      loading: false,
      connected: !!data,
      data,
      error: error?.detail || error?.message || null,
    });
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white">
            API Health Check
          </h3>
          <button
            onClick={runHealthCheck}
            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        {status.loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            Checking...
          </div>
        ) : status.connected ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              Backend Connected
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>
                <span className="font-medium">Service:</span>{" "}
                {status.data?.service}
              </div>
              <div>
                <span className="font-medium">Version:</span>{" "}
                {status.data?.version}
              </div>
              <div>
                <span className="font-medium">Database:</span>{" "}
                <span
                  className={
                    status.data?.db === "connected"
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {status.data?.db}
                </span>
              </div>
              <div>
                <span className="font-medium">CORS:</span>{" "}
                {status.data?.cors_origins?.join(", ")}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-red-600">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              Connection Failed
            </div>
            {status.error && (
              <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {status.error}
              </div>
            )}
            <div className="text-xs text-gray-500">
              Check that the backend is running on{" "}
              <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:8000"}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
