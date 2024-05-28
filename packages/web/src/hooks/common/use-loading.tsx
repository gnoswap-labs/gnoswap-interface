import { useMemo } from "react";
import { useTokenData } from "@hooks/token/use-token-data";
import { useInitLoading } from "@query/common";
import { useGetDashboardTVL, useGetDashboardVolume } from "@query/dashboard";
import { useGetPoolList } from "@query/pools";
import { useGetChainList } from "@query/token";

export const useLoading = () => {
  const { data: initialized } = useInitLoading();
  const { isFetched: isFetchedTokenData, isFetchedTokenPrices } =
    useTokenData();
  const { isFetched: isFetchedChainList } = useGetChainList({ enabled: false });
  const { isFetched: isFetchedPoolData } = useGetPoolList({ enabled: false });
  const { isFetched: isFetchedDashboardTVL } = useGetDashboardTVL({
    enabled: false,
  });
  const { isFetched: isFetchedDashboardVolume } = useGetDashboardVolume({
    enabled: false,
  });

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
    return !isFetchedPoolData || !isFetchedTokenPrices;
  }, [initialized, isFetchedPoolData, isFetchedTokenPrices]);

  const isLoadingTrendingTokens = useMemo(() => {
    if (!initialized) {
      return true;
    }
    return !isFetchedTokenData || !isFetchedTokenPrices || !isFetchedChainList;
  }, [
    initialized,
    isFetchedTokenData,
    isFetchedTokenPrices,
    isFetchedChainList,
  ]);

  const isLoadingHighestAPRPools = useMemo(() => {
    if (!initialized) {
      return true;
    }
    return !isFetchedPoolData;
  }, [initialized, isFetchedPoolData]);

  const isLoadingDashboardStats = useMemo(() => {
    if (!initialized) {
      return true;
    }
    return !isFetchedDashboardTVL || !isFetchedDashboardVolume;
  }, [initialized, isFetchedDashboardTVL, isFetchedDashboardVolume]);

  return {
    isLoading,
    isLoadingTokens,
    isLoadingPools,
    isLoadingTrendingTokens,
    isLoadingHighestAPRPools,
    isLoadingDashboardStats,
  };
};
