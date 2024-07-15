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
      (accum: number | null, position) => {
        if (accum === null && !position.tokenABalance) return null;

        if (accum === null) {
          return Number(position.tokenABalance);
        }

        if (!position.tokenABalance) {
          return accum;
        }

        return accum + Number(position.tokenABalance);
      },
      null,
    );
    const pooledTokenBAmount = positions.reduce(
      (accum: number | null, position) => {
        if (accum === null && !position.tokenBBalance) return null;

        if (accum === null) {
          return Number(position.tokenBBalance);
        }

        if (!position.tokenBBalance) {
          return accum;
        }

        return accum + Number(position.tokenBBalance);
      },
      null,
    );
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd
      ? Number(tokenPrices[tokenA.priceID]?.usd)
      : null;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd
      ? Number(tokenPrices[tokenB.priceID]?.usd)
      : null;
    // const tokenAAmount = pooledTokenAAmount;
    // const tokenBAmount = Number(pooledTokenBAmount) || 0;

    return [
      {
        token: tokenA,
        amount: pooledTokenAAmount,
        amountUSD:
          pooledTokenAAmount !== null && tokenAPrice !== null
            ? formatOtherPrice(pooledTokenAAmount * tokenAPrice, {
                isKMB: false,
              })
            : "-",
        rawAmountUsd:
          pooledTokenAAmount !== null && tokenAPrice != null
            ? pooledTokenAAmount * tokenAPrice
            : null,
      },
      {
        token: tokenB,
        amount: pooledTokenBAmount,
        amountUSD:
          pooledTokenBAmount !== null && tokenBPrice !== null
            ? formatOtherPrice(pooledTokenBAmount * tokenBPrice, {
                isKMB: false,
              })
            : "-",
        rawAmountUsd:
          pooledTokenBAmount !== null && tokenBPrice != null
            ? pooledTokenBAmount * tokenBPrice
            : null,
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
                amount: current.claimableAmount
                  ? Number(current.claimableAmount)
                  : null,
                rawAmountUsd: current.claimableUsd
                  ? Number(current.claimableUsd)
                  : null,
                amountUSD: formatOtherPrice(current.claimableUsd, {
                  isKMB: false,
                }),
              },
            ];
          }

          const amount = (() => {
            if (acc[existedData].amount === null || !current.claimableAmount) {
              return null;
            }

            if (acc[existedData].amount === null) {
              return Number(current.claimableAmount);
            }

            if (!current.claimableAmount) {
              return acc[existedData].amount;
            }

            return (
              acc[existedData].amount || 0 + Number(current.claimableAmount)
            );
          })();

          const rawAmountUsd = (() => {
            if (
              acc[existedData].rawAmountUsd === null ||
              !current.claimableUsd
            ) {
              return null;
            }

            if (acc[existedData].rawAmountUsd === null) {
              return Number(current.claimableUsd);
            }

            if (!current.claimableAmount) {
              return acc[existedData].rawAmountUsd;
            }

            return (
              acc[existedData].rawAmountUsd || 0 + Number(current.claimableUsd)
            );
          })();

          const amountUSD = formatOtherPrice(rawAmountUsd, { isKMB: false });

          acc[existedData] = {
            ...acc[existedData],
            amount,
            rawAmountUsd,
            amountUSD,
          };

          return acc;
        },
        [] as {
          token: TokenModel;
          amount: number | null;
          rawAmountUsd: number | null;
          amountUSD: string;
        }[],
      );
  }, [getGnotPath, positions]);

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

    return formatOtherPrice(total);
  }, [pooledTokenInfos, positions.length, unclaimedRewards]);

  return {
    pooledTokenInfos,
    unclaimedRewards,
    totalLiquidityUSD,
  };
};
