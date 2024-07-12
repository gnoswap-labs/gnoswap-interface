import { SwapDirectionType } from "@common/values";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useSlippage } from "@hooks/common/use-slippage";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel, isNativeToken } from "@models/token/token-model";
import { EstimatedRoute } from "@models/swap/swap-route-info";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import { useEstimateSwap } from "@query/router";

interface UseSwapProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  direction: SwapDirectionType;
  slippage: string;
}

export const useSwap = ({ tokenA, tokenB, direction }: UseSwapProps) => {
  const { account } = useWallet();
  const { swapRouterRepository } = useGnoswapContext();
  const [swapAmount, setSwapAmount] = useState<string | null>(null);
  const { slippage } = useSlippage();

  const selectedTokenPair = tokenA !== null && tokenB !== null;

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

  const currentSwapAmount = useMemo(() => {
    if (!swapAmount || BigNumber(swapAmount).isZero()) {
      return 0;
    }
    return BigNumber(swapAmount).toNumber();
  }, [swapAmount]);

  const {
    data: estimatedSwapResult,
    isLoading: isEstimatedSwapLoading,
    error,
  } = useEstimateSwap(
    {
      inputToken: tokenA,
      outputToken: tokenB,
      exactType: direction,
      tokenAmount: currentSwapAmount,
    },
    {
      enabled: currentSwapAmount > 0 && !!tokenA && !!tokenB,
    },
  );
  console.log("🚀 ~ useSwap ~ error:", error);

  const swapState: "NONE" | "LOADING" | "NO_LIQUIDITY" | "SUCCESS" =
    useMemo(() => {
      if (!selectedTokenPair || !currentSwapAmount) {
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
      currentSwapAmount,
      error,
      estimatedSwapResult?.amount,
      isEstimatedSwapLoading,
      isSameToken,
      selectedTokenPair,
    ]);

  const estimatedRoutes: EstimatedRoute[] = useMemo(() => {
    if (swapState !== "SUCCESS" || !estimatedSwapResult || !currentSwapAmount) {
      return [];
    }

    return estimatedSwapResult.estimatedRoutes;
  }, [swapState, estimatedSwapResult, currentSwapAmount]);

  const estimatedAmount: string | null = useMemo(() => {
    if (!currentSwapAmount || error) {
      return null;
    }

    if (swapState !== "SUCCESS" || !estimatedSwapResult) {
      return null;
    }

    return estimatedSwapResult.amount;
  }, [currentSwapAmount, error, swapState, estimatedSwapResult]);

  const tokenAmountLimit = useMemo(() => {
    if (estimatedAmount && !Number.isNaN(Number(slippage))) {
      const slippageAmountNumber = BigNumber(estimatedAmount).multipliedBy(
        Number(slippage) * 0.01,
      );
      const tokenAmountLimit =
        direction === "EXACT_IN"
          ? BigNumber(estimatedAmount).minus(slippageAmountNumber).toNumber()
          : BigNumber(estimatedAmount).plus(slippageAmountNumber).toNumber();

      if (tokenAmountLimit <= 0) {
        return 0;
      }

      return tokenA ? makeDisplayTokenAmount(tokenA, tokenAmountLimit) || 0 : 0;
    }
    return 0;
  }, [direction, estimatedAmount, slippage, tokenA]);

  const estimateSwapRoute = useCallback((amount: string) => {
    setSwapAmount(amount || "0");
  }, []);

  const wrap = useCallback(
    async (tokenAmount: string) => {
      if (!account) {
        return null;
      }
      if (!selectedTokenPair) {
        return null;
      }
      return swapRouterRepository.wrapToken({
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
      return swapRouterRepository.unwrapToken({
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

      return swapRouterRepository.swapRoute({
        inputToken: tokenA,
        outputToken: tokenB,
        estimatedRoutes,
        exactType: direction,
        tokenAmount: Number(tokenAmount),
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
    ],
  );

  return {
    isSameToken,
    tokenAmountLimit,
    estimatedAmount,
    estimatedRoutes,
    swapState,
    swap,
    estimateSwapRoute,
    wrap,
    unwrap,
    resetSwapAmount: () => setSwapAmount(""),
  };
};
