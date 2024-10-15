import { useMemo } from "react";
import { useTokenData } from "@hooks/token/use-token-data";
import { useInitLoading } from "@query/common";
import { useGetDashboardVolume } from "@query/dashboard";
import { useGetPoolList } from "@query/pools";
import { useGetChainInfo } from "@query/token";
import { useGetPositionsByAddress } from "@query/positions";
import { useAddress } from "@hooks/address/use-address";
import { useGetLaunchpadActiveProjects } from "@query/launchpad/use-get-launchpad-active-projects";

export const useLoading = () => {
  const { address } = useAddress();
  const { data: initialized } = useInitLoading();
  const { isFetched: isFetchedTokenData, isFetchedTokenPrices } =
    useTokenData();
  const { isFetched: isFetchedChainList } = useGetChainInfo({ enabled: false });
  const { isFetched: isFetchedPoolData } = useGetPoolList({ enabled: false });
  const { isFetched: isFetchedDashboardVolume } = useGetDashboardVolume({
    enabled: false,
  });

  const { isFetched: isFetchedPosition } = useGetPositionsByAddress(
    {
      address: address || "",
    },
    {
      enabled: false,
    },
  );

  const { isFetched: isFetchedLaunchpadProjectList } =
    useGetLaunchpadActiveProjects({ enabled: false });

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
    return !isFetchedDashboardVolume;
  }, [initialized, isFetchedDashboardVolume]);

  const isLoadingPositions = useMemo(() => {
    if (!initialized) {
      return true;
    }
    if (!address) {
      return false;
    }
    return !isFetchedPosition;
  }, [address, initialized, isFetchedPosition]);

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
    isLoadingDashboardStats,
    isLoadingPositions,
    isLoadingLaunchpadProjectList,
  };
};
