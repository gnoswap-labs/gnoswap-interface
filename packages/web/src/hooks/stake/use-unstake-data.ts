import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { numberToUSD } from "@utils/number-utils";
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
      (accum, position) => accum + position.tokenABalance,
      0,
    );
    const pooledTokenBAmount = positions.reduce(
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
        rawAmountUsd: tokenAAmount * Number(tokenAPrice),
      },
      {
        token: tokenB,
        amount: tokenBAmount,
        amountUSD: numberToUSD(tokenBAmount * Number(tokenBPrice)),
        rawAmountUsd: tokenBAmount * Number(tokenBPrice),
      },
    ];
  }, [positions, tokenPrices]);

  const unclaimedRewards = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const tokenAData = positions
      .filter(item => item.pool.tokenA.path === tokenA.path)
      .flatMap(item => item.reward)
      .filter(item => item.rewardType === "EXTERNAL" || item.rewardType === "INTERNAL")
      .reduce(
        (accum, reward) => ({
          tokenAmount: accum.tokenAmount + Number(reward.claimableAmount),
          tokenUsd: accum.tokenUsd + Number(reward.claimableUsd)
        }),
        { tokenAmount: 0, tokenUsd: 0 },
      );
    const tokenBData = positions
      .filter(item => item.pool.tokenB.path === tokenB.path)
      .flatMap(item => item.reward)
      .filter(item => item.rewardType === "EXTERNAL" || item.rewardType === "INTERNAL")
      .reduce(
        (accum, reward) => ({
          tokenAmount: accum.tokenAmount + Number(reward.claimableAmount),
          tokenUsd: accum.tokenUsd + Number(reward.claimableUsd)
        }),
        { tokenAmount: 0, tokenUsd: 0 },
      );
    return [
      {
        token: tokenA,
        amount: tokenAData.tokenAmount,
        amountUSD: numberToUSD(tokenAData.tokenUsd),
        rawAmountUsd: tokenBData.tokenUsd,
      },
      {
        token: tokenB,
        amount: tokenBData.tokenAmount,
        amountUSD: numberToUSD(tokenBData.tokenUsd),
        rawAmountUsd: tokenBData.tokenUsd,
      },
    ];
  }, [positions]);

  const totalLiquidityUSD = useMemo(() => {
    if (positions.length === 0) {
      return "-";
    }
    const totalUSDValue = pooledTokenInfos.reduce((acc, current) => acc + current.rawAmountUsd, 0)
      + unclaimedRewards.reduce((acc, current) => acc + current.rawAmountUsd, 0);
    return numberToUSD(totalUSDValue);
  }, [pooledTokenInfos, positions.length, unclaimedRewards]);

  return {
    pooledTokenInfos,
    unclaimedRewards,
    totalLiquidityUSD,
  };
};
