import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { QUERY_KEY } from "@query/query-keys";
import { FAUCET_RESPONSE_MESSAGE } from "@common/errors/faucet/faucet-error";

import { FaucetResponse } from "@repositories/faucet/response";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";

const NATIVE_FAUCET_AMOUNT = "10000000ugnot";

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
