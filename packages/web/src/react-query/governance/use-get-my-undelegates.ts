import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { DEFAULT_CHAIN_ID } from "@constants/environment.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetMyUnDelegatesRequest, MyUnDelegatesInfo } from "@repositories/governance";
import { WalletState } from "@states/index";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetMyUnDelegates = (
  request: GetMyUnDelegatesRequest,
  options?: UseQueryOptions<MyUnDelegatesInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();
  const chainId = useAtomValue(WalletState.account)?.chainId ?? DEFAULT_CHAIN_ID;

  return useQuery<MyUnDelegatesInfo, Error>({
    queryKey: [QUERY_KEY.governanceMyUnDelegates, chainId, request.address],
    queryFn: () => {
      return governanceRepository.getMyUnDelegates(request);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!request.address,
    ...options,
  });
};
