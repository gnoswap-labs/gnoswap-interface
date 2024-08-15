import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TransactionGroupsType } from "@models/notification";

const REFETCH_INTERVAL = 10_000;

export const useGetNotifications = (
  options?: UseQueryOptions<TransactionGroupsType[], Error>,
) => {
  const { notificationRepository } = useGnoswapContext();
  const { account, availNetwork, currentChainId } = useWallet();

  return useQuery<TransactionGroupsType[], Error>({
    queryKey: [QUERY_KEY.notifications, currentChainId, account?.address],
    queryFn: () => {
      if (!account?.address) {
        return [];
      }
      return notificationRepository.getGroupedNotification({
        address: account.address,
      });
    },
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!account?.address && availNetwork,
    ...options,
  });
};
