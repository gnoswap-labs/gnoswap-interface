import { useMemo } from "react";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { PoolModel } from "@models/pool/pool-model";
import { PositionModel } from "@models/position/position-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { isGNOTPath } from "@utils/common";

export const useMakePoolPositions = (
  positions: PositionModel[] | undefined,
  pools: PoolModel[],
  isFetchedPosition: boolean,
  isFetchedPools: boolean,
  scopeId?: string,
) => {
  const isEnabled = isFetchedPosition && isFetchedPools;

  const data = useMemo(() => {
    if (!isEnabled) return [];

    const poolPositions: PoolPositionModel[] = [];
    positions?.forEach(position => {
      const pool = pools.find(pool => pool.poolPath === position.poolPath);
      if (pool) {
        const tokenA = isGNOTPath(pool.tokenA.path) ? GNOT_TOKEN : pool.tokenA;
        const tokenB = isGNOTPath(pool.tokenB.path) ? GNOT_TOKEN : pool.tokenB;
        const currentPool = {
          ...pool,
          tokenA,
          tokenB,
        };
        poolPositions.push(PositionMapper.makePoolPosition(position, currentPool));
      }
    });

    return poolPositions;
  }, [isEnabled, positions, pools, scopeId]);

  return {
    data,
    isFetched: isEnabled,
    isLoading: !isEnabled,
  };
};
