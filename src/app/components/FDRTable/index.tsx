"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FDRDataProvider } from "./context/FDRDataProvider";
import { FDRTableContainer } from "./FDRTableContainer";

const queryClient = new QueryClient();

/**
 * Main FDR Table component
 * Wraps the table in necessary providers (React Query, Data Context)
 */
export default function FDRTable() {
  return (
    <QueryClientProvider client={queryClient}>
      <FDRDataProvider>
        <FDRTableContainer />
      </FDRDataProvider>
    </QueryClientProvider>
  );
}

// Re-export types for external use
export type { SortBy, Difficulty, GameweekStats } from "./types";
