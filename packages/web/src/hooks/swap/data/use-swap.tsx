import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import useDebounce from "@hooks/common/use-debounce";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useReferral } from "@hooks/common/use-referral";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useGetRoutes } from "@query/router";
import { calculateSlippageLimitAmount } from "@utils/swap-utils";
import { makeDisplayTokenAmountString } from "@utils/token-utils";

import { WUGNOT_TOKEN } from "@common/values/token-constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { SwapDirectionType } from "@common/values";
import { EstimatedRoute } from "@models/swap/swap-route-info";
import { TokenModel, isNativeToken } from "@models/token/token-model";

interface UseSwapProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  direction: SwapDirectionType;
  slippage: number;
  swapFee?: number;
}

/** Returns true when the amount string is a positive number. */
function isPositiveAmount(amount: string | null): amount is string {
  if (amount === null) return false;
  const value = BigNumber(amount);
  return value.isFinite() && value.isGreaterThan(0);
}

export const useSwap = ({ tokenA, tokenB, direction, slippage }: UseSwapProps) => {
  const { swapRouterRepository } = useGnoswapContext();
  const { getNextReferralAddress } = useReferral();

  const { account } = useWallet();
  const { tokens, isFetched: isFetchedTokens } = useTokenData(true);
  const wugnotToken = useMemo(() => tokens.find(token => token.path === WRAPPED_GNOT_PATH) ?? WUGNOT_TOKEN, [tokens]);

  const SWAP_AMOUNT_DEBOUNCE_TIME_MS = 500;
  const SWAP_DEADLINE_SEC = 60 * 5;
  // Amounts are kept as decimal strings: a JS number cannot represent balances above 2^53 raw units
  const [swapAmount, setSwapAmount] = useState<string | null>(null);
  const debouncedAmount = useDebounce(swapAmount, isPositiveAmount(swapAmount) ? SWAP_AMOUNT_DEBOUNCE_TIME_MS : 0);
  const [estimatedLiquidityMax, setEstimatedLiquidityMax] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const debouncedSwapAmount = useMemo(() => {
    if (!isPositiveAmount(swapAmount)) {
      return swapAmount;
    }
    return debouncedAmount;
  }, [swapAmount, debouncedAmount]);

  const shouldFetchData = useCallback(
    (amount: string | null) => {
      if (!tokenA || !tokenB) return false;
      if (!isPositiveAmount(amount)) return false;
      if (!estimatedLiquidityMax) return true;
      return BigNumber(amount).isLessThan(estimatedLiquidityMax);
    },
    [estimatedLiquidityMax, tokenA, tokenB],
  );
  const shouldFetch = shouldFetchData(debouncedSwapAmount);

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

  const hasValidSwapAmount = isPositiveAmount(debouncedSwapAmount);
  const hasValidTokenPaths = Boolean(tokenA?.path) && Boolean(tokenB?.path);
  const isDifferentTokens = !isSameToken;

  const isEnabledQuery = shouldFetch && hasValidSwapAmount && hasValidTokenPaths && isDifferentTokens;

  const getTokenAmount = useMemo(() => {
    if (direction === "EXACT_IN") {
      return debouncedSwapAmount;
    }

    return debouncedSwapAmount;
  }, [debouncedSwapAmount, direction]);

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
    if (!selectedTokenPair || !isPositiveAmount(debouncedSwapAmount)) {
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
  }, [
    debouncedSwapAmount,
    estimatedSwapResult?.status,
    isEstimatedSwapLoading,
    isSameToken,
    selectedTokenPair,
    shouldFetch,
  ]);

  const estimatedRoutes: EstimatedRoute[] | null = useMemo(() => {
    if (isSameToken) {
      return [];
    }

    if (swapState === "LOADING" || !isPositiveAmount(debouncedSwapAmount) || isTyping) {
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

    if (!isPositiveAmount(debouncedSwapAmount) || error || isTyping) {
      return null;
    }

    if (swapState !== "SUCCESS" || !estimatedSwapResult) {
      return null;
    }

    const amount = estimatedSwapResult.amount;

    return direction === "EXACT_IN"
      ? makeDisplayTokenAmountString(tokenB, amount)
      : makeDisplayTokenAmountString(tokenA, amount);
  }, [debouncedSwapAmount, direction, error, estimatedSwapResult, isTyping, swapState, tokenA, tokenB]);

  const tokenAmountLimit = useMemo(() => {
    if (!tokenA || !tokenB || !estimatedAmount || Number.isNaN(slippage)) {
      return "0";
    }

    // EXACT_IN: minimum output (tokenB, rounded down). EXACT_OUT: maximum input (tokenA, rounded up).
    const limitToken = direction === "EXACT_IN" ? tokenB : tokenA;

    return calculateSlippageLimitAmount(estimatedAmount, slippage, direction, limitToken.decimals);
  }, [direction, estimatedAmount, slippage, tokenA, tokenB]);

  const updateSwapAmount = (amount: string) => {
    if (!amount) {
      setSwapAmount(null);
      setIsTyping(false);
      return;
    }
    const processedAmount = amount.endsWith(".") ? amount.slice(0, -1) : amount;
    const parsedAmount = BigNumber(processedAmount);
    // Normalize without converting to a JS number so every digit of the input survives
    const newAmount = !parsedAmount.isFinite() || parsedAmount.isZero() ? "0" : parsedAmount.toFixed();

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
      if (!selectedTokenPair || !isFetchedTokens) {
        return null;
      }

      const currentReferralAddress = getNextReferralAddress();

      if (direction === "EXACT_IN") {
        return swapRouterRepository.sendExactInSwapRoute({
          inputToken: tokenA,
          outputToken: tokenB,
          wugnotToken,
          tokenAmount,
          estimatedRoutes: estimatedRoutes,
          slippage: slippage,
          originAmount: estimatedSwapResult?.originAmount || 0,
          tokenAmountLimit: tokenAmountLimit,
          deadline: Math.floor(Date.now() / 1000) + SWAP_DEADLINE_SEC,
          referrerAddress: currentReferralAddress,
        });
      }

      if (direction === "EXACT_OUT") {
        return swapRouterRepository.sendExactOutSwapRoute({
          inputToken: tokenA,
          outputToken: tokenB,
          wugnotToken,
          tokenAmount,
          estimatedRoutes: estimatedRoutes,
          slippage: slippage,
          originAmount: estimatedSwapResult?.originAmount || 0,
          tokenAmountLimit: tokenAmountLimit,
          deadline: Math.floor(Date.now() / 1000) + SWAP_DEADLINE_SEC,
          referrerAddress: currentReferralAddress,
        });
      }
    },
    [
      account,
      direction,
      selectedTokenPair,
      isFetchedTokens,
      swapRouterRepository,
      tokenA,
      estimatedSwapResult?.originAmount,
      slippage,
      tokenAmountLimit,
      tokenB,
      wugnotToken,
      getNextReferralAddress,
    ],
  );

  useEffect(() => {
    if (estimatedRoutes === null || !tokenA || !tokenB) return;

    if (estimatedRoutes.length === 0) {
      if (!estimatedLiquidityMax) {
        setEstimatedLiquidityMax(isPositiveAmount(debouncedSwapAmount) ? debouncedSwapAmount : null);
      } else if (
        isPositiveAmount(debouncedSwapAmount) &&
        BigNumber(debouncedSwapAmount).isLessThan(estimatedLiquidityMax)
      ) {
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
      setSwapAmount("0");
      setIsTyping(false);
      setEstimatedLiquidityMax(null);
    },
  };
};
