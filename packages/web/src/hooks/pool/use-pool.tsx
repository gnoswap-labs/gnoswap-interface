import { SwapFeeTierType } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { useCallback } from "react";

export const usePool = () => {
  const { account } = useWallet();
  const { poolRepository } = useGnoswapContext();

  const createPool = useCallback(async ({
    tokenA,
    tokenB,
    tokenAAmount,
    tokenBAmount,
    swapFeeTier,
    startPrice,
    priceRange,
    slippage,
  }: {
    tokenA: TokenModel;
    tokenB: TokenModel;
    tokenAAmount: string;
    tokenBAmount: string;
    swapFeeTier: SwapFeeTierType;
    startPrice: string;
    priceRange: AddLiquidityPriceRage;
    slippage: number;
  }) => {
    if (!account) {
      return null;
    }
    const hash = await poolRepository.createPool({
      tokenA,
      tokenB,
      tokenAAmount,
      tokenBAmount,
      feeTier: swapFeeTier,
      startPrice,
      minTick: priceRange.range.minTick,
      maxTick: priceRange.range.maxTick,
      slippage,
      caller: account.address
    }).catch(e => {
      console.error(e);
      return null;
    });
    return hash;
  }, [account, poolRepository]);

  return {
    createPool
  };
};