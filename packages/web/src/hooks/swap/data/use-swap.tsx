import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BigNumber from "bignumber.js";

import { SwapDirectionType } from "@common/values";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { TokenModel, isNativeToken } from "@models/token/token-model";
import { EstimatedRoute } from "@models/swap/swap-route-info";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { useGetRoutes } from "@query/router";
import useDebounce from "@hooks/common/use-debounce";
import { useAtomValue, useStore } from "jotai";
import { SwapState } from "@states/index";

interface UseSwapProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  direction: SwapDirectionType;
  slippage: number;
  swapFee?: number;
}

export const useSwap = ({ tokenA, tokenB, direction, slippage, swapFee = 15 }: UseSwapProps) => {
  const store = useStore();
  const { account } = useWallet();
  const { swapRouterRepository } = useGnoswapContext();
  const swapSummaryInfo = useAtomValue(SwapState.swapConfirmModalState);
  const { tokenAmountLimit: currentTokenAmountLimit } = swapSummaryInfo;

  const SWAP_AMOUNT_DEBOUNCE_TIME_MS = 500;
  const [swapAmount, setSwapAmount] = useState<number | null>(null);
  const debouncedAmount = useDebounce(swapAmount, SWAP_AMOUNT_DEBOUNCE_TIME_MS);
  const [estimatedLiquidityMax, setEstimatedLiquidityMax] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSwapAmount = useMemo(() => {
    if (!swapAmount || swapAmount === 0) {
      return swapAmount;
    }
    return debouncedAmount;
  }, [swapAmount, debouncedAmount]);

  const shouldFetchData = useCallback(
    (amount: number | null) => {
      if (!tokenA || !tokenB) return false;
      if (!amount) return false;
      if (!estimatedLiquidityMax) return true;
      return amount < estimatedLiquidityMax;
    },
    [estimatedLiquidityMax, tokenA, tokenB],
  );
  const shouldFetch = shouldFetchData(debouncedSwapAmount);

  const selectedTokenPair = tokenA !== null && tokenB !== null;

  const exactOutPadding = 1 / (1 - swapFee / 10000);

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

  const hasValidSwapAmount = Boolean(debouncedSwapAmount && debouncedSwapAmount > 0);
  const hasValidTokenPaths = Boolean(tokenA?.path) && Boolean(tokenB?.path);
  const isDifferentTokens = !isSameToken;

  const isEnabledQuery = shouldFetch && hasValidSwapAmount && hasValidTokenPaths && isDifferentTokens;

  const getTokenAmount = useMemo(() => {
    if (direction === "EXACT_IN") {
      return debouncedSwapAmount;
    }

    return debouncedSwapAmount ? debouncedSwapAmount * exactOutPadding : debouncedSwapAmount;
  }, [debouncedSwapAmount, direction, exactOutPadding]);

  const {
    data: estimatedSwapResult,
    isLoading: isEstimatedSwapLoading,
    isRefetching,
    error,
  } = useGetRoutes(
    {
      inputToken: tokenA,
      outputToken: tokenB,
      exactType: direction,
      tokenAmount: getTokenAmount,
    },
    {
      enabled: isEnabledQuery,
    },
  );

  const swapState: "NONE" | "LOADING" | "NO_LIQUIDITY" | "SUCCESS" = useMemo(() => {
    if (!selectedTokenPair || !debouncedSwapAmount) {
      return "NONE";
    }

    if (isSameToken) {
      return "NONE";
    }

    if (isEstimatedSwapLoading && shouldFetch) {
      return "LOADING";
    }

    if (estimatedSwapResult?.status === "NO_LIQUIDITY" || estimatedSwapResult?.status === "INVALID_PARAMS") {
      return "NO_LIQUIDITY";
    }

    return "SUCCESS";
  }, [debouncedSwapAmount, error, estimatedSwapResult?.amount, isEstimatedSwapLoading, isSameToken, selectedTokenPair]);

  const estimatedRoutes: EstimatedRoute[] | null = useMemo(() => {
    if (isSameToken) {
      return [];
    }

    if (swapState === "LOADING" || !debouncedSwapAmount || isTyping) {
      return null;
    }

    if (swapState !== "SUCCESS" || !estimatedSwapResult) {
      return [];
    }

    return estimatedSwapResult.estimatedRoutes;
  }, [swapState, estimatedSwapResult, debouncedSwapAmount, isTyping, isSameToken]);

  const estimatedAmount: string | null = useMemo(() => {
    if (!tokenA || !tokenB) {
      return null;
    }

    if (!debouncedSwapAmount || error || isTyping) {
      return null;
    }

    if (swapState !== "SUCCESS" || !estimatedSwapResult) {
      return null;
    }

    const amount = estimatedSwapResult.amount;
    return direction === "EXACT_IN"
      ? makeDisplayTokenAmount(tokenB, amount)?.toString() || null
      : makeDisplayTokenAmount(tokenA, amount)?.toString() || null;
  }, [debouncedSwapAmount, error, swapState, estimatedSwapResult, isTyping]);

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

      return tokenA ? tokenAmountLimit || 0 : 0;
    }
    return 0;
  }, [direction, estimatedAmount, slippage, tokenA]);

  const updateSwapAmount = (amount: string) => {
    if (!amount) {
      setSwapAmount(null);
      setIsTyping(false);
      return;
    }
    const processedAmount = amount.endsWith(".") ? amount.slice(0, -1) : amount;
    const newAmount = BigNumber(processedAmount).isZero() ? 0 : BigNumber(processedAmount).toNumber();

    if (!tokenA || !tokenB) {
      setSwapAmount(newAmount);
      setIsTyping(false);
      return;
    }

    setSwapAmount(prevAmount => {
      const hasValueChanged = prevAmount !== newAmount;

      if (hasValueChanged) {
        setIsTyping(true);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, SWAP_AMOUNT_DEBOUNCE_TIME_MS + 100);
      }

      return hasValueChanged ? newAmount : prevAmount;
    });
  };

  useEffect(() => {
    if (debouncedSwapAmount !== null) {
      setIsTyping(false);
    }
  }, [debouncedSwapAmount]);

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

      if (direction === "EXACT_IN") {
        return swapRouterRepository.sendExactInSwapRoute({
          inputToken: tokenA,
          outputToken: tokenB,
          tokenAmount: Number(tokenAmount),
          estimatedRoutes: estimatedRoutes,
          tokenAmountLimit: tokenAmountLimit,
          deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        });
      }

      if (direction === "EXACT_OUT") {
        return swapRouterRepository.sendExactOutSwapRoute({
          inputToken: tokenA,
          outputToken: tokenB,
          tokenAmount: Number(tokenAmount) * exactOutPadding,
          estimatedRoutes: estimatedRoutes,
          tokenAmountLimit: tokenAmountLimit,
          deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        });
      }
    },
    [
      account,
      direction,
      selectedTokenPair,
      swapRouterRepository,
      tokenA,
      tokenAmountLimit,
      currentTokenAmountLimit,
      tokenB,
      exactOutPadding,
      store,
    ],
  );

  useEffect(() => {
    if (estimatedRoutes === null || !tokenA || !tokenB) return;

    if (estimatedRoutes.length === 0) {
      if (!estimatedLiquidityMax) {
        setEstimatedLiquidityMax(debouncedSwapAmount || null);
      } else if (debouncedSwapAmount && debouncedSwapAmount < estimatedLiquidityMax) {
        setEstimatedLiquidityMax(debouncedSwapAmount);
      }
    } else {
      setEstimatedLiquidityMax(null);
    }
  }, [estimatedRoutes, debouncedSwapAmount, estimatedLiquidityMax, tokenA, tokenB]);

  /**
   * Reset estimatedLiquidityMax to null after specified delay
   * This effect triggers when estimatedLiquidityMax changes and is not null
   */
  const ESTIMATED_LIQUIDITY_RESET_DELAY = 5000;
  useEffect(() => {
    if (estimatedLiquidityMax !== null) {
      const timer = setTimeout(() => {
        setEstimatedLiquidityMax(null);
      }, ESTIMATED_LIQUIDITY_RESET_DELAY);

      return () => clearTimeout(timer);
    }
  }, [estimatedLiquidityMax]);

  const handleResetEstimatedLiquidity = () => {
    setEstimatedLiquidityMax(null);
  };
  /**
   * Reset estimatedLiquidityMax when tokens change
   * This prevents stale liquidity max values from persisting across different token pairs
   */
  useEffect(() => {
    handleResetEstimatedLiquidity();
  }, [tokenA, tokenB]);

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
    isEstimatedSwapLoading,
    isTyping,
    isRefetching,
    handleResetEstimatedLiquidity,
    resetSwapAmount: () => {
      setSwapAmount(0);
      setIsTyping(false);
      setEstimatedLiquidityMax(null);
    },
  };
};
