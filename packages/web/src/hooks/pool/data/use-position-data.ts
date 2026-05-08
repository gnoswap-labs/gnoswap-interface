import { usePoolData } from "@hooks/pool/data/use-pool-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useCallback, useEffect, useMemo } from "react";
import { useGetPositionsByAddress, useMakePoolPositions } from "@query/positions";
import { useLoading } from "@hooks/common/use-loading";
import { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { PositionModel } from "@models/position/position-model";

export interface UsePositionDataOption {
  address?: string;
  isClosed?: boolean;
  poolPath?: string | null;
  page?: number;
  limit?: number;
  withClosed?: boolean;
  withAvailableStake?: boolean;
  scopeId?: string;
  queryOption?: UseQueryOptions<PositionModel[], Error, PositionModel[], QueryKey>;
}

export const usePositionData = (options?: UsePositionDataOption) => {
  const { account, connected: walletConnected } = useWallet();
  const { pools, loading: isLoadingPool } = usePoolData();

  const fetchedAddress = useMemo(() => {
    return options?.address || account?.address;
  }, [account?.address, options?.address]);

  const {
    data,
    refetch,
    isError,
    isFetched: isFetchedPosition,
    isLoading: isLoadingPosition,
  } = useGetPositionsByAddress({
    address: fetchedAddress as string,
    isClosed: options?.isClosed,
    poolPath: options?.poolPath,
    page: options?.page,
    limit: options?.limit,
    withClosed: options?.withClosed,
    withAvailableStake: options?.withAvailableStake,
  });

  const { totalCount: totalPositionCount = 0, positions: rawPositions = [] } = data ?? {};

  const { isLoading: isCommonLoading } = useLoading();

  const {
    data: positions = [],
    isFetched: isFetchedPoolPositions,
    isLoading: isLoadingPoolPositions,
    refetch: refetchPooPositions,
  } = useMakePoolPositions(rawPositions, pools, isFetchedPosition, options?.scopeId || "");

  const availableStake = useMemo(() => {
    if (!isFetchedPoolPositions) {
      return false;
    }
    const unstakedPositions = positions.filter(position => !position.staked);
    return unstakedPositions.length > 0;
  }, [isFetchedPoolPositions, positions]);

  const checkStakedPool = useCallback(
    (poolPath: string | null) => {
      if (!poolPath) {
        return false;
      }
      if (!isFetchedPoolPositions) {
        return false;
      }
      const stakedPoolPaths = positions.filter(position => position.staked).map(position => position.poolPath);
      return stakedPoolPaths.includes(poolPath);
    },
    [isFetchedPoolPositions, positions],
  );

  const getPositions = useCallback(() => {
    if (!isFetchedPoolPositions) {
      return [];
    }
    return positions;
  }, [isFetchedPoolPositions, positions]);

  const loading = useMemo(() => {
    return (
      (isLoadingPool || isLoadingPosition || isCommonLoading || isLoadingPoolPositions) && walletConnected && !!account
    );
  }, [isCommonLoading, isLoadingPool, isLoadingPoolPositions, isLoadingPosition, walletConnected, account]);

  useEffect(() => {
    refetchPooPositions();
  }, [data, pools, refetchPooPositions]);

  return {
    availableStake,
    isError,
    positions,
    totalPositionCount,
    refetch,
    checkStakedPool,
    getPositions,
    isFetchedPosition: isFetchedPosition && isFetchedPoolPositions,
    loading,
    isLoadingPool,
  };
};
