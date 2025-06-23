import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useGetGasPrice } from "@hooks/gas";
import { makeEstimateGasTransaction } from "@utils/transaction-utils";

import { Document } from "src/types/transaction-messages.types";
import { GasInfo } from "@hooks/gas";
import { QUERY_KEY } from "@query/query-keys";
import { GAS_WANTED_BUFFER_MULTIPLIER } from "@common/values";
import { calculateAdjustedGasFee } from "@utils/gas-utils";

const REFETCH_INTERVAL = 5_000;

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

  return useQuery({
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

      if (!resultGasUsed) {
        return {
          gasFee: 0,
          gasUsed: 0,
          gasWanted: 0,
          gasPrice: 0,
          hasError: true,
          simulateErrorMessage: "",
        };
      }

      const { gasFee, gasUsed, gasWanted } = calculateAdjustedGasFee(
        resultGasUsed.gasUsed,
        gasPrice,
        GAS_WANTED_BUFFER_MULTIPLIER,
      );

      return {
        gasFee,
        gasUsed,
        gasWanted,
        gasPrice,
        hasError: resultGasUsed.errorMessage !== null,
        simulateErrorMessage: resultGasUsed.errorMessage,
      };
    },
    refetchInterval: REFETCH_INTERVAL,
    keepPreviousData: true,
    enabled: !!document && !!transactionGasService,
    ...options,
  });
};
