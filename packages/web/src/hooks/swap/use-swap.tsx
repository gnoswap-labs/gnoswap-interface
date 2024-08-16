import { SwapDirectionType } from "@common/values";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel, isNativeToken } from "@models/token/token-model";
import { EstimatedRoute } from "@models/swap/swap-route-info";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import { useGetRoutes } from "@query/router";

interface UseSwapProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  direction: SwapDirectionType;
  slippage: number;
  swapFee?: number;
}

export const useSwap = ({
  tokenA,
  tokenB,
  direction,
  slippage,
  swapFee = 15,
}: UseSwapProps) => {
  const { account } = useWallet();
  const { swapRouterRepository } = useGnoswapContext();
  const [swapAmount, setSwapAmount] = useState<number | null>(null);

  const selectedTokenPair = tokenA !== null && tokenB !== null;

  const exactOutPadding = 1 / (1 - swapFee/ 10000);

  const isSameToken = useMemo(() => {
    if (!tokenA || !tokenB) {
      return false;
    }
    if (isNativeToken(tokenA)) {
      return tokenA.wrappedPath === tokenB.path;
    }
    if (isNativeToken(tokenB)) {
      return tokenA.path === tokenB.wrappedPath;
    }
    return false;
  }, [tokenA, tokenB]);

  const {
    data: estimatedSwapResult,
    isLoading: isEstimatedSwapLoading,
    error,
  } = useGetRoutes(
    {
      inputToken: tokenA,
      outputToken: tokenB,
      exactType: direction,
      tokenAmount:
        direction === "EXACT_IN"
          ? swapAmount
          : swapAmount
          ? swapAmount * exactOutPadding
          : swapAmount,
    },
    {
      enabled:
        !!swapAmount &&
        swapAmount > 0 &&
        !!tokenA &&
        !!tokenA.path &&
        !!tokenB &&
        !!tokenB.path,
    },
  );

  const swapState: "NONE" | "LOADING" | "NO_LIQUIDITY" | "SUCCESS" =
    useMemo(() => {
      if (!selectedTokenPair || !swapAmount) {
        return "NONE";
      }

      if (isSameToken) {
        return "NONE";
      }

      if (isEstimatedSwapLoading) {
        return "LOADING";
      }

      if (!!error || !estimatedSwapResult?.amount) {
        return "NO_LIQUIDITY";
      }

      return "SUCCESS";
    }, [
      swapAmount,
      error,
      estimatedSwapResult?.amount,
      isEstimatedSwapLoading,
      isSameToken,
      selectedTokenPair,
    ]);

  const estimatedRoutes: EstimatedRoute[] = useMemo(() => {
    if (swapState !== "SUCCESS" || !estimatedSwapResult || !swapAmount) {
      return [];
    }

    return estimatedSwapResult.estimatedRoutes;
  }, [swapState, estimatedSwapResult, swapAmount]);

  const estimatedAmount: string | null = useMemo(() => {
    if (!swapAmount || error) {
      return null;
    }

    if (swapState !== "SUCCESS" || !estimatedSwapResult) {
      return null;
    }

    return estimatedSwapResult.amount;
  }, [swapAmount, error, swapState, estimatedSwapResult]);

  const tokenAmountLimit = useMemo(() => {
    if (estimatedAmount && !Number.isNaN(slippage)) {
      const tokenAmountLimit =
        direction === "EXACT_IN"
          ? BigNumber(estimatedAmount)
              .multipliedBy((100 - slippage) / 100)
              .toNumber()
          : BigNumber(estimatedAmount)
              .multipliedBy((100 + slippage) / 100)
              .toNumber();

      if (tokenAmountLimit <= 0) {
        return 0;
      }

      return tokenA ? makeDisplayTokenAmount(tokenA, tokenAmountLimit) || 0 : 0;
    }
    return 0;
  }, [direction, estimatedAmount, slippage, tokenA]);

  const updateSwapAmount = useCallback((amount: string) => {
    let newAmount = 0;
    if (!amount || BigNumber(amount).isZero()) {
      newAmount = 0;
    }
    newAmount = BigNumber(amount).toNumber();

    setSwapAmount(newAmount);
  }, []);

  const wrap = useCallback(
    async (tokenAmount: string) => {
      if (!account) {
        return null;
      }
      if (!selectedTokenPair) {
        return null;
      }
      return swapRouterRepository.sendWrapToken({
        token: tokenA,
        tokenAmount,
      });
    },
    [account, selectedTokenPair, swapRouterRepository, tokenA],
  );

  const unwrap = useCallback(
    async (tokenAmount: string) => {
      if (!account) {
        return null;
      }
      if (!selectedTokenPair) {
        return null;
      }
      return swapRouterRepository.sendUnwrapToken({
        token: tokenA,
        tokenAmount,
      });
    },
    [account, selectedTokenPair, swapRouterRepository, tokenA],
  );

  const swap = useCallback(
    async (estimatedRoutes: EstimatedRoute[], tokenAmount: string) => {
      if (!account) {
        return null;
      }
      if (!selectedTokenPair) {
        return null;
      }

      return swapRouterRepository.sendSwapRoute({
        inputToken: tokenA,
        outputToken: tokenB,
        estimatedRoutes,
        exactType: direction,
        tokenAmount:
          direction === "EXACT_IN"
            ? Number(tokenAmount)
            : Number(tokenAmount) * exactOutPadding,
        tokenAmountLimit,
      });
    },
    [
      account,
      direction,
      selectedTokenPair,
      swapRouterRepository,
      tokenA,
      tokenAmountLimit,
      tokenB,
      exactOutPadding,
    ],
  );

  return {
    isSameToken,
    tokenAmountLimit,
    estimatedAmount,
    estimatedRoutes,
    swapState,
    swap,
    wrap,
    unwrap,
    updateSwapAmount,
    resetSwapAmount: () => setSwapAmount(0),
  };
};
