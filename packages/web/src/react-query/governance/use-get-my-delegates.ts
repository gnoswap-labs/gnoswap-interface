import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { DEFAULT_CHAIN_ID } from "@constants/environment.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetMyDelegatesRequest, MyDelegatesInfo } from "@repositories/governance";
import { WalletState } from "@states/index";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetMyDelegates = (
  request: GetMyDelegatesRequest,
  options?: UseQueryOptions<MyDelegatesInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();
  const chainId = useAtomValue(WalletState.account)?.chainId ?? DEFAULT_CHAIN_ID;

  return useQuery<MyDelegatesInfo, Error>({
    queryKey: [QUERY_KEY.governanceMyDelegates, chainId, request.address],
    queryFn: () => {
      return governanceRepository.getMyDelegates(request);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!request.address,
    ...options,
  });
};
