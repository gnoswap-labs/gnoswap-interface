import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useGetGasPrice, GasInfo } from "@hooks/gas";
import { makeEstimateGasTransaction } from "@utils/transaction-utils";

import { Document } from "src/types/transaction-messages.types";
import { QUERY_KEY } from "@query/query-keys";
import { buildGasInfo } from "./build-gas-info";

const REFETCH_INTERVAL = 10_000;

export const useGetEstimateGasInfo = (
  document: Document | null | undefined,
  gasUsed: number,
  options?: UseQueryOptions<GasInfo | null, Error>,
): UseQueryResult<GasInfo | null> => {
  const { data: gasPrice } = useGetGasPrice();
  const { transactionService, transactionGasService } = useGnoswapContext();

  async function makeSimulateTransaction(document: Document | null | undefined) {
    if (!document || !gasPrice) return null;

    return makeEstimateGasTransaction(document, transactionService, gasUsed, gasPrice);
  }

  return useQuery<GasInfo | null, Error>({
    queryKey: [QUERY_KEY.gasInfo, document?.msgs],
    queryFn: async () => {
      if (!transactionService || !gasPrice) return null;

      const tx = await makeSimulateTransaction(document);
      if (!tx) return null;

      const resultGasUsed = await transactionGasService
        .estimateGas(tx)
        .then(gasUsed => ({
          gasUsed,
          errorMessage: null,
        }))
        .catch(() => null);

      return buildGasInfo(resultGasUsed, gasPrice);
    },
    refetchInterval: REFETCH_INTERVAL,
    keepPreviousData: true,
    enabled: !!document && !!transactionGasService,
    ...options,
  });
};
