import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { QUERY_KEY } from "@query/query-keys";
import { FAUCET_RESPONSE_MESSAGE } from "@common/errors/faucet/faucet-error";

import { FaucetResponse } from "@repositories/faucet/response";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";

const FAUCET_AMOUNT = 100_000_000;

export interface UseFaucetGRC20Return {
  isSupportedFaucetGRC20: boolean;
  isLoadingFaucetGRC20: boolean;
  faucetGRC20: () => Promise<FaucetResponse>;
}

export const useFaucetGRC20 = (): UseFaucetGRC20Return => {
  const { currentChainId, account } = useWallet();
  const { faucetService } = useGnoswapContext();

  const currentAddress = React.useMemo(() => {
    return account?.address || "";
  }, [account]);

  const { data: isSupported = false } = useQuery<boolean>({
    queryKey: [QUERY_KEY.faucetGRC20IsSupported, currentChainId],
    queryFn: () => faucetService.availFaucet(currentChainId, "grc20"),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (to: string) => faucetService.faucetGRC20(currentChainId, to, FAUCET_AMOUNT.toString()),
  });

  const faucetGRC20 = async (): Promise<FaucetResponse> => {
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
    isSupportedFaucetGRC20: isSupported,
    isLoadingFaucetGRC20: isLoading,
    faucetGRC20,
  };
};
