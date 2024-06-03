import { usePoolData } from "@hooks/pool/use-pool-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useCallback, useMemo } from "react";
import { makeId } from "@utils/common";
import {
  useGetPositionsByAddress,
  useMakePoolPositions,
} from "@query/positions";
import useRouter from "@hooks/common/use-custom-router";
import { useLoading } from "./use-loading";
import { PATH, PATH_10SECOND, PATH_60SECOND } from "@constants/common.constant";

function secToMilliSec(sec: number) {
  return sec * 1000;
}

export interface UsePositionDataOption {
  address?: string;
  isClosed?: boolean;
}

export const usePositionData = (options?: UsePositionDataOption) => {
  const router = useRouter();
  const { back } = router.query;
  const { account, connected: walletConnected } = useWallet();
  const { pools, isFetchedPools } = usePoolData();

  const fetchedAddress = useMemo(() => {
    return options?.address || account?.address;
  }, [account?.address, options?.address]);

  const {
    data,
    isError,
    isFetched: isFetchedPosition,
  } = useGetPositionsByAddress(fetchedAddress as string, {
    isClosed: options?.isClosed,
    queryOptions: {
      refetchInterval: () => {
        if (PATH.includes(router.pathname)) return secToMilliSec(back ? 3 : 15);

        if (PATH_10SECOND.includes(router.pathname)) return secToMilliSec(10);

        if (PATH_60SECOND.includes(router.pathname)) return secToMilliSec(60);

        return false;
      },
    },
  });

  const { isLoading } = useLoading();

  const { data: positions = [], isFetched: isFetchedPoolPositions } =
    useMakePoolPositions(data, pools, isFetchedPosition);

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

  const getPositionsByPoolId = useCallback(
    (poolId: string): PoolPositionModel[] => {
      if (!isFetchedPoolPositions) {
        return [];
      }
      return positions.filter(
        poolPositions => makeId(poolPositions.poolPath) === poolId,
      );
    },
    [isFetchedPoolPositions, positions],
  );

  const getPositionsByPoolPath = useCallback(
    (poolPath: string): PoolPositionModel[] => {
      const poolId = makeId(poolPath);
      return getPositionsByPoolId(poolId);
    },
    [getPositionsByPoolId],
  );

  const loading = useMemo(() => {
    return (!isFetchedPools && walletConnected) || isLoading;
  }, [isFetchedPools, isLoading, walletConnected]);

  const loadingPositionById = useMemo(() => {
    return (!isFetchedPoolPositions && walletConnected) || isLoading;
  }, [isFetchedPoolPositions, isLoading, walletConnected]);

  return {
    availableStake,
    isError,
    positions,
    checkStakedPool,
    getPositions,
    getPositionsByPoolId,
    getPositionsByPoolPath,
    isFetchedPosition,
    loading,
    loadingPositionById,
  };
};
