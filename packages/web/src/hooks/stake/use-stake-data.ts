import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { formatOtherPrice } from "@utils/new-number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { useMemo } from "react";

export interface StakeDataProps {
  positions: PoolPositionModel[];
}

export const useStakeData = ({ positions }: StakeDataProps) => {
  const { tokenPrices } = useTokenData();

  const pooledTokenInfos = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const pooledTokenAAmount = positions.reduce(
      (accum, position) => accum + Number(position.tokenABalance),
      0,
    );
    const pooledTokenBAmount = positions.reduce(
      (accum, position) => accum + Number(position.tokenBBalance),
      0,
    );
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd || 0;
    const tokenAAmount =
      makeDisplayTokenAmount(tokenA, Number(pooledTokenAAmount)) || 0;
    const tokenBAmount =
      makeDisplayTokenAmount(tokenB, Number(pooledTokenBAmount)) || 0;

    const priceAEmpty =
      !tokenAPrice || positions.every(item => !item.tokenABalance);
    const priceBEmpty =
      !tokenBPrice || positions.every(item => !item.tokenBBalance);

    return [
      {
        token: tokenA,
        amount: tokenAAmount,
        amountUSD: priceAEmpty
          ? formatOtherPrice(tokenAAmount * Number(tokenAPrice), {
              isKMB: false,
            })
          : "-",
      },
      {
        token: tokenB,
        amount: tokenBAmount,
        amountUSD: priceBEmpty
          ? formatOtherPrice(tokenBAmount * Number(tokenBPrice), {
              isKMB: false,
            })
          : "-",
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
      (accum, position) => accum + Number(position.unclaimedFeeAAmount),
      0,
    );
    const pooledTokenBAmount = positions.reduce(
      (accum, position) => accum + Number(position.unclaimedFeeBAmount),
      0,
    );
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd || 0;
    const tokenAAmount =
      makeDisplayTokenAmount(tokenA, Number(pooledTokenAAmount)) || 0;
    const tokenBAmount =
      makeDisplayTokenAmount(tokenB, Number(pooledTokenBAmount)) || 0;

    const priceAEmpty =
      !tokenAPrice || positions.every(item => !item.unclaimedFeeAAmount);
    const priceBEmpty =
      !tokenBPrice || positions.every(item => !item.unclaimedFeeBAmount);

    return [
      {
        token: tokenA,
        amount: tokenAAmount,
        amountUSD: priceAEmpty
          ? formatOtherPrice(tokenAAmount * Number(tokenAPrice), {
              isKMB: false,
            })
          : "-",
      },
      {
        token: tokenB,
        amount: tokenBAmount,
        amountUSD: priceBEmpty
          ? formatOtherPrice(tokenBAmount * Number(tokenBPrice), {
              isKMB: false,
            })
          : "-",
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
    return formatOtherPrice(totalUSDValue, {
      isKMB: false,
    });
  }, [positions]);

  return {
    pooledTokenInfos,
    unclaimedRewards,
    totalLiquidityUSD,
  };
};
