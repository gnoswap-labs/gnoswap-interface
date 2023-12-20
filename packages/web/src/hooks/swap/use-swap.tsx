import { SwapDirectionType } from "@common/values";
import { EstimatedRoute } from "@gnoswap-labs/swap-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useSlippage } from "@hooks/common/use-slippage";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel, isNativeToken } from "@models/token/token-model";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";

interface UseSwapProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  direction: SwapDirectionType;
  slippage: string;
}

export const useSwap = ({
  tokenA,
  tokenB,
  direction,
}: UseSwapProps) => {
  const { account } = useWallet();
  const { poolRepository, swapRouterRepository } = useGnoswapContext();
  const [estimatedRoutes, setEstimatedRoutes] = useState<EstimatedRoute[]>([]);
  const [estimatedAmount, setEstimatedAmount] = useState<string | null>(null);
  const [swapState, setSwapState] = useState<"NONE" | "LOADING" | "NO_LIQUIDITY" | "SUCCESS">("NONE");
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

  const tokenAmountLimit = useMemo(() => {
    if (estimatedAmount && !Number.isNaN(Number(slippage))) {
      const shift = tokenA?.decimals || 6;
      const slippageAmountNumber = BigNumber(estimatedAmount).multipliedBy(Number(slippage) * 0.01);
      const tokenAmountLimit = direction === "EXACT_IN" ?
        BigNumber(estimatedAmount).minus(slippageAmountNumber).shiftedBy(shift).toNumber() :
        BigNumber(estimatedAmount).plus(slippageAmountNumber).shiftedBy(shift).toNumber();

      if (tokenAmountLimit <= 0) {
        return 0;
      }
      return tokenA ? makeDisplayTokenAmount(tokenA, tokenAmountLimit) || 0 : 0;
    }
    return 0;
  }, [direction, estimatedAmount, slippage, tokenA]);

  const estimateSwapRoute = async (amount: string) => {
    if (!selectedTokenPair) {
      setSwapState("NONE");
      return null;
    }
    if (Number.isNaN(amount)) {
      setSwapState("NONE");
      return null;
    }
    if (isSameToken) {
      setSwapState("NONE");
      return null;
    }

    setSwapState("LOADING");
    const pools = await poolRepository.getRPCPools().catch(() => []);
    swapRouterRepository.updatePools(pools);

    return swapRouterRepository.estimateSwapRoute({
      inputToken: tokenA,
      outputToken: tokenB,
      exactType: direction,
      tokenAmount: Number(amount)
    }).then(response => {
      console.log("response", response);
      if (response.amount === "0" || response.amount === "") {
        setSwapState("NO_LIQUIDITY");
        setEstimatedRoutes([]);
        setEstimatedAmount(null);
        return null;
      } else {
        setSwapState("SUCCESS");
      }
      setEstimatedRoutes(response.estimatedRoutes);
      setEstimatedAmount(response.amount);
      return response;
    }).catch(e => {
      console.error(e);
      setEstimatedRoutes([]);
      setEstimatedAmount(null);
      setSwapState("NONE");
      return null;
    });
  };

  const swap = useCallback(async (estimatedRoutes: EstimatedRoute[], tokenAmount: string) => {
    if (!account) {
      return false;
    }
    if (!selectedTokenPair) {
      return false;
    }
    const response = await swapRouterRepository.swapRoute({
      inputToken: tokenA,
      outputToken: tokenB,
      estimatedRoutes,
      exactType: direction,
      tokenAmount: Number(tokenAmount),
      tokenAmountLimit
    })
      .catch(() => false);
    return response;
  }, [account, direction, selectedTokenPair, swapRouterRepository, tokenA, tokenAmountLimit, tokenB]);

  const wrapToken = useCallback(async (token: TokenModel, tokenAmount: string) => {
    if (!account) {
      return false;
    }
    if (!selectedTokenPair) {
      return false;
    }
    const response = await swapRouterRepository.wrapToken({
      token,
      tokenAmount: Number(tokenAmount).toString()
    }).catch(() => false);
    return response;
  }, [account, selectedTokenPair, swapRouterRepository]);

  const unwrapToken = useCallback(async (token: TokenModel, tokenAmount: string) => {
    if (!account) {
      return false;
    }
    if (!selectedTokenPair) {
      return false;
    }
    const response = await swapRouterRepository.unwrapToken({
      token,
      tokenAmount: Number(tokenAmount).toString()
    }).catch(() => false);
    return response;
  }, [account, selectedTokenPair, swapRouterRepository]);

  return {
    isSameToken,
    tokenAmountLimit,
    estimatedRoutes,
    swapState,
    swap,
    wrapToken,
    unwrapToken,
    estimateSwapRoute
  };
};