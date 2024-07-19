import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { checkGnotPath } from "@utils/common";
import { formatOtherPrice } from "@utils/new-number-utils";
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
      (accum: number | null, position) => {
        if (accum === null && !position.tokenABalance) return null;

        if (accum === null) return Number(position.tokenABalance);

        if (!position.tokenABalance) return accum;

        return accum + Number(position.tokenABalance);
      },
      null,
    );
    const pooledTokenBAmount = selectedPosition.reduce(
      (accum: number | null, position) => {
        if (accum === null && !position.tokenBBalance) return null;

        if (accum === null) return Number(position.tokenBBalance);

        if (!position.tokenBBalance) return accum;

        return accum + Number(position.tokenBBalance);
      },
      null,
    );

    const tokenAPriceId = checkGnotPath(tokenA.priceID);
    const tokenBPriceId = checkGnotPath(tokenB.priceID);

    const tokenAPrice = tokenPrices[tokenAPriceId]?.usd
      ? Number(tokenPrices[tokenAPriceId]?.usd)
      : null;
    const tokenBPrice = tokenPrices[tokenBPriceId]?.usd
      ? Number(tokenPrices[tokenBPriceId]?.usd)
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
        amount: pooledTokenAAmount,
        amountUSD: formatOtherPrice(tokenAUSD, {
          isKMB: false,
        }),
      },
      {
        token: tokenB,
        amount: pooledTokenBAmount,
        amountUSD: formatOtherPrice(tokenBUSD, {
          isKMB: false,
        }),
      },
    ];
  }, [selectedPosition, tokenPrices]);

  const unclaimedRewards = useMemo(() => {
    if (selectedPosition.length === 0) {
      return [];
    }
    const tokenA = selectedPosition[0].pool.tokenA;
    const tokenB = selectedPosition[0].pool.tokenB;
    const unclaimedTokenAAmount = selectedPosition.reduce(
      (accum: number | null, position) => {
        if (accum === null && !position.unclaimedFeeAAmount) return null;

        if (accum === null) return Number(position.unclaimedFeeAAmount);

        if (!position.unclaimedFeeAAmount) return accum;

        return accum + Number(position.unclaimedFeeAAmount);
      },
      null,
    );
    const unclaimedTokenBAmount = selectedPosition.reduce(
      (accum: number | null, position) => {
        if (accum === null && !position.unclaimedFeeBAmount) return null;

        if (accum === null) return Number(position.unclaimedFeeBAmount);

        if (!position.unclaimedFeeBAmount) return accum;

        return accum + Number(position.unclaimedFeeBAmount);
      },
      null,
    );

    const tokenAPriceId = checkGnotPath(tokenA.priceID);
    const tokenBPriceId = checkGnotPath(tokenB.priceID);

    const tokenAPrice = tokenPrices[tokenAPriceId]?.usd
      ? Number(tokenPrices[tokenAPriceId]?.usd)
      : null;
    const tokenBPrice = tokenPrices[tokenBPriceId]?.usd
      ? Number(tokenPrices[tokenBPriceId]?.usd)
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
        amount: unclaimedTokenAAmount,
        amountUSD: formatOtherPrice(tokenAUSD, {
          isKMB: false,
        }),
      },
      {
        token: tokenB,
        amount: unclaimedTokenBAmount,
        amountUSD: formatOtherPrice(tokenBUSD, {
          isKMB: false,
        }),
      },
    ];
  }, [selectedPosition, tokenPrices]);

  const totalLiquidityUSD = useMemo(() => {
    if (selectedPosition.length === 0) {
      return "-";
    }
    const totalUSDValue = selectedPosition.reduce(
      (accum: number | null, position) => {
        if (accum === null && !position.positionUsdValue) return null;

        if (accum === null) return Number(position.positionUsdValue);

        if (!position.positionUsdValue) return accum;

        return accum + Number(position.positionUsdValue);
      },
      null,
    );
    return formatOtherPrice(totalUSDValue, {
      isKMB: false,
    });
  }, [selectedPosition]);

  return {
    pooledTokenInfos,
    unclaimedRewards,
    totalLiquidityUSD,
  };
};
