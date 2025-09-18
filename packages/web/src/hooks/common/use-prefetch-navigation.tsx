import React from "react";
import { useRouter } from "next/router";

import { QueryParameter } from "./use-custom-router";

import { PAGE_PATH, PAGE_PATH_TYPE } from "@constants/page.constant";
import { makeRouteUrl } from "@utils/page.utils";

interface UsePrefetchNavigationOptions {
  pageType: PAGE_PATH_TYPE;
  params?: QueryParameter;
  hash?: string | number;
  enabled?: boolean;
}

/**
 * Route prefetching
 *
 * Preloads pages during events like mouse hover
 * To provide fast page transitions during actual navigation.
 *
 * @param options
 * @returns prefetchPath, prefetch
 *
 *  * @example
 * ```typescript
 * const { prefetch } = usePrefetchNavigation({
 *   pageType: "POOL",
 *   params: {
 *     [QUERY_PARAMETER.POOL_PATH]: poolId,
 *     [QUERY_PARAMETER.ADDRESS]: address,
 *   },
 *   hash: positionId,
 * });
 *
 * const handleMouseEnter = () => {
 *   prefetch();
 * };
 * ```
 */
export const usePrefetchNavigation = (options: UsePrefetchNavigationOptions) => {
  const router = useRouter();
  const { pageType, params, hash, enabled = true } = options;

  const prefetchPath = React.useMemo(() => {
    if (!enabled || !pageType) return null;

    try {
      return makeRouteUrl(PAGE_PATH[pageType], params, hash);
    } catch (error) {
      console.warn("Failed to create prefetch path:", error);
      return null;
    }
  }, [pageType, params, hash, enabled]);

  const prefetch = React.useCallback(() => {
    if (!prefetchPath || !enabled) return;

    router.prefetch(prefetchPath);
  }, [router, prefetchPath, enabled]);

  return {
    prefetchPath,
    prefetch,
  };
};
