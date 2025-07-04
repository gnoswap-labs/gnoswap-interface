import React from "react";
import { useQueryClient, QueryKey } from "@tanstack/react-query";

/**
 * Hook to invalidate the React Query cache to automatically trigger refetching.
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  /**
   * Triggers React Query to automatically fetch data again in the background by invalidating the given query keys.
   */
  const invalidateQueryKey = React.useCallback(
    async (context: string, queryKeys: QueryKey[]) => {
      const results = await Promise.allSettled(queryKeys.map(queryKey => queryClient.invalidateQueries(queryKey)));

      const failures = results
        .map((r, i) => (r.status === "rejected" ? { idx: i, err: r.reason } : null))
        .filter((x): x is { idx: number; err: unknown } => x !== null);

      failures.forEach(({ idx, err }) =>
        console.warn(`${context}: invalidateQueries failed for key[${idx}]:`, queryKeys[idx], err),
      );
    },
    [queryClient],
  );

  return { invalidateQueryKey };
}
