import { usePoolData } from "@hooks/pool/use-pool-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useCallback, useMemo } from "react";
import {
  useGetPositionsByAddress,
  useMakePoolPositions,
} from "@query/positions";
import useRouter from "@hooks/common/use-custom-router";
import { useLoading } from "./use-loading";
import { PATH, PATH_10SECOND, PATH_60SECOND } from "@constants/common.constant";
import { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { PositionModel } from "@models/position/position-model";

function secToMilliSec(sec: number) {
  return sec * 1000;
}

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
  const router = useRouter();
  const { back } = router.query;
  const { account, connected: walletConnected } = useWallet();
  const { pools, loading: isLoadingPool } = usePoolData();

  const fetchedAddress = useMemo(() => {
    return options?.address || account?.address;
  }, [account?.address, options?.address]);

  const {
    data,
    isError,
    isFetched: isFetchedPosition,
    isLoading: isLoadingPosition,
  } = useGetPositionsByAddress({
    address: fetchedAddress as string,
    isClosed: options?.isClosed,
    poolPath: options?.poolPath,
    queryOptions: {
      refetchInterval: () => {
        if (PATH.includes(router.pathname)) return secToMilliSec(back ? 3 : 15);

        if (PATH_10SECOND.includes(router.pathname)) return secToMilliSec(10);

        if (PATH_60SECOND.includes(router.pathname)) return secToMilliSec(60);

        return false;
      },
      ...options?.queryOption,
    },
  });

  const { isLoading: isCommonLoading } = useLoading();

  const {
    data: positions = [],
    isFetched: isFetchedPoolPositions,
    isLoading: isLoadingPoolPositions,
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

  return {
    availableStake,
    isError,
    positions,
    checkStakedPool,
    getPositions,
    isFetchedPosition,
    loading,
    isLoadingPool,
  };
};
