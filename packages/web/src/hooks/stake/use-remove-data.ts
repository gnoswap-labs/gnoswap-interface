import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { numberToUSD } from "@utils/number-utils";
import { useMemo } from "react";

export interface RemoveDataProps {
  selectedPosition: PoolPositionModel[];
}

export const useRemoveData = ({ selectedPosition }: RemoveDataProps) => {
  const { tokenPrices } = useTokenData();

  const pooledTokenInfos = useMemo(() => {
    if (selectedPosition.length === 0) {
      return [];
    }
    const tokenA = selectedPosition[0].pool.tokenA;
    const tokenB = selectedPosition[0].pool.tokenB;
    const pooledTokenAAmount = selectedPosition.reduce(
      (accum, position) => accum + position.tokenABalance,
      0,
    );
    const pooledTokenBAmount = selectedPosition.reduce(
      (accum, position) => accum + position.tokenBBalance,
      0,
    );
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd || 0;
    const tokenAAmount = Number(pooledTokenAAmount) || 0;
    const tokenBAmount = Number(pooledTokenBAmount) || 0;
    return [
      {
        token: tokenA,
        amount: tokenAAmount,
        amountUSD: numberToUSD(tokenAAmount * Number(tokenAPrice)),
      },
      {
        token: tokenB,
        amount: tokenBAmount,
        amountUSD: numberToUSD(tokenBAmount * Number(tokenBPrice)),
      },
    ];
  }, [selectedPosition, tokenPrices]);

  const unclaimedRewards = useMemo(() => {
    if (selectedPosition.length === 0) {
      return [];
    }
    const tokenA = selectedPosition[0].pool.tokenA;
    const tokenB = selectedPosition[0].pool.tokenB;
    const pooledTokenAAmount = selectedPosition.reduce(
      (accum, position) => accum + position.unclaimedFeeAAmount,
      0,
    );
    const pooledTokenBAmount = selectedPosition.reduce(
      (accum, position) => accum + position.unclaimedFeeBAmount,
      0,
    );
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd || 0;
    const tokenAAmount = Number(pooledTokenAAmount) || 0;
    const tokenBAmount = Number(pooledTokenBAmount) || 0;
    return [
      {
        token: tokenA,
        amount: tokenAAmount,
        amountUSD: numberToUSD(tokenAAmount * Number(tokenAPrice)),
      },
      {
        token: tokenB,
        amount: tokenBAmount,
        amountUSD: numberToUSD(tokenBAmount * Number(tokenBPrice)),
      },
    ];
  }, [selectedPosition, tokenPrices]);

  const totalLiquidityUSD = useMemo(() => {
    if (selectedPosition.length === 0) {
      return "-";
    }
    const totalUSDValue = selectedPosition.reduce(
      (accum, position) => accum + Number(position.positionUsdValue),
      0,
    );
    return numberToUSD(totalUSDValue);
  }, [selectedPosition]);

  return {
    pooledTokenInfos,
    unclaimedRewards,
    totalLiquidityUSD,
  };
};
