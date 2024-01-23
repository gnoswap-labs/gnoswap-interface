import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  MyLiquidityContentWrapper,
} from "./MyLiquidityContent.styles";
import { DEVICE_TYPE } from "@styles/media";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useTokenData } from "@hooks/token/use-token-data";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { RewardType } from "@constants/option.constant";
import { MyPositionRewardContent } from "../my-position-card/MyPositionCardRewardContent";
import { PositionClaimInfo } from "@models/position/info/position-claim-info";
import { PositionBalanceInfo } from "@models/position/info/position-balance-info";
import { PositionRewardInfo } from "@models/position/info/position-reward-info";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { formatUsdNumber } from "@utils/stake-position-utils";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

interface MyLiquidityContentProps {
  connected: boolean;
  positions: PoolPositionModel[];
  breakpoint: DEVICE_TYPE;
  isDisabledButton: boolean;
  claimAll: () => void;
  loading: boolean;
  loadngTransactionClaim: boolean;
}

const MyLiquidityContent: React.FC<MyLiquidityContentProps> = ({
  connected,
  positions,
  breakpoint,
  claimAll,
  loading,
  loadngTransactionClaim,
}) => {
  const { tokenPrices } = useTokenData();

  const activated = connected && positions.length > 0;

  const allBalances = useMemo(() => {
    if (!activated) {
      return null;
    }
    return positions.reduce<{ [key in string]: PositionBalanceInfo }>((balanceMap, position) => {
      const tokenABalance = makeDisplayTokenAmount(position.pool.tokenA, position.token0Balance) || 0;
      const tokenBBalance = makeDisplayTokenAmount(position.pool.tokenB, position.token1Balance) || 0;
      const tokenABalanceInfo = {
        token: position.pool.tokenA,
        balanceUSD: tokenABalance * Number(tokenPrices[position.pool.tokenA.priceId]?.usd || 1),
      };
      const tokenBBalanceInfo = {
        token: position.pool.tokenB,
        balanceUSD: tokenBBalance * Number(tokenPrices[position.pool.tokenB.priceId]?.usd || 1),
      };
      if (!balanceMap[tokenABalanceInfo.token.priceId]) {
        balanceMap[tokenABalanceInfo.token.priceId] = {
          ...tokenABalanceInfo,
          balance: 0,
          balanceUSD: 0,
        };
      }
      if (!balanceMap[tokenBBalanceInfo.token.priceId]) {
        balanceMap[tokenBBalanceInfo.token.priceId] = {
          ...tokenBBalanceInfo,
          balance: 0,
          balanceUSD: 0,
        };
      }
      const changedTokenABalanceUSD = balanceMap[tokenABalanceInfo.token.priceId].balanceUSD + tokenABalanceInfo.balanceUSD;
      const changedTokenABalance = balanceMap[tokenABalanceInfo.token.priceId].balance + Number(position.token0Balance);
      balanceMap[tokenABalanceInfo.token.priceId] = {
        ...tokenABalanceInfo,
        balance: changedTokenABalance,
        balanceUSD: changedTokenABalanceUSD,
      };
      const changedTokenBBalanceUSD = balanceMap[tokenBBalanceInfo.token.priceId].balanceUSD + tokenBBalanceInfo.balanceUSD;
      const changedTokenBBalance = balanceMap[tokenBBalanceInfo.token.priceId].balance + Number(position.token1Balance);
      balanceMap[tokenBBalanceInfo.token.priceId] = {
        ...tokenBBalanceInfo,
        balance: changedTokenBBalance,
        balanceUSD: changedTokenBBalanceUSD,
      };
      return balanceMap;
    }, {});
  }, [activated, positions, tokenPrices]);

  const totalBalance = useMemo(() => {
    if (!connected) {
      return "-";
    }
    if (!allBalances) {
      return "$0";
    }
    const balance = Object.values(allBalances).reduce((acc, current) => acc += current.balanceUSD, 0);
    return formatUsdNumber(String(balance), 2, true);
  }, [allBalances, connected]);

  const dailyEarningRewardInfo = useMemo((): { [key in RewardType]: PositionRewardInfo[] } | null => {
    return null;
  }, []);

  const dailyEarning = useMemo(() => {
    if (!connected) {
      return "-";
    }
    if (!dailyEarningRewardInfo) {
      return "$0";
    }
    const usdValue = Object.values(dailyEarningRewardInfo)
      .flatMap(item => item)
      .reduce((accum, current) => {
        return accum + current.balanceUSD;
      }, 0);
    return formatUsdNumber(String(usdValue), 2, true);
  }, [dailyEarningRewardInfo, connected]);

  const claimableRewardInfo = useMemo((): { [key in RewardType]: PositionClaimInfo[] } | null => {
    if (!activated) {
      return null;
    }
    const infoMap: { [key in RewardType]: { [key in string]: PositionClaimInfo } } = {
      "SWAP_FEE": {},
      "STAKING": {},
      "EXTERNAL": {},
    };
    positions.flatMap(position => position.rewards)
      .map(reward => ({
        token: reward.token,
        rewardType: reward.rewardType,
        balance: makeDisplayTokenAmount(reward.token, reward.totalAmount) || 0,
        balanceUSD: Number(reward.totalAmount) * Number(tokenPrices[reward.token.priceId]?.usd || 0),
        claimableAmount: makeDisplayTokenAmount(reward.token, reward.claimableAmount) || 0,
        claimableUSD: Number(reward.claimableUsdValue)
      }))
      .forEach((rewardInfo) => {
        const existReward = infoMap[rewardInfo.rewardType][rewardInfo.token.priceId];
        if (existReward) {
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceId] = {
            ...existReward,
            balance: existReward.balance + rewardInfo.balance,
            balanceUSD: existReward.balanceUSD + rewardInfo.balanceUSD,
            claimableAmount: existReward.claimableAmount + rewardInfo.claimableAmount,
            claimableUSD: existReward.claimableUSD + rewardInfo.claimableUSD,
          };
        } else {
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceId] = rewardInfo;
        }
      });
    return {
      SWAP_FEE: Object.values(infoMap["SWAP_FEE"]),
      STAKING: Object.values(infoMap["STAKING"]),
      EXTERNAL: Object.values(infoMap["EXTERNAL"]),
    };
  }, [activated, positions, tokenPrices]);

  const unclaimedRewardInfo = useMemo((): PositionClaimInfo[] | null => {
    if (!activated) {
      return null;
    }
    const infoMap: { [key in string]: PositionClaimInfo } = {};
    positions.flatMap(position => position.rewards)
      .map(reward => ({
        token: reward.token,
        rewardType: reward.rewardType,
        balance: makeDisplayTokenAmount(reward.token, reward.totalAmount) || 0,
        balanceUSD: Number(reward.totalAmount) * Number(tokenPrices[reward.token.priceId]?.usd || 0),
        claimableAmount: makeDisplayTokenAmount(reward.token, reward.claimableAmount) || 0,
        claimableUSD: Number(reward.claimableUsdValue)
      }))
      .forEach((rewardInfo) => {
        if (rewardInfo.claimableAmount > 0) {
          const existReward = infoMap[rewardInfo.token.priceId];
          if (existReward) {
            infoMap[rewardInfo.token.priceId] = {
              ...existReward,
              balance: existReward.balance + rewardInfo.balance,
              balanceUSD: existReward.balanceUSD + rewardInfo.balanceUSD,
              claimableAmount: existReward.claimableAmount + rewardInfo.claimableAmount,
              claimableUSD: existReward.claimableUSD + rewardInfo.claimableUSD,
            };
          } else {
            infoMap[rewardInfo.token.priceId] = rewardInfo;
          }
        }
      });
    return Object.values(infoMap);
  }, [activated, positions, tokenPrices]);

  const claimableUSD = useMemo(() => {
    if (!connected) {
      return "-";
    }
    const claimableUsdValue = claimableRewardInfo ? Object.values(claimableRewardInfo)
      .flatMap(item => item)
      .reduce((accum, current) => {
        return accum + current.balanceUSD;
      }, 0) : 0;
    
    return formatUsdNumber(String(claimableUsdValue), 2, true);
  }, [claimableRewardInfo, connected]);

  const claimable = useMemo(() => {
    if (!activated || unclaimedRewardInfo === null) {
      return false;
    }
    return unclaimedRewardInfo.reduce((accum, current) => {
      return accum + current.claimableAmount;
    }, 0) > 0;
  }, [activated, unclaimedRewardInfo]);

  return (
    <MyLiquidityContentWrapper>
      <section>
        <h4>Total Balance</h4>
        {!loading &&
          <span className="content-value disabled">{totalBalance}</span>
        }
        {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
          <span
            css={pulseSkeletonStyle({h:22, w:"200px",  tabletWidth: 160, smallTableWidth: 140})}
          />
        </SkeletonEarnDetailWrapper>}
      </section>
      <section>
        <h4>Total Daily Earnings</h4>
        {!loading && dailyEarningRewardInfo ? (
          <Tooltip
            placement="top"
            FloatingContent={
              <div>
                <MyPositionRewardContent rewardInfo={dailyEarningRewardInfo} />
              </div>
            }
          >
            <span className="content-value">{dailyEarning}</span>
          </Tooltip>
        ) : (!loading &&
          <span className="content-value disabled">{dailyEarning}</span>
        )}
        {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
          <span
            css={pulseSkeletonStyle({h:22, w:"200px",  tabletWidth: 160, smallTableWidth: 140})}
          />
        </SkeletonEarnDetailWrapper>}
      </section>
      <section>
        {breakpoint === DEVICE_TYPE.MOBILE ? (
          <div className="mobile-wrap">
            <div className="column-wrap">
              <h4>Total Claimable Rewards</h4>
              {!loading && <div className="claim-wrap">
                {claimableRewardInfo || unclaimedRewardInfo ? (
                  <span className="content-value">
                    {claimableUSD}
                  </span>
                ) : (
                  <span className="content-value disabled">
                    {claimableUSD}
                  </span>
                )}
              </div>}
              {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
                  <span
                    css={pulseSkeletonStyle({h:22, w:"200px",  tabletWidth: 160, smallTableWidth: 140})}
                  />
                </SkeletonEarnDetailWrapper>}
            </div>
            {claimable && <Button
              className="button-claim"
              disabled={!claimable}
              text={loadngTransactionClaim ? "" : "Claim All"}
              style={{
                hierarchy: ButtonHierarchy.Primary,
                width: 86,
                height: 36,
                padding: "10px 16px",
                fontType: "p1",
              }}
              leftIcon={loadngTransactionClaim ? <LoadingSpinner className="loading-button"/> : undefined}
              onClick={claimAll}
            />}
          </div>
        ) : (
          <>
            <h4>Total Claimable Rewards</h4>
            <div className="claim-wrap">
              {!loading && (claimableRewardInfo || unclaimedRewardInfo) ? (
                <span className="content-value disabled">
                  {claimableUSD}
                </span>
              ) : (!loading &&
                <span className="content-value disabled">
                  {claimableUSD}
                </span>
              )}
              {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
                <span
                  css={pulseSkeletonStyle({h:22, w:"200px",  tabletWidth: 160, smallTableWidth: 140})}
                />
              </SkeletonEarnDetailWrapper>}
              {claimable && <Button
                className="button-claim"
                disabled={!claimable}
                text={loadngTransactionClaim ? "" : "Claim All"}
                style={{
                  hierarchy: ButtonHierarchy.Primary,
                  height: 36,
                  padding: "0px 16px",
                  fontType: "p1",
                }}
                onClick={claimAll}
                leftIcon={loadngTransactionClaim ? <LoadingSpinner className="loading-button"/> : undefined}
              />}
            </div>
          </>
        )}
      </section>
    </MyLiquidityContentWrapper>
  );
};

