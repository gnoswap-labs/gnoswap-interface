import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";
import { PositionModel } from "@models/position/position-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { PositionBinModel } from "@models/position/position-bin-model";
import { PoolModel } from "@models/pool/pool-model";
import { isGNOTPath } from "@utils/common";
import { GNOT_TOKEN } from "@common/values/token-constant";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";

interface UseGetPositionsByAddressOptions {
  address?: string,
  isClosed?: boolean;
  poolPath?: string;
  queryOptions?: UseQueryOptions<PositionModel[], Error>;
}

export const useGetPositionsByAddress = (
  options?: UseGetPositionsByAddressOptions,
) => {
  const { positionRepository } = useGnoswapContext();
  const { account } = useWallet();

  return useQuery<PositionModel[], Error>({
    queryKey: [
      QUERY_KEY.positions,
      options?.address,
      options?.poolPath,
      options?.isClosed,
    ].filter(item => (item !== undefined)),
    queryFn: async () => {
      const data = await positionRepository
        .getPositionsByAddress(options?.address || account?.address || "", {
          isClosed: options?.isClosed,
          poolPath: encodeURIComponent(options?.poolPath ?? ""),
        })
        .catch(e => {
          console.error(e);
          return [];
        });
      return data;
    },
    enabled: (!!options?.address || !!account?.address),
    ...options?.queryOptions,
  });
};

export const useGetPositionHistory = (
  lpTokenId: string,
  options?: UseQueryOptions<IPositionHistoryModel[], Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<IPositionHistoryModel[], Error>({
    queryKey: [QUERY_KEY.positions, "history", lpTokenId],
    queryFn: async () => {
      const data = await positionRepository.getPositionHistory(lpTokenId);
      return data;
    },
    ...options,
  });
};

export const useGetPositionBins = (
  lpTokenId: string,
  count: 20 | 40,
  options?: UseQueryOptions<PositionBinModel[], Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<PositionBinModel[], Error>({
    queryKey: [QUERY_KEY.positionBins, lpTokenId, count],
    queryFn: async () => {
      const data = await positionRepository.getPositionBins(lpTokenId, count);
      return data;
    },
    ...options,
  });
};

export const useGetLazyPositionBins = (
  lpTokenId: string,
  count: 20 | 40,
  enabled = true,
  options?: UseQueryOptions<PositionBinModel[], Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<PositionBinModel[], Error>({
    queryKey: [QUERY_KEY.positionLazyBins, lpTokenId, count],
    queryFn: async () => {
      const data = await positionRepository.getPositionBins(lpTokenId, count);
      return data;
    },
    ...options,
    enabled: enabled,
  });
};

function makeId(data: PoolModel[] | PositionModel[]) {
  return data.map(item => item.id).join("_");
}

export const useMakePoolPositions = (
  positions: PositionModel[] | undefined,
  pools: PoolModel[],
  isFetchedPosition: boolean,
  options?: UseQueryOptions<PoolPositionModel[], Error>,
) => {
  return useQuery<PoolPositionModel[], Error>({
    queryKey: [QUERY_KEY.poolPositions, makeId(positions || [])],
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
    enabled: isFetchedPosition && pools.length > 0,
    ...options,
  });
};
