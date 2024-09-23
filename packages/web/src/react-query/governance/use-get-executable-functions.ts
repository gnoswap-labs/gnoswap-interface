import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { ExecutableFunctionInfo } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

export const useGetExecutableFunctions = (
  options?: UseQueryOptions<ExecutableFunctionInfo[], Error>,
) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<ExecutableFunctionInfo[], Error>({
    queryKey: [QUERY_KEY.governanceExecutableFunctions],
    queryFn: governanceRepository.getExecutableFunctions,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
