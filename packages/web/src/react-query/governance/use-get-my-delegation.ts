import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { DEFAULT_CHAIN_ID } from "@constants/environment.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetMyDelegationRequest, MyDelegationInfo } from "@repositories/governance";
import { WalletState } from "@states/index";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;
const CONNECTED_ACCOUNT_REFETCH_INTERVAL = 5_000;

export const useGetMyDelegation = (
  request: GetMyDelegationRequest,
  options?: UseQueryOptions<MyDelegationInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();
  // Read the chain straight from the wallet atom; useWallet() would also mount
  // its balance query and effects in every caller.
  const account = useAtomValue(WalletState.account);
  const chainId = account?.chainId ?? DEFAULT_CHAIN_ID;
  const isConnectedAccount = !!request.address && account?.address === request.address;

  // Keyed by chain and address without keepPreviousData, so another account's
  // summary is never served while the current account's data is loading.
  return useQuery<MyDelegationInfo, Error>({
    queryKey: [QUERY_KEY.governanceMyDelegation, chainId, request.address],
    queryFn: () => {
      return governanceRepository.getMyDelegation(request);
    },
    refetchInterval: isConnectedAccount ? CONNECTED_ACCOUNT_REFETCH_INTERVAL : REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!request.address,
    ...options,
  });
};
