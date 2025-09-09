import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { FaucetResponse } from "@repositories/faucet/response";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";

export interface UseFaucetReturn {
  isSupported: boolean;
  isLoading: boolean;
  faucet: () => Promise<FaucetResponse>;
}

export const useFaucet = (): UseFaucetReturn => {
  const { currentChainId, account } = useWallet();
  const { faucetService } = useGnoswapContext();

  const currentAddress = React.useMemo(() => {
    return account?.address || "";
  }, [account]);

  const { data: isSupported = false } = useQuery<boolean>({
    queryKey: ["faucet/isSupported", currentChainId],
    queryFn: () => faucetService.availFaucet(currentChainId),
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: (to: string) => faucetService.faucet(currentChainId, to, "10000000ugnot"),
  });

  const faucet = async (): Promise<FaucetResponse> => {
    if (!currentAddress) {
      return {
        success: false,
        message: "Unexpected Error.",
      };
    }
    return new Promise(resolve => {
      mutate(currentAddress, {
        onSuccess: data => resolve(data),
        onError: () =>
          resolve({
            success: false,
            message: "Unexpected Error.",
          }),
      });
    });
  };

  return {
    isSupported,
    isLoading,
    faucet,
  };
};
