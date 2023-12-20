import { usePoolData } from "@hooks/pool/use-pool-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useGnoswapContext } from "./use-gnoswap-context";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useAtom } from "jotai";
import { PoolState } from "@states/index";
import { makeId } from "@utils/common";

export const usePositionData = () => {
  const { positionRepository } = useGnoswapContext();
  const { account, connected } = useWallet();
  const { pools } = usePoolData();
  const [isError, setIsError] = useState(false);
  const { getGnotPath } = useGnotToGnot();
  const [isFetchedPosition, setIsFetchedPosition] = useState(false);
  const [positions, setPositions] = useAtom(PoolState.positions);
  const [loading, setLoading] = useState<boolean>(true);

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

  const getPositions = useCallback(async (): Promise<PoolPositionModel[]> => {
    if (!account?.address) {
      setPositions([]);
      return [];
    }
    if (pools.length === 0) {
      setPositions([]);
      return [];
    }
    setIsError(false);

    setLoading(true);
    return positionRepository
      .getPositionsByAddress(account.address)
      .then(positions => {
        const poolPositions: PoolPositionModel[] = [];
        positions.forEach(position => {
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
        setPositions(positions);
        setIsError(false);
        setIsFetchedPosition(true);
        return poolPositions;
      })
      .catch(() => {
        setIsFetchedPosition(true);
        setPositions([]);
        setIsError(true);
        return [];
      })
      .finally(() => setLoading(false));
  }, [account?.address, pools, positionRepository, setPositions]);

  const getPositionsByPoolId = useCallback(
    async (poolId: string): Promise<PoolPositionModel[]> => {
      if (!account?.address) {
        return [];
      }
      if (pools.length === 0) {
        return [];
      }
      setIsError(false);

      return positionRepository
        .getPositionsByAddress(account.address)
        .then(positions => {
          const poolPositions: PoolPositionModel[] = [];
          positions.forEach(position => {
            const pool = pools.find(
              pool => pool.path === position.poolPath && pool.id === poolId,
            );
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
              poolPositions.push(
                PositionMapper.makePoolPosition(position, temp),
              );
            }
          });
          setIsError(false);
          return poolPositions;
        })
        .catch(() => {
          setIsError(true);
          return [];
        });
    },
    [account?.address, pools, positionRepository],
  );

  const getPositionsByPoolPath = useCallback(
    async (poolPath: string): Promise<PoolPositionModel[]> => {
      const poolId = makeId(poolPath);
      return getPositionsByPoolId(poolId);
    },
    [getPositionsByPoolId],
  );

  useEffect(() => {
    getPositions();
  }, [connected, getPositions]);

  return {
    availableStake,
    isError,
    positions,
    isStakedPool,
    getPositions,
    getPositionsByPoolId,
    getPositionsByPoolPath,
    isFetchedPosition,
    loading,
    setLoading,
  };
};
