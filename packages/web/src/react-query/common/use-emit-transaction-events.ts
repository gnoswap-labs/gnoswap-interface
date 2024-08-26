import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { Event } from "@common/modules/event-store";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 1_000;

export const useEmitTransactionEvents = (
  options?: UseQueryOptions<Event<string[]>[], Error>,
) => {
  const { statusRepository, eventStore } = useGnoswapContext();

  return useQuery<Event<string[]>[], Error>({
    queryKey: [QUERY_KEY.transactionEvents],
    queryFn: async () => {
      if (eventStore.count() === 0) {
        return [];
      }

      await eventStore.updatePendingEvents();

      const result = await statusRepository.getSyncInfo().catch(() => null);

      const blockHeight = result?.syncInfo.height;
      console.log(result);
      if (!blockHeight) {
        return [];
      }

      return eventStore.emitAllEvents(blockHeight);
    },
    refetchInterval: REFETCH_INTERVAL,
    ...options,
  });
};
