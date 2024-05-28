import { useMemo } from "react";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useTokenData } from "@hooks/token/use-token-data";
import { useInitLoading } from "@query/common";
import { useGetDashboardTVL, useGetDashboardVolume } from "@query/dashboard";

export const useLoading = () => {
  const { data: initialized } = useInitLoading();
  const {
    loading: isLoadingTokenData,
    isFetched: isFetchedTokenData,
    isFetchedTokenPrices,
    isLoadingTokenPrice,
  } = useTokenData();
  const { loading: isLoadingPoolData, isFetchedPools: isFetchedPoolData } =
    usePoolData();
  const { isLoading: isLoadingDashboardTVL, isFetched: isFetchedDashboardTVL } =
    useGetDashboardTVL();
  const {
    isLoading: isLoadingDashboardVolume,
    isFetched: isFetchedDashboardVolume,
  } = useGetDashboardVolume();

  const isLoading = useMemo(() => {
    if (!initialized) {
      return true;
    }
    if (
      isFetchedPoolData &&
      isFetchedTokenData &&
      isFetchedDashboardTVL &&
      isFetchedDashboardVolume &&
      isFetchedTokenPrices
    ) {
      return false;
    }
    return (
      isLoadingPoolData ||
      isLoadingTokenData ||
      isLoadingDashboardTVL ||
      isLoadingDashboardVolume ||
      isLoadingTokenPrice
    );
  }, [
    initialized,
    isFetchedPoolData,
    isFetchedTokenData,
    isFetchedDashboardTVL,
    isFetchedDashboardVolume,
    isFetchedTokenPrices,
    isLoadingPoolData,
    isLoadingTokenData,
    isLoadingDashboardTVL,
    isLoadingDashboardVolume,
    isLoadingTokenPrice,
  ]);

  return {
    isLoading,
  };
};
