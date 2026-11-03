import { useQuery } from "@tanstack/react-query";

import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { TransactionFeeEstimate } from "@services/transaction-gas/transaction-gas-service";

import { QUERY_KEY } from "../query-keys";

const STALE_TIME = 30_000;

/**
 * Simulates the order transaction to price what placing it costs: gas plus the
 * storage deposit. Executions are paid by the keeper, so they are not included.
 *
 * @param key Everything the messages depend on, so the estimate follows the form.
 * @param makeMessages Null while the form cannot build a transaction.
 */
export const useEstimateOrderNetworkFee = (
  key: readonly unknown[],
  makeMessages: (() => Promise<TransactionMessage[]>) | null,
) => {
  const { transactionGasService } = useGnoswapContext();

  return useQuery<TransactionFeeEstimate | null, Error>({
    queryKey: [QUERY_KEY.orderNetworkFee, ...key],
    queryFn: async () => {
      if (!makeMessages || !transactionGasService) return null;
      const messages = await makeMessages();
      return transactionGasService.estimateTransactionFee(messages);
    },
    enabled: !!makeMessages && !!transactionGasService,
    staleTime: STALE_TIME,
    keepPreviousData: true,
    retry: false,
  });
};
