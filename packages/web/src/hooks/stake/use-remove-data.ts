import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { formatOtherPrice } from "@utils/new-number-utils";
import { useMemo } from "react";

export interface RemoveDataProps {
  selectedPosition: PoolPositionModel[];
}

export const useRemoveData = ({ selectedPosition }: RemoveDataProps) => {
  console.log("🚀 ~ useRemoveData ~ selectedPosition:", selectedPosition);
  const { tokenPrices } = useTokenData();

  const pooledTokenInfos = useMemo(() => {
    if (selectedPosition.length === 0) {
      return [];
    }
    const tokenA = selectedPosition[0].pool.tokenA;
    const tokenB = selectedPosition[0].pool.tokenB;
    const pooledTokenAAmount = selectedPosition.reduce(
      (accum, position) => accum + Number(position.tokenABalance),
      0,
    );
    const pooledTokenBAmount = selectedPosition.reduce(
      (accum, position) => accum + Number(position.tokenBBalance),
      0,
    );
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd || 0;
    const tokenAAmount = Number(pooledTokenAAmount) || 0;
    const tokenBAmount = Number(pooledTokenBAmount) || 0;

    const priceAEmpty =
      !tokenPrices[tokenA.priceID]?.usd ||
      selectedPosition.every(item => !item.tokenABalance);
    const priceBEmpty =
      !tokenPrices[tokenB.priceID]?.usd ||
      selectedPosition.every(item => !item.tokenBBalance);
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
  }, [selectedPosition, tokenPrices]);

  const unclaimedRewards = useMemo(() => {
    if (selectedPosition.length === 0) {
      return [];
    }
    const tokenA = selectedPosition[0].pool.tokenA;
    const tokenB = selectedPosition[0].pool.tokenB;
    const pooledTokenAAmount = selectedPosition.reduce(
      (accum, position) => accum + Number(position.unclaimedFeeAAmount),
      0,
    );
    const pooledTokenBAmount = selectedPosition.reduce(
      (accum, position) => accum + Number(position.unclaimedFeeBAmount),
      0,
    );
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd || 0;
    const tokenAAmount = Number(pooledTokenAAmount) || 0;
    const tokenBAmount = Number(pooledTokenBAmount) || 0;

    const priceAEmpty =
      !tokenPrices[tokenA.priceID]?.usd ||
      selectedPosition.every(item => !item.unclaimedFeeAAmount);
    const priceBEmpty =
      !tokenPrices[tokenB.priceID]?.usd ||
      selectedPosition.every(item => !item.unclaimedFeeBAmount);

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
  }, [selectedPosition, tokenPrices]);

  const totalLiquidityUSD = useMemo(() => {
    if (selectedPosition.length === 0) {
      return "-";
    }
    const totalUSDValue = selectedPosition.reduce(
      (accum, position) => accum + Number(position.positionUsdValue),
      0,
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
