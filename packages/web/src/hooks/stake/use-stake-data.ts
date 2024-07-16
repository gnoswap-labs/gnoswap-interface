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
      (accum: number | null, position) => {
        if (accum === null && !position.tokenABalance) return null;

        if (accum === null) return Number(position.tokenABalance);

        if (!position.tokenABalance) return accum;

        return accum + Number(position.tokenABalance);
      },
      null,
    );
    const pooledTokenBAmount = positions.reduce(
      (accum: number | null, position) => {
        if (accum === null && !position.tokenBBalance) return null;

        if (accum === null) return Number(position.tokenBBalance);

        if (!position.tokenBBalance) return accum;

        return accum + Number(position.tokenBBalance);
      },
      null,
    );
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd
      ? Number(tokenPrices[tokenA.priceID]?.usd)
      : null;
    console.log("🚀 ~ pooledTokenInfos ~ tokenAPrice:", tokenAPrice);

    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd
      ? Number(tokenPrices[tokenB.priceID]?.usd)
      : null;

    const tokenAUSD =
      pooledTokenAAmount !== null && tokenAPrice !== null
        ? pooledTokenAAmount * tokenAPrice
        : null;

    const tokenBUSD =
      pooledTokenBAmount !== null && tokenBPrice !== null
        ? pooledTokenBAmount * tokenBPrice
        : null;

    return [
      {
        token: tokenA,
        amount: pooledTokenAAmount
          ? makeDisplayTokenAmount(tokenA, pooledTokenAAmount)
          : null,
        amountUSD: formatOtherPrice(tokenAUSD, {
          isKMB: false,
        }),
      },
      {
        token: tokenB,
        amount: pooledTokenBAmount
          ? makeDisplayTokenAmount(tokenA, pooledTokenBAmount)
          : null,
        amountUSD: formatOtherPrice(tokenBUSD, {
          isKMB: false,
        }),
      },
    ];
  }, [positions, tokenPrices]);

  const unclaimedRewards = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const unclaimedTokenAAmount = positions.reduce(
      (accum: number | null, position) => {
        if (accum === null && !position.unclaimedFeeAAmount) return null;

        if (accum === null) return Number(position.unclaimedFeeAAmount);

        if (!position.unclaimedFeeAAmount) return accum;

        return accum + Number(position.unclaimedFeeAAmount);
      },
      null,
    );
    const unclaimedTokenBAmount = positions.reduce(
      (accum: number | null, position) => {
        if (accum === null && !position.unclaimedFeeBAmount) return null;

        if (accum === null) return Number(position.unclaimedFeeBAmount);

        if (!position.unclaimedFeeBAmount) return accum;

        return accum + Number(position.unclaimedFeeBAmount);
      },
      null,
    );
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd
      ? Number(tokenPrices[tokenA.priceID]?.usd)
      : null;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd
      ? Number(tokenPrices[tokenB.priceID]?.usd)
      : null;

    const tokenAUSD =
      unclaimedTokenAAmount !== null && tokenAPrice !== null
        ? unclaimedTokenAAmount * tokenAPrice
        : null;

    const tokenBUSD =
      unclaimedTokenBAmount !== null && tokenBPrice !== null
        ? unclaimedTokenBAmount * tokenBPrice
        : null;

    return [
      {
        token: tokenA,
        amount: unclaimedTokenAAmount
          ? makeDisplayTokenAmount(tokenA, unclaimedTokenAAmount)
          : "",
        amountUSD: formatOtherPrice(tokenAUSD, {
          isKMB: false,
        }),
      },
      {
        token: tokenB,
        amount: unclaimedTokenBAmount
          ? makeDisplayTokenAmount(tokenA, unclaimedTokenBAmount)
          : "",
        amountUSD: formatOtherPrice(tokenBUSD, {
          isKMB: false,
        }),
      },
    ];
  }, [positions, tokenPrices]);

  const totalLiquidityUSD = useMemo(() => {
    if (positions.length === 0) {
      return "-";
    }
    const totalUSDValue = positions.reduce((accum: number | null, position) => {
      if (accum === null && !position.positionUsdValue) return null;

      if (accum === null) return Number(position.positionUsdValue);

      if (!position.positionUsdValue) return accum;

      return accum + Number(position.positionUsdValue);
    }, null);
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
