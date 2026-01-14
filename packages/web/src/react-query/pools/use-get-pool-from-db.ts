import { useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";
import { PoolDetailModel } from "@models/pool/pool-detail-model";

interface UseGetPoolFromDbOptions {
  enabled?: boolean;
  refetchInterval?: number | false | ((data: PoolDetailModel | null | undefined) => number | false);
}

export const useGetPoolFromDb = (encryptedPoolPath: string | null, options?: UseGetPoolFromDbOptions) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.poolFromDb, encryptedPoolPath],
    queryFn: async (): Promise<PoolDetailModel | null> => {
      if (!encryptedPoolPath) return null;
      try {
        return await poolRepository.getPoolDetailByPoolPath(encryptedPoolPath);
      } catch (error) {
        console.error("Failed to get pool from DB:", error);
        return null;
      }
    },
    enabled: !!encryptedPoolPath && (options?.enabled ?? true),
    staleTime: 5_000,
    refetchInterval: options?.refetchInterval,
  });
};
