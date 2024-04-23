import { usePoolData } from "@hooks/pool/use-pool-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useCallback, useMemo, useEffect, useState, useRef } from "react";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { makeId } from "@utils/common";
import { useGetPositionsByAddress } from "@query/positions";
import { useRouter } from "next/router";
import { useLoading } from "./use-loading";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { PATH, PATH_10SECOND, PATH_60SECOND } from "@constants/common.constant";
import { PositionModel } from "@models/position/position-model";
import { AxiosError } from "axios";

export const usePositionData = (address?: string) => {
  const router = useRouter();
  // TODO Question > EarnState.initialData
  const [initialData, setInitialData] = useAtom(EarnState.initialDataData);
  const { back } = router.query;
  const { account, connected: walletConnected } = useWallet();
  const { pools, loading: isLoadingPool } = usePoolData();
  const [shouldShowLoading, setShouldShowLoading] =  useState(false);
  const cachedData = useRef<PositionModel[]>();

  const fetchedAddress = useMemo(() => {
    return address || account?.address;
  }, [account?.address, address]);

  const secToMilliSec = useCallback((sec: number) => {
    return sec * 1000;
  }, []);

  const {
    data = [],
    isError,
    isLoading: isPositionLoading,
    isFetched: isFetchedPosition,
  } = useGetPositionsByAddress(fetchedAddress as string, {
    enabled: !!fetchedAddress && pools.length > 0,
    refetchInterval: () => {
      if (PATH.includes(router.pathname)) return (secToMilliSec((back && !initialData.status) ? 3 : 15) );

      if (PATH_10SECOND.includes(router.pathname)) return secToMilliSec(10);

      if (PATH_60SECOND.includes(router.pathname)) return secToMilliSec(60);

      return false;
    },
    onSuccess(data) {
      const haveNewData = JSON.stringify(data, transformData) !== JSON.stringify(cachedData.current, transformData);
      if(haveNewData) {
        cachedData.current = data;
      }
      setShouldShowLoading(haveNewData);
    },
    onError(err) {
      if((err as AxiosError).response?.status === 404) {
        const haveNewData = JSON.stringify([]) !== JSON.stringify(cachedData.current, transformData);
  
        if(haveNewData) {
          cachedData.current = data;
        }
        setShouldShowLoading(haveNewData);
      }
    }
  });

  function transformData(key: string, value: unknown) {
    return typeof value === "bigint"
            ? value.toString()
            : value;
  }

  useEffect(() => {
    if (isPositionLoading) {
      setInitialData(() => {
        return {
          length: data.length,
          status: false,
          loadingCall: true,
        };
      });
    }
  }, [data.length, isPositionLoading, setInitialData]);
 
  useEffect(() => {
    if (initialData.loadingCall && isFetchedPosition && !isPositionLoading) {
      setInitialData(() => {
        return {
          length: data.length,
          status: false,
          loadingCall: false,
        };
      });
      return;
    }
    if (
      initialData.length !== -1 &&
      data.length !== initialData.length &&
      isFetchedPosition &&
      !isPositionLoading
    ) {
      setInitialData(() => {
        return {
          length: data.length,
          status: true,
          loadingCall: false,
        };
      });
      return;
    }
  }, [initialData.loadingCall, data.length, isFetchedPosition, isPositionLoading, initialData.length, setInitialData]);

  const isEarnPath = PATH.includes(router.pathname);
  
  // * no need to force loading in another page
  const isConnectedCheck = walletConnected && isEarnPath;

  const shouldTriggerLoading = () => {
    // * connected case
    if(isConnectedCheck) {
      return true;
    }

    // * not connected case
    if(!isConnectedCheck && (isPositionLoading || !back)) {
      return true;
    }

    // * [after go back] or [data change while interval refetch]
    if (!!back || initialData.status) {
      return true;
    }

    return false;
  };

  const { isLoadingCommon } = useLoading({
    loadable: shouldTriggerLoading(),
  });

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
  }, [data, getGnotPath, pools]);

  const availableStake = useMemo(() => {
    const unstakedPositions = positions.filter(position => !position.staked);
    return unstakedPositions.length > 0;
  }, [positions]);

  const checkStakedPool = useCallback(
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
      if (!fetchedAddress) {
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
    [fetchedAddress, pools, data, getGnotPath],
  );

  const getPositionsByPoolPath = useCallback(
    (poolPath: string): PoolPositionModel[] => {
      const poolId = makeId(poolPath);
      return getPositionsByPoolId(poolId);
    },
    [getPositionsByPoolId],
  );

  const loading = useMemo(() => {
    const shouldPositionLoading = shouldShowLoading && isPositionLoading;
    
    return (shouldPositionLoading && walletConnected) || isLoadingCommon;
  }, [walletConnected, isLoadingCommon, isPositionLoading]);

  return {
    availableStake,
    isError,
    positions,
    checkStakedPool,
    getPositions,
    getPositionsByPoolId,
    getPositionsByPoolPath,
    isFetchedPosition,
    loading: loading,
    loadingPositionById: isLoadingPool || ( isPositionLoading && walletConnected),
  };
};
