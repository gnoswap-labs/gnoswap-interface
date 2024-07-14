import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { formatOtherPrice } from "@utils/new-number-utils";
import { useMemo } from "react";

export interface UnstakeDataProps {
  positions: PoolPositionModel[];
}

export const useUnstakeData = ({ positions }: UnstakeDataProps) => {
  const { tokenPrices } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

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
        amountUSD: formatOtherPrice(tokenAAmount * Number(tokenAPrice)),
        rawAmountUsd: tokenAAmount * Number(tokenAPrice),
      },
      {
        token: tokenB,
        amount: tokenBAmount,
        amountUSD: formatOtherPrice(tokenBAmount * Number(tokenBPrice)),
        rawAmountUsd: tokenBAmount * Number(tokenBPrice),
      },
    ];
  }, [positions, tokenPrices]);

  const unclaimedRewards = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }

    return positions
      .flatMap(item => item.reward)
      .filter(
        item =>
          item.rewardType === "EXTERNAL" || item.rewardType === "INTERNAL",
      )
      .reduce(
        (acc, current) => {
          const currentToken = current.rewardToken;
          const checkGnotToken = getGnotPath(currentToken);

          const existedData = acc.findIndex(
            item => item.token.priceID === currentToken.priceID,
          );

          if (existedData === -1) {
            return [
              ...acc,
              {
                token: {
                  ...currentToken,
                  ...checkGnotToken,
                },
                amount: Number(current.claimableAmount),
                rawAmountUsd: Number(current.claimableUsd),
                amountUSD: formatOtherPrice(Number(current.claimableUsd) ?? 0),
              },
            ];
          }

          acc[existedData] = {
            ...acc[existedData],
            amount: acc[existedData].amount + Number(current.claimableAmount),
            rawAmountUsd:
              acc[existedData].rawAmountUsd + Number(current.claimableUsd),
            amountUSD: formatOtherPrice(
              Number(
                acc[existedData].rawAmountUsd + Number(current.claimableUsd),
              ) ?? 0,
            ),
          };

          return acc;
        },
        [] as {
          token: TokenModel;
          amount: number;
          rawAmountUsd: number;
          amountUSD: string;
        }[],
      );
  }, [getGnotPath, positions]);

  const totalLiquidityUSD = useMemo(() => {
    if (positions.length === 0) {
      return "-";
    }
    const totalUSDValue =
      pooledTokenInfos.reduce((acc, current) => acc + current.rawAmountUsd, 0) +
      unclaimedRewards.reduce((acc, current) => acc + current.rawAmountUsd, 0);
    return formatOtherPrice(totalUSDValue);
  }, [pooledTokenInfos, positions.length, unclaimedRewards]);

  return {
    pooledTokenInfos,
    unclaimedRewards,
    totalLiquidityUSD,
  };
};
