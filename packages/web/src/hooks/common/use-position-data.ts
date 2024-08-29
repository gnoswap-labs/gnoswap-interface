import { usePoolData } from "@hooks/pool/use-pool-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useCallback, useEffect, useMemo } from "react";
import {
  useGetPositionsByAddress,
  useMakePoolPositions,
} from "@query/positions";
import { useLoading } from "./use-loading";
import { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { PositionModel } from "@models/position/position-model";

export interface UsePositionDataOption {
  address?: string;
  isClosed?: boolean;
  poolPath?: string | null;
  queryOption?: UseQueryOptions<
    PositionModel[],
    Error,
    PositionModel[],
    QueryKey
  >;
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
  });

  const { isLoading: isCommonLoading } = useLoading();

  const {
    data: positions = [],
    isFetched: isFetchedPoolPositions,
    isLoading: isLoadingPoolPositions,
    refetch: refetchPooPositions,
  } = useMakePoolPositions(data, pools, isFetchedPosition);

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
      const stakedPoolPaths = positions
        .filter(position => position.staked)
        .map(position => position.poolPath);
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
      (isLoadingPool ||
        isLoadingPosition ||
        isCommonLoading ||
        isLoadingPoolPositions) &&
      walletConnected &&
      !!account
    );
  }, [
    isCommonLoading,
    isLoadingPool,
    isLoadingPoolPositions,
    isLoadingPosition,
    walletConnected,
    account,
  ]);

  useEffect(() => {
    refetchPooPositions();
  }, [data, pools]);

  return {
    availableStake,
    isError,
    positions,
    refetch,
    checkStakedPool,
    getPositions,
    isFetchedPosition: isFetchedPosition && isFetchedPoolPositions,
    loading,
    isLoadingPool,
  };
};
