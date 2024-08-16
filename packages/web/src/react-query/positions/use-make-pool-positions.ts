import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { PoolModel } from "@models/pool/pool-model";
import { PositionModel } from "@models/position/position-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { isGNOTPath } from "@utils/common";

import { QUERY_KEY } from "../query-keys";

export const useMakePoolPositions = (
  positions: PositionModel[] | undefined,
  pools: PoolModel[],
  isFetchedPosition: boolean,
  options?: UseQueryOptions<PoolPositionModel[], Error>,
) => {
  return useQuery<PoolPositionModel[], Error>({
    queryKey: [QUERY_KEY.poolPositions, positions?.map(p => p.id).join(",")],
    queryFn: async () => {
      return new Promise(resolve => {
        const poolPositions: PoolPositionModel[] = [];
        positions?.forEach(position => {
          const pool = pools.find(pool => pool.poolPath === position.poolPath);
          if (pool) {
            const tokenA = isGNOTPath(pool.tokenA.path)
              ? GNOT_TOKEN
              : pool.tokenA;
            const tokenB = isGNOTPath(pool.tokenB.path)
              ? GNOT_TOKEN
              : pool.tokenB;
            const currentPool = {
              ...pool,
              tokenA,
              tokenB,
            };
            poolPositions.push(
              PositionMapper.makePoolPosition(position, currentPool),
            );
          }
        });

        resolve(poolPositions);
      });
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: isFetchedPosition && pools.length > 0,
    ...options,
  });
};
