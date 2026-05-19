import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";

import { FAUCET_RESPONSE_MESSAGE } from "@common/errors/faucet/faucet-error";
import { QUERY_KEY } from "@query/query-keys";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { FaucetResponse } from "@repositories/faucet/response";

const NATIVE_FAUCET_AMOUNT = "100000000ugnot";

export interface UseFaucetNativeReturn {
  isSupportedFaucetNative: boolean;
  isLoadingFaucetNative: boolean;
  faucetNative: () => Promise<FaucetResponse>;
}

export const useFaucetNative = (): UseFaucetNativeReturn => {
  const { currentChainId, account } = useWallet();
  const { faucetService } = useGnoswapContext();

  const currentAddress = React.useMemo(() => {
    return account?.address || "";
  }, [account]);

  const { data: isSupported = false } = useQuery<boolean>({
    queryKey: [QUERY_KEY.faucetNativeIsSupported, currentChainId],
    queryFn: () => faucetService.availFaucet(currentChainId, "native"),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (to: string) => faucetService.faucetNative(currentChainId, to, NATIVE_FAUCET_AMOUNT),
  });

  const faucetNative = async (): Promise<FaucetResponse> => {
    if (!currentAddress) {
      return {
        success: false,
        message: FAUCET_RESPONSE_MESSAGE.ERROR.UNEXPECTED,
      };
    }
    return new Promise(resolve => {
      mutate(currentAddress, {
        onSuccess: data => resolve(data),
        onError: () =>
          resolve({
            success: false,
            message: FAUCET_RESPONSE_MESSAGE.ERROR.UNEXPECTED,
          }),
      });
    });
  };

  return {
    isSupportedFaucetNative: isSupported,
    isLoadingFaucetNative: isLoading,
    faucetNative,
  };
};
