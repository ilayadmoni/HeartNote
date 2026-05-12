"use client";

/**
 * QueryProvider
 * Wraps the app with React Query's QueryClientProvider.
 * Configured with sensible defaults for a profile-data heavy app.
 */

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,        // 5 minutes
            gcTime: 30 * 60 * 1000,           // 30 minutes
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
