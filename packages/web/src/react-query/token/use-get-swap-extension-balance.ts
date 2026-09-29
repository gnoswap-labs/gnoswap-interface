import { useQueries } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { SwapExtension } from "@resources/swap-extension";
import { evaluateExpressionToIntegerString, makeABCIParams } from "@utils/rpc-utils";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 5_000;

export const useGetSwapExtensionBalances = (
  extensions: SwapExtension[],
  address: string | null,
  options?: { enabled?: boolean },
) => {
  const { rpcProvider } = useGnoswapContext();
  const queries = useQueries({
    queries: extensions.map(extension => ({
      queryKey: [QUERY_KEY.swapExtensionBalance, extension.originTokenPath, address || ""],
      queryFn: async () => {
        if (!address || !rpcProvider) {
          throw new Error("Swap extension balance query is unavailable");
        }

        const balanceRoute = extension.originRoutes.balance;
        const inputs = balanceRoute.inputs.map(input => {
          if (input === "$address") return address;
          throw new Error(`Unsupported balance query input: ${input}`);
        });
        const response = await rpcProvider.evaluateExpression(
          extension.originTokenPath,
          makeABCIParams(balanceRoute.function, inputs),
        );
        const balance = evaluateExpressionToIntegerString(response);
        if (balance === null) {
          throw new Error("Failed to parse swap extension balance");
        }

        return balance;
      },
      refetchInterval: REFETCH_INTERVAL,
      enabled: !!address && !!rpcProvider && options?.enabled !== false,
    })),
  });
  const data = useMemo(
    () =>
      Object.fromEntries(
        extensions.map((extension, index) => [extension.originTokenPath, queries[index]?.data as string | undefined]),
      ),
    [extensions, queries],
  );
  const errors = useMemo(
    () =>
      Object.fromEntries(
        extensions.map((extension, index) => [extension.originTokenPath, queries[index]?.error ?? null]),
      ),
    [extensions, queries],
  );
  const loading = useMemo(
    () =>
      Object.fromEntries(
        extensions.map((extension, index) => [extension.originTokenPath, Boolean(queries[index]?.isInitialLoading)]),
      ),
    [extensions, queries],
  );
  const refetch = useCallback(() => Promise.all(queries.map(query => query.refetch())), [queries]);

  return {
    data,
    errors,
    loading,
    refetch,
  };
};
