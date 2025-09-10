import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { FaucetResponse } from "@repositories/faucet/response";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { GNOT_TOKEN } from "@common/values/token-constant";

const FAUCET_AMOUNT = 10_000_000 + (GNOT_TOKEN?.denom || "ugnot");

export interface UseFaucetReturn {
  isSupported: boolean;
  isLoading: boolean;
  isLoading2: boolean;
  faucet: () => Promise<FaucetResponse>;
  faucet2: () => Promise<FaucetResponse>;
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
    mutationFn: (to: string) => faucetService.faucet(currentChainId, to, FAUCET_AMOUNT),
  });

  const { mutate: mutate2, isLoading: isLoading2 } = useMutation({
    mutationFn: (to: string) => faucetService.faucetGRC20(currentChainId, to, "10_000_000"),
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

  const faucet2 = async (): Promise<FaucetResponse> => {
    if (!currentAddress) {
      return {
        success: false,
        message: "Unexpected Error.",
      };
    }
    return new Promise(resolve => {
      mutate2(currentAddress, {
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
    isLoading2,
    faucet,
    faucet2,
  };
};
