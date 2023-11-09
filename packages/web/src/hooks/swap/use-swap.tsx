import { SwapDirectionType } from "@common/values";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import { useCallback, useMemo } from "react";

interface UseSwapProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  direction: SwapDirectionType;
  slippage: number;
}

export const useSwap = ({
  tokenA,
  tokenB,
  direction,
}: UseSwapProps) => {
  const { account } = useWallet();
  const { swapRepository } = useGnoswapContext();

  const selectedTokenPair = tokenA !== null && tokenB !== null;

  /**
   * TODO: Once a contract can handle GRC20 tokens dynamically, it will need to be reconsidered.
   */
  const zeroForOne = useMemo(() => {
    return tokenA?.symbol.toLowerCase() === "foo";
  }, [tokenA?.symbol]);

  const amountDirection = useMemo(() => {
    return direction === "EXACT_IN" ? 1 : -1;
  }, [direction]);

  const tempAmountDirection = useMemo(() => {
    if (!zeroForOne) {
      return -1 * amountDirection;
    }
    return amountDirection;
  }, [amountDirection, zeroForOne]);

  /**
   * TODO: Once a contract can handle GRC20 tokens dynamically, it will need to be reconsidered.
   */
  const getAmountResult = useCallback((inputAmount: number, tokenAAmount: number, tokenBAmount: number) => {
    const isExactIn = inputAmount >= 0;
    if (isExactIn === zeroForOne) {
      return BigNumber(tokenBAmount).abs().toString();
    }
    return BigNumber(tokenAAmount).abs().toString();
  }, [zeroForOne]);

  const findSwapPool = useCallback(async (amount: string) => {
    if (!selectedTokenPair) {
      return null;
    }
    const amountSpecified = BigNumber(amount).multipliedBy(tempAmountDirection).toNumber();

    return await swapRepository.findSwapPool({
      tokenA: zeroForOne ? tokenA : tokenB,
      tokenB: zeroForOne ? tokenB : tokenA,
      zeroForOne,
      amountSpecified,
    }).catch(() => null);
  }, [selectedTokenPair, tempAmountDirection, swapRepository, zeroForOne, tokenA, tokenB]);

  const getExpectedSwap = useCallback(async (amount: string) => {
    if (!selectedTokenPair) {
      return null;
    }
    const swapPool = await findSwapPool(amount);
    if (!swapPool) {
      return null;
    }
    const fee = SwapFeeTierInfoMap[swapPool.feeTier].fee;

    const amountSpecified = BigNumber(amount || 0).multipliedBy(tempAmountDirection).toNumber();

    return swapRepository.getExpectedSwapResult({
      tokenA: zeroForOne ? tokenA : tokenB,
      tokenB: zeroForOne ? tokenB : tokenA,
      fee,
      receiver: "",
      zeroForOne,
      amountSpecified,
    }).then((data) =>
      getAmountResult(amountSpecified, data.tokenAAmount, data.tokenBAmount))
      .catch(() => null);
  }, [selectedTokenPair, findSwapPool, tempAmountDirection, swapRepository, zeroForOne, tokenA, tokenB, getAmountResult]);

  const swap = useCallback(async (tokenAAmount: string, tokenBAmount: string) => {
    if (!account) {
      return false;
    }
    if (!selectedTokenPair) {
      return false;
    }
    const amountSpecified = direction === "EXACT_IN" ?
      BigNumber(tokenAAmount).multipliedBy(amountDirection).toNumber() :
      BigNumber(tokenBAmount).multipliedBy(amountDirection).toNumber();

    const swapPool = await findSwapPool(`${amountSpecified}`);
    if (!swapPool) {
      return false;
    }
    const fee = SwapFeeTierInfoMap[swapPool.feeTier].fee;
    const response = await swapRepository.swap({
      tokenA: zeroForOne ? tokenA : tokenB,
      tokenB: zeroForOne ? tokenB : tokenA,
      fee,
      receiver: account.address,
      zeroForOne,
      amountSpecified,
    })
      .catch(() => false);
    return response;
  }, [account, amountDirection, direction, findSwapPool, selectedTokenPair, swapRepository, tokenA, tokenB, zeroForOne]);

  return {
    swap,
    getExpectedSwap
  };
};