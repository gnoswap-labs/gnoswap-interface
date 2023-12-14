import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { numberToUSD } from "@utils/number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { useMemo } from "react";

export interface UnstakeDataProps {
  positions: PoolPositionModel[];
}

export const useUnstakeData = ({ positions }: UnstakeDataProps) => {
  const { tokenPrices } = useTokenData();

  const pooledTokenInfos = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const pooledTokenAAmount = positions.reduce(
      (accum, position) => accum + position.token0Balance,
      0n,
    );
    const pooledTokenBAmount = positions.reduce(
      (accum, position) => accum + position.token1Balance,
      0n,
    );
    const tokenAPrice = tokenPrices[tokenA.priceId]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceId]?.usd || 0;
    const tokenAAmount =
      makeDisplayTokenAmount(tokenA, Number(pooledTokenAAmount)) || 0;
    const tokenBAmount =
      makeDisplayTokenAmount(tokenB, Number(pooledTokenBAmount)) || 0;
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
  }, [positions, tokenPrices]);

  const unclaimedRewards = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const pooledTokenAAmount = positions.reduce(
      (accum, position) => accum + position.unclaimedFee0Amount,
      0n,
    );
    const pooledTokenBAmount = positions.reduce(
      (accum, position) => accum + position.unclaimedFee1Amount,
      0n,
    );
    const tokenAPrice = tokenPrices[tokenA.priceId]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceId]?.usd || 0;
    const tokenAAmount =
      makeDisplayTokenAmount(tokenA, Number(pooledTokenAAmount)) || 0;
    const tokenBAmount =
      makeDisplayTokenAmount(tokenB, Number(pooledTokenBAmount)) || 0;
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
  }, [positions, tokenPrices]);

  const totalLiquidityUSD = useMemo(() => {
    if (positions.length === 0) {
      return "-";
    }
    const totalUSDValue = positions.reduce(
      (accum, position) => accum + Number(position.positionUsdValue),
      0,
    );
    return numberToUSD(totalUSDValue);
  }, [positions]);

  return {
    pooledTokenInfos,
    unclaimedRewards,
    totalLiquidityUSD,
  };
};
