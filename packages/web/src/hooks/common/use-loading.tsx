import { useMemo } from "react";
import { useInitLoading } from "@query/common";
import { useGetDashboardVolume } from "@query/dashboard";
import { useGetPoolList } from "@query/pools";
import { useGetChainInfo, useGetTokens, useGetAllTokenPrices } from "@query/token";
import { useGetLaunchpadActiveProjects } from "@query/launchpad/use-get-launchpad-active-projects";

export const useLoading = () => {
  const { data: initialized } = useInitLoading();
  const { isFetched: isFetchedChainData } = useGetChainInfo();
  const { isFetched: isFetchedTokenData } = useGetTokens();
  const { isFetched: isFetchedTokenPrices } = useGetAllTokenPrices();
  const { isFetched: isFetchedChainList } = useGetChainInfo({ enabled: false });
  const { isFetched: isFetchedPoolData } = useGetPoolList({ enabled: false });
  const { isFetched: isFetchedDashboardVolume } = useGetDashboardVolume({
    enabled: false,
  });

  const { isFetched: isFetchedLaunchpadProjectList } = useGetLaunchpadActiveProjects({ enabled: false });

  const isLoading = useMemo(() => {
    if (initialized) {
      return false;
    }
    return true;
  }, [initialized]);

  const isLoadingTokens = useMemo(() => {
    if (!initialized) {
      return true;
    }
    return !isFetchedTokenData || !isFetchedTokenPrices;
  }, [initialized, isFetchedTokenData, isFetchedTokenPrices]);

  const isLoadingPools = useMemo(() => {
    if (!initialized) {
      return true;
    }
    return !isFetchedPoolData;
  }, [initialized, isFetchedPoolData]);

  const isLoadingTrendingTokens = useMemo(() => {
    if (!initialized) {
      return true;
    }
    return !isFetchedTokenData || !isFetchedTokenPrices || !isFetchedChainList;
  }, [initialized, isFetchedTokenData, isFetchedTokenPrices, isFetchedChainList]);

  const isLoadingHighestAPRPools = useMemo(() => {
    if (!initialized) {
      return true;
    }
    return !isFetchedPoolData;
  }, [initialized, isFetchedPoolData]);

  const isLoadingChainData = useMemo(() => {
    if (!initialized) {
      return true;
    }

    return !isFetchedChainData;
  }, [initialized]);

  const isLoadingDashboardStats = useMemo(() => {
    if (!initialized) {
      return true;
    }
    return !isFetchedDashboardVolume;
  }, [initialized, isFetchedDashboardVolume]);

  const isLoadingLaunchpadProjectList = useMemo(() => {
    if (!initialized) {
      return true;
    }
    return !isFetchedLaunchpadProjectList;
  }, [initialized, isFetchedLaunchpadProjectList]);

  return {
    isLoading,
    isLoadingTokens,
    isLoadingPools,
    isLoadingTrendingTokens,
    isLoadingHighestAPRPools,
    isLoadingChainData,
    isLoadingDashboardStats,
    isLoadingLaunchpadProjectList,
  };
};
