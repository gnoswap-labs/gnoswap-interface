import { useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "@query/query-keys";

export const useTransactionDocument = () => {
  const { transactionService } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.createTransactionDocument],
    queryFn: () => transactionService.createDocument(),
  });
};
