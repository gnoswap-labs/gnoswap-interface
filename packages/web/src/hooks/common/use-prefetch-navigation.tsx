import React from "react";
import { useRouter } from "next/router";

import { QueryParameter } from "./use-custom-router";

import { PAGE_PATH, PAGE_PATH_TYPE } from "@constants/page.constant";
import { ConnectionType } from "@app-types/navigator";
import { makeRouteUrl } from "@utils/page.utils";

interface UsePrefetchNavigationOptions {
  pageType: PAGE_PATH_TYPE;
  params?: QueryParameter;
  hash?: string | number;
  enabled?: boolean;
  respectConnection?: boolean;
}

interface ConnectionInfo {
  /** Network connection type using standardized enum values */
  effectiveType: ConnectionType;
  /** Download bandwidth estimate in Mbps */
  downlink: number;
  /** Round-trip time estimate in milliseconds */
  rtt: number;
  /** Whether data saver mode is enabled */
  saveData: boolean;
  /** Whether prefetching should be allowed based on network conditions */
  shouldPrefetch: boolean;
}

/**
 * Route prefetching with network-aware optimization using the Connection API
 *
 * This hook implements intelligent route prefetching that adapts to the user's network conditions
 * using the Network Information API (Connection API). It provides fast page transitions while
 * respecting bandwidth limitations and user preferences.
 *
 * The Connection API provides information about the system's connection in terms of general
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API MDN - Network Information API}
 * @see {@link https://wicg.github.io/netinfo/ W3C Network Information API Specification}
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
  const { pageType, params, hash, enabled = true, respectConnection = true } = options;

  /**
   * ConnectionInfo: API supported with network data
   * null: Connection API not supported
   */
  const [connectionInfo, setConnectionInfo] = React.useState<ConnectionInfo | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !respectConnection) return;

    /**
     * Network Information API (Connection API)
     *
     * Provides information about the system's connection in terms of general connection type
     * and quality. The API exposes a connection object on the navigator interface.
     *
     * Key Properties:
     * - effectiveType: '2g' | '3g' | '4g' | 'slow-2g' - Network effective connection type
     * - downlink: number - Effective bandwidth estimate in Mbps
     * - rtt: number - Effective round-trip time estimate in milliseconds
     * - saveData: boolean - Whether the user has requested a reduced data usage mode
     *
     * Only supported in Chrome/Edge browsers as of 2025
     */
    const connection = navigator.connection;

    const updateConnectionInfo = () => {
      if (!connection) {
        // Connection API not supported - keep null state (Safari, Firefox)
        setConnectionInfo(null);
        return;
      }

      // Convert raw API values to typed enum values
      const rawEffectiveType = connection.effectiveType || "4g";
      const effectiveType = rawEffectiveType as ConnectionType;
      const downlink = connection.downlink || 0;
      const rtt = connection.rtt || 1000;
      const saveData = connection.saveData || false;

      // IIFE - Determine if prefetching should be allowed based on network performance
      const shouldPrefetch: boolean = (() => {
        // Never prefetch if data saver mode is enabled
        if (saveData) return false;
        // Never prefetch on very slow connections
        if (effectiveType === ConnectionType.SLOW_2G || effectiveType === ConnectionType._2G) return false;

        // Network performance thresholds for prefetching
        const NETWORK_THRESHOLDS = {
          // Standard thresholds for 4G connections
          DEFAULT: {
            BANDWIDTH: 2.0, // Mbps - minimum bandwidth for fast page loading
            LATENCY: 250, // ms - maximum latency for responsive user experience
          },
          // Stricter thresholds for mobile 3G connections
          MOBILE_3G: {
            BANDWIDTH: 3.0, // Mbps - higher bandwidth requirement for 3G
            LATENCY: 200, // ms - lower latency requirement for 3G
          },
        };

        // Apply stricter conditions for 3G connections
        if (effectiveType === ConnectionType._3G) {
          return downlink >= NETWORK_THRESHOLDS.MOBILE_3G.BANDWIDTH && rtt <= NETWORK_THRESHOLDS.MOBILE_3G.LATENCY;
        }

        // Apply standard conditions for 4G connections
        if (effectiveType === ConnectionType._4G) {
          return downlink >= NETWORK_THRESHOLDS.DEFAULT.BANDWIDTH && rtt <= NETWORK_THRESHOLDS.DEFAULT.LATENCY;
        }

        // Disallow prefetching for other connection types
        return false;
      })();

      setConnectionInfo({
        effectiveType,
        downlink,
        rtt,
        saveData,
        shouldPrefetch,
      });
    };

    // Initialize connection info
    updateConnectionInfo();

    // Listen for network changes
    if (connection && connection.addEventListener) {
      connection.addEventListener("change", updateConnectionInfo);
      return () => {
        connection.removeEventListener("change", updateConnectionInfo);
      };
    }
  }, [respectConnection]);

  // Generate the prefetch path using route configuration
  const prefetchPath = React.useMemo(() => {
    if (!enabled || !pageType) return null;

    try {
      return makeRouteUrl(PAGE_PATH[pageType], params, hash);
    } catch (error) {
      console.warn("Failed to create prefetch path:", error);
      return null;
    }
  }, [pageType, params, hash, enabled]);

  // Determine if prefetching is allowed based on all conditions
  const canPrefetch: boolean = React.useMemo(() => {
    if (!prefetchPath || !enabled) return false;
    if (!respectConnection) return true; // Skip network checks if disabled
    if (!connectionInfo) return false; // Block if Connection API not supported

    return connectionInfo.shouldPrefetch;
  }, [prefetchPath, enabled, respectConnection, connectionInfo]);

  // Execute the prefetch if conditions are met
  const prefetch = React.useCallback(() => {
    if (!canPrefetch) return;

    router.prefetch(prefetchPath!);
  }, [router, prefetchPath, canPrefetch]);

  return {
    prefetchPath,
    prefetch,
  };
};
