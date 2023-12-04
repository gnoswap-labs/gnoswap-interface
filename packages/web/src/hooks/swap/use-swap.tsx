import { SwapDirectionType } from "@common/values";
import { EstimatedRoute } from "@gnoswap-labs/swap-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useSlippage } from "@hooks/common/use-slippage";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
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
  const { slippage } = useSlippage();

  const selectedTokenPair = tokenA !== null && tokenB !== null;

  const tokenAmountLimit = useMemo(() => {
    if (estimatedAmount && !Number.isNaN(Number(slippage))) {
      const slippageAmountNumber = BigNumber(estimatedAmount).multipliedBy(Number(slippage) * 0.01);
      const tokenAmountLimit = direction === "EXACT_IN" ?
        BigNumber(estimatedAmount).minus(slippageAmountNumber).toNumber() :
        BigNumber(estimatedAmount).plus(slippageAmountNumber).toNumber();

      return tokenAmountLimit > 0 ? Math.round(tokenAmountLimit) : 0;
    }
    return 0;
  }, [direction, estimatedAmount, slippage]);

  const estimateSwapRoute = async (amount: string) => {
    if (!selectedTokenPair) {
      return null;
    }
    if (Number.isNaN(amount)) {
      return null;
    }
    const pools = await poolRepository.getRPCPools();
    swapRouterRepository.updatePools(pools);

    return swapRouterRepository.estimateSwapRoute({
      inputToken: tokenA,
      outputToken: tokenB,
      exactType: direction,
      tokenAmount: Number(amount)
    }).then(response => {
      console.log("response", response);
      setEstimatedRoutes(response.estimatedRoutes);
      setEstimatedAmount(response.amount);
      return response;
    }).catch(() => {
      setEstimatedRoutes([]);
      setEstimatedAmount(null);
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
      tokenAmount: Math.floor(Number(tokenAmount)),
      tokenAmountLimit
    })
      .catch(() => false);
    return response;
  }, [account, direction, selectedTokenPair, swapRouterRepository, tokenA, tokenAmountLimit, tokenB]);

  return {
    tokenAmountLimit,
    estimatedRoutes,
    swap,
    estimateSwapRoute
  };
};