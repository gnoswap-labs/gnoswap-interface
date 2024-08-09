import { useMemo } from "react";

import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { checkGnotPath } from "@utils/common";
import {
  formatOtherPrice,
  formatPoolPairAmount,
} from "@utils/new-number-utils";
import { TokenModel } from "@models/token/token-model";

type RewardAccum = {
  token: TokenModel;
  type: "SWAP_FEE" | "STAKING_REWARDS";
  amount: number | null;
  amountUSD: string;
  rawAmountUsd: number | null;
};
export interface PositionsRewardsProps {
  positions: PoolPositionModel[];
}

export const usePositionsRewards = ({ positions }: PositionsRewardsProps) => {
  const { tokens, tokenPrices } = useTokenData();
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

    const tokenAPriceId = checkGnotPath(tokenA.priceID);
    const tokenBPriceId = checkGnotPath(tokenB.priceID);

    const tokenAPrice = tokenPrices[tokenAPriceId]?.usd
      ? Number(tokenPrices[tokenAPriceId]?.usd)
      : null;
    const tokenBPrice = tokenPrices[tokenBPriceId]?.usd
      ? Number(tokenPrices[tokenBPriceId]?.usd)
      : null;

    return [
      {
        token: tokenA,
        amount: formatPoolPairAmount(pooledTokenAAmount, {
          decimals: tokenA.decimals,
          isKMB: false,
        }),
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
        amount: formatPoolPairAmount(pooledTokenBAmount, {
          decimals: tokenA.decimals,
          isKMB: false,
        }),
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

  const unclaimed: { rewards: RewardAccum[]; fees: RewardAccum[] } =
    useMemo(() => {
      if (positions.length === 0) {
        return { rewards: [], fees: [] };
      }

      const rewardTokenList: string[] = [];

      for (let i = 0; i < positions.length; i++) {
        for (let j = 0; j < positions[i].reward.length; j++) {
          if (
            !rewardTokenList.includes(positions[i].reward[j].rewardToken.path)
          )
            rewardTokenList.push(positions[i].reward[j].rewardToken.path);
          if (rewardTokenList.length >= 4) break;
        }
        if (rewardTokenList.length >= 4) break;
      }

      const rewards = rewardTokenList.reduce<RewardAccum[]>(
        (rewardList, rewardTokenPath) => {
          const rewardToken = tokens.find(
            item => item.path === rewardTokenPath,
          );
          const tokenPriceId = checkGnotPath(rewardToken?.priceID || "");
          const tokenPrice = tokenPrices[tokenPriceId]?.usd
            ? Number(tokenPrices[tokenPriceId]?.usd)
            : 0;

          const rewardAccum = positions.reduce<{
            fee: {
              amount: number;
              usd: number;
            };
            rewards: {
              amount: number;
              usd: number;
            };
          } | null>(
            (
              accum: {
                fee: {
                  amount: number;
                  usd: number;
                };
                rewards: {
                  amount: number;
                  usd: number;
                };
              } | null,
              position,
            ) => {
              if (accum === null && !position.reward) return null;

              const newAccum = accum ?? {
                fee: {
                  amount: 0,
                  usd: 0,
                },
                rewards: {
                  amount: 0,
                  usd: 0,
                },
              };

              position.reward.forEach(rewardInfo => {
                if (rewardInfo.rewardToken.path === rewardTokenPath) {
                  if (rewardInfo.rewardType !== "SWAP_FEE") {
                    newAccum.rewards.amount += Number(
                      rewardInfo.claimableAmount,
                    );
                    newAccum.rewards.usd +=
                      Number(rewardInfo.claimableUsd) ||
                      Number(rewardInfo.claimableAmount) * tokenPrice;
                  } else {
                    newAccum.fee.amount += Number(rewardInfo.claimableAmount);
                    newAccum.fee.usd +=
                      Number(rewardInfo.claimableUsd) ||
                      Number(rewardInfo.claimableAmount) * tokenPrice;
                  }
                }
              });

              return newAccum;
            },
            null,
          );

          if (rewardAccum?.fee.amount) {
            rewardList.push({
              token: { ...rewardToken!, ...getGnotPath(rewardToken) },
              type: "SWAP_FEE",
              amount: rewardAccum.fee.amount || null,
              amountUSD: rewardAccum.fee.usd
                ? formatOtherPrice(rewardAccum.fee.usd, {
                    isKMB: false,
                  })
                : "-",
              rawAmountUsd: rewardAccum.fee.usd || null,
            });
          }
          if (rewardAccum?.rewards.amount) {
            rewardList.push({
              token: { ...rewardToken!, ...getGnotPath(rewardToken) },
              type: "STAKING_REWARDS",
              amount: rewardAccum.rewards.amount || null,
              amountUSD: rewardAccum.rewards.usd
                ? formatOtherPrice(rewardAccum.rewards.usd, {
                    isKMB: false,
                  })
                : "-",
              rawAmountUsd: rewardAccum.rewards.usd || null,
            });
          }

          return rewardList;
        },
        [],
      );

      return {
        rewards: rewards.filter(
          item => item.type === "STAKING_REWARDS",
        ),
        fees: rewards.filter(item => item.type === "SWAP_FEE"),
      };
    }, [getGnotPath, positions, tokens]);

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

    const claimUsd = unclaimed.rewards.reduce((acc: null | number, current) => {
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
      const tmpTotal = (poolUsd || 0) + (claimUsd || 0);
      return tmpTotal !== 0 ? tmpTotal : null;
    })();

    return formatOtherPrice(total, { isKMB: false });
  }, [pooledTokenInfos, positions.length, unclaimed.rewards]);

  return {
    pooledTokenInfos,
    unclaimedRewards: unclaimed.rewards,
    unclaimedFees: unclaimed.fees,
    totalLiquidityUSD,
  };
};
