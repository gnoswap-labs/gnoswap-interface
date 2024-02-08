import { usePoolData } from "@hooks/pool/use-pool-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { makeId } from "@utils/common";
import { useGetPositionsByAddress } from "@query/positions";
import { useRouter } from "next/router";
import { useLoading } from "./use-loading";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";

const PATH = ["/earn/pool/[pool-path]", "/earn", "/wallet"];

export const usePositionData = () => {
  const router = useRouter();
  const [initialData, setInitialData] = useAtom(EarnState.initialDataData);
  const { back } = router.query;
  const { account, connected } = useWallet();
  const { pools, loading: isLoadingPool } = usePoolData();
  const [first404, setFirst404] = useState(false);

  const {
    data = [],
    isError,
    isLoading: loading,
    isFetched: isFetchedPosition,
    isFetching,
  } = useGetPositionsByAddress(account?.address as string, {
    enabled: !!account?.address && pools.length > 0 && connected,
    refetchInterval: first404 ? false : PATH.includes(router.pathname)
      ? (((back && !initialData.status) ? 3 : 15) * 1000)
      : false,
  });

  useEffect(() => {
    if (data.length > 0) {
      setFirst404(false);
    } else
    if (isError) {
      setFirst404(true);
    }
  }, [isError, data.length, account?.address]);

  useEffect(() => {
    if (loading) {
      setInitialData(() => {
        return  {
          length: data.length,
          status: false,
          loadingCall: true,
        };
      });
    }
  }, [loading]);
  
  useEffect(() => {
    if (initialData.loadingCall && isFetchedPosition && !loading) {
      setInitialData(() => {
        return  {
          length: data.length,
          status: false,
          loadingCall: false,
        };
      });
      return;
    }
    if (initialData.length !== -1 && data.length !== initialData.length && isFetchedPosition && !loading) {
      setInitialData(() => {
        return {
          length: data.length,
          status: true,
          loadingCall: false,
        };
      });
      return;
    }
  }, [initialData.loadingCall, data.length, isFetchedPosition, loading]);
  
  const { isLoadingCommon } = useLoading({ connected: connected && PATH.includes(router.pathname) || first404, isLoading: loading && !first404, isFetching: isFetching, isBack: !!back, status: initialData.status});
  
  const { getGnotPath } = useGnotToGnot();
  
  const positions = useMemo(() => {
    const poolPositions: PoolPositionModel[] = [];
    data.forEach(position => {
      const pool = pools.find(pool => pool.path === position.poolPath);
      if (pool) {
        const temp = {
          ...pool,
          tokenA: {
            ...pool.tokenA,
            symbol: getGnotPath(pool.tokenA).symbol,
            logoURI: getGnotPath(pool.tokenA).logoURI,
          },
          tokenB: {
            ...pool.tokenB,
            symbol: getGnotPath(pool.tokenB).symbol,
            logoURI: getGnotPath(pool.tokenB).logoURI,
          },
        };
        poolPositions.push(PositionMapper.makePoolPosition(position, temp));
      }
    });
    return poolPositions;
  }, [data]);

  const availableStake = useMemo(() => {
    const unstakedPositions = positions.filter(position => !position.staked);
    return unstakedPositions.length > 0;
  }, [positions]);

  const isStakedPool = useCallback(
    (poolPath: string | null) => {
      if (!poolPath) {
        return false;
      }
      const stakedPoolPaths = positions
        .filter(position => position.staked)
        .map(position => position.poolPath);
      return stakedPoolPaths.includes(poolPath);
    },
    [positions],
  );

  const getPositions = useCallback(() => {
    return positions;
  }, [positions]);

  const getPositionsByPoolId = useCallback(
    (poolId: string): PoolPositionModel[] => {
      if (!account?.address) {
        return [];
      }
      if (pools.length === 0) {
        return [];
      }
      const poolPositions: PoolPositionModel[] = [];
      data.forEach(position => {
        const pool = pools.find(
          pool => pool.path === position.poolPath && pool.id === poolId,
        );
        if (pool) {
          const temp = {
            ...pool,
            tokenA: {
              ...pool.tokenA,
              path: getGnotPath(pool.tokenA).path,
              name: getGnotPath(pool.tokenA).name,
              symbol: getGnotPath(pool.tokenA).symbol,
              logoURI: getGnotPath(pool.tokenA).logoURI,
            },
            tokenB: {
              ...pool.tokenB,
              path: getGnotPath(pool.tokenB).path,
              name: getGnotPath(pool.tokenB).name,
              symbol: getGnotPath(pool.tokenB).symbol,
              logoURI: getGnotPath(pool.tokenB).logoURI,
            },
          };
          poolPositions.push(PositionMapper.makePoolPosition(position, temp));
        }
      });
      return poolPositions;
    },
    [account?.address, pools, data],
  );

  const getPositionsByPoolPath = useCallback(
    (poolPath: string): PoolPositionModel[] => {
      const poolId = makeId(poolPath);
      return getPositionsByPoolId(poolId);
    },
    [getPositionsByPoolId],
  );
  
  return {
    availableStake,
    isError,
    positions,
    isStakedPool,
    getPositions,
    getPositionsByPoolId,
    getPositionsByPoolPath,
    isFetchedPosition,
    loading: (loading && connected) || isLoadingCommon,
    loadingPositionById: isLoadingPool || (loading && connected),
  };
};
