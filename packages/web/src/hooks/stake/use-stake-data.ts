import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { checkGnotPath } from "@utils/common";
import { formatOtherPrice } from "@utils/new-number-utils";
import { useMemo } from "react";

export interface StakeDataProps {
  positions: PoolPositionModel[];
}

export const useStakeData = ({ positions }: StakeDataProps) => {
  const { tokenPrices } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

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
    const tokenAPriceId = checkGnotPath(tokenA.priceID);
    const tokenBPriceId = checkGnotPath(tokenB.priceID);

    const tokenAPrice = tokenPrices[tokenAPriceId]?.usd
      ? Number(tokenPrices[tokenBPriceId]?.usd)
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
        rawAmountUsd: tokenAUSD,
      },
      {
        token: tokenB,
        amount: pooledTokenBAmount,
        amountUSD: formatOtherPrice(tokenBUSD, {
          isKMB: false,
        }),
        rawAmountUsd: tokenBUSD,
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
        token: { ...tokenA, ...getGnotPath(tokenA) },
        amount: unclaimedTokenAAmount,
        amountUSD: formatOtherPrice(tokenAUSD, {
          isKMB: false,
        }),
        rawAmountUsd: tokenAUSD,
      },
      {
        token: { ...tokenB, ...getGnotPath(tokenB) },
        amount: unclaimedTokenBAmount,
        amountUSD: formatOtherPrice(tokenBUSD, {
          isKMB: false,
        }),
        rawAmountUsd: tokenBUSD,
      },
    ];
  }, [getGnotPath, positions, tokenPrices]);

  const totalLiquidityUSD = useMemo(() => {
    if (positions.length === 0) {
      return "-";
    }
    const poolUsd = pooledTokenInfos.reduce((acc: null | number, current) => {
      if (acc === null && current.rawAmountUsd === null) {
        return null;
      }

      if (acc === null) {
        return current.rawAmountUsd;
      }

      if (current.rawAmountUsd === null) {
        return acc;
      }

      return acc + current.rawAmountUsd;
    }, null);

    const claimUsd = unclaimedRewards.reduce((acc: null | number, current) => {
      if (acc === null && current.rawAmountUsd === null) {
        return null;
      }

      if (acc === null) {
        return current.rawAmountUsd;
      }

      if (current.rawAmountUsd === null) {
        return acc;
      }

      return acc + current.rawAmountUsd;
    }, null);

    const total = (() => {
      if (poolUsd === null && claimUsd === null) {
        return null;
      }

      if (poolUsd === null) {
        return claimUsd;
      }

      if (claimUsd === null) {
        return poolUsd;
      }

      return poolUsd + claimUsd;
    })();

    return formatOtherPrice(total, {
      isKMB: false,
    });
  }, [pooledTokenInfos, positions.length, unclaimedRewards]);

  return {
    pooledTokenInfos,
    unclaimedRewards,
    totalLiquidityUSD,
  };
};
