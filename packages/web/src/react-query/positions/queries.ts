import { useMemo } from "react";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PositionModel } from "@models/position/position-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { PositionBinModel } from "@models/position/position-bin-model";
import { PoolModel } from "@models/pool/pool-model";
import { isGNOTPath } from "@utils/common";
import { GNOT_TOKEN } from "@common/values/token-constant";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { QUERY_KEY } from "./types";

interface UseGetPositionsByAddressOptions {
  address?: string;
  isClosed?: boolean;
  poolPath?: string | null;
  queryOptions?: UseQueryOptions<PositionModel[], Error>;
}

export const useGetPositionsByAddress = (
  options?: UseGetPositionsByAddressOptions,
) => {
  const { positionRepository } = useGnoswapContext();
  const { account, currentChainId, availNetwork } = useWallet();
  const key = [
    QUERY_KEY.positions,
    currentChainId,
    options?.address || account?.address,
    options?.poolPath,
    options?.isClosed,
  ];

  const enabled = useMemo(() => {
    if (options?.queryOptions?.enabled === false) {
      return false;
    }

    if (!!options?.address) {
      return true;
    }

    return !!account?.address;
  }, [options, account, availNetwork]);

  return useQuery<PositionModel[], Error>({
    queryKey: key.filter(item => item !== undefined),
    queryFn: async () => {
      if (!availNetwork) {
        return [];
      }

      if (!options?.address && !account?.address) {
        return [];
      }

      const data = await positionRepository
        .getPositionsByAddress(options?.address || account?.address || "", {
          isClosed: options?.isClosed,
          poolPath: options?.poolPath
            ? encodeURIComponent(options?.poolPath ?? "")
            : undefined,
        })
        .catch(e => {
          console.error(e);
          return [];
        });
      return data;
    },
    ...options?.queryOptions,
    enabled: enabled,
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

export const useGetPositionById = (
  lpTokenId: string,
  options?: UseQueryOptions<PositionModel, Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<PositionModel, Error>({
    queryKey: [QUERY_KEY.positionDetail, lpTokenId],
    queryFn: async () => {
      const data = await positionRepository.getPositionById(lpTokenId);
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
    enabled: isFetchedPosition && pools.length > 0,
    ...options,
  });
};
