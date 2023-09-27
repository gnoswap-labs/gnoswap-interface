import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useCallback } from "react";

export const useSwap = () => {
  const { account } = useWallet();
  const { swapRepository } = useGnoswapContext();

  const swap = useCallback(async () => {
    if (!account) {
      return false;
    }
    const response = await swapRepository.swap({
      tokenA: "foo",
      tokenB: "bar",
      fee: 500,
      receiver: account.address,
      zeroForOne: true,
      amountSpecified: 200000,
      sqrtPriceLimitX96: 4295128740,
    })
      .then(() => true)
      .catch(() => false);
    return response;
  }, [account, swapRepository]);

  return {
    swap
  };
};