export default MyLiquidityContent;

// function makeUniqueClaimableRewards(positions: PoolPositionModel[], tokenPrices: { [key in string]: TokenPriceModel | null }): PositionClaimInfo[] {
//   const infoMap: { [key in string]: PositionClaimInfo } = {};
//   positions.flatMap(position => {
//     const tokenA = position.pool.tokenA;
//     const tokenB = position.pool.tokenB;
//     const tokenAUnclaimedBalance = makeDisplayTokenAmount(tokenA, position.unclaimedFee0Amount) || 0;
//     const tokenBUnclaimedBalance = makeDisplayTokenAmount(tokenB, position.unclaimedFee1Amount) || 0;
//     return [{
//       balance: tokenAUnclaimedBalance,
//       balanceUSD: tokenAUnclaimedBalance * Number(tokenPrices[tokenA.priceId]?.usd || 0),
//       token: tokenA
//     }, {
//       balance: tokenBUnclaimedBalance,
//       balanceUSD: tokenBUnclaimedBalance * Number(tokenPrices[tokenB.priceId]?.usd || 0),
//       token: tokenB
//     }];
//   }).forEach(claimInfo => {
//     const currentInfo = infoMap[claimInfo.token.priceId];
//     if (currentInfo) {
//       infoMap[claimInfo.token.priceId] = {
//         ...claimInfo,
//         balance: currentInfo.balance + claimInfo.balance,
//         balanceUSD: currentInfo.balanceUSD + claimInfo.balanceUSD,
//       };
//     } else {
//       infoMap[claimInfo.token.priceId] = claimInfo;
//     }
//   });
//   return Object.values(infoMap);
// }