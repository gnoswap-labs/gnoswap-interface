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

export interface UnstakeDataProps {
  positions: PoolPositionModel[];
}

export const useUnstakeData = ({ positions }: UnstakeDataProps) => {
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

  const unclaimedRewards = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }

    const rewardTokenList: string[] = [];

    for (let i = 0; i < positions.length; i++) {
      for (let j = 0; j < positions[i].reward.length; j++) {
        if (!rewardTokenList.includes(positions[i].reward[j].rewardToken.path))
          rewardTokenList.push(positions[i].reward[j].rewardToken.path);
        if (rewardTokenList.length >= 4) break;
      }
      if (rewardTokenList.length >= 4) break;
    }

    console.log(positions);
    console.log(rewardTokenList);

    const rewards = rewardTokenList.reduce<
      {
        token: TokenModel;
        amount: number | null;
        amountUSD: string;
        rawAmountUsd: number | null;
      }[]
    >((rewardList, rewardTokenPath) => {
      const rewardToken = tokens.find(item => item.path === rewardTokenPath);

      const rewardAccum = positions.reduce<{
        amount: number;
        usd: number;
      } | null>((accum: { amount: number; usd: number } | null, position) => {
        if (accum === null && !position.reward) return null;

        let amount = 0;
        let usd = 0;

        position.reward.forEach((rewardInfo) => {
          if (rewardInfo.rewardToken.path === rewardTokenPath) {
            amount += Number(rewardInfo.claimableAmount);
            usd += Number(rewardInfo.claimableUsd);
          }
        });

        if (accum === null) return { amount, usd };

        if (!amount) return accum;

        return {
          amount: accum.amount + amount,
          usd: accum.usd + usd,
        };
      }, null);

      rewardList.push({
        token: { ...rewardToken!, ...getGnotPath(rewardToken) },
        amount: rewardAccum?.amount || null,
        amountUSD: formatOtherPrice(rewardAccum?.usd, { isKMB: false }),
        rawAmountUsd: rewardAccum?.usd || null,
      });
      return rewardList;
    }, []); 

    console.log(rewards);

    return rewards;
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
      const tmpTotal = (poolUsd || 0) + (claimUsd || 0);
      return tmpTotal !== 0 ? tmpTotal : null;
    })();

    return formatOtherPrice(total, { isKMB: false });
  }, [pooledTokenInfos, positions.length, unclaimedRewards]);

  return {
    pooledTokenInfos,
    unclaimedRewards,
    totalLiquidityUSD,
  };
};
