import { SwapDirectionType } from "@common/values";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import { useCallback } from "react";

export const useSwap = () => {
  const { account } = useWallet();
  const { swapRepository } = useGnoswapContext();

  const swap = useCallback(async (
    tokenA: TokenModel,
    tokenAAmount: string,
    tokenB: TokenModel,
    tokenBAmount: string,
    fee: number,
    direction: SwapDirectionType
  ) => {
    if (!account) {
      return false;
    }
    const zeroForOne = tokenA.symbol.toLowerCase() === "foo";
    const amountSpecified = direction === "EXACT_OUT" ?
      BigNumber(tokenBAmount).multipliedBy(-1).toNumber() :
      BigNumber(tokenAAmount).toNumber();
    const response = await swapRepository.swap({
      tokenA: tokenA,
      tokenB: tokenB,
      fee,
      receiver: account.address,
      zeroForOne,
      amountSpecified,
    })
      .catch(() => null);
    return response;
  }, [account, swapRepository]);

  return {
    swap
  };
};