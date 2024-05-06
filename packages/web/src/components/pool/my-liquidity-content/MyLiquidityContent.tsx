import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import Tooltip from "@components/common/tooltip/Tooltip";
import { MyLiquidityContentWrapper } from "./MyLiquidityContent.styles";
import { DEVICE_TYPE } from "@styles/media";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useTokenData } from "@hooks/token/use-token-data";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { RewardType } from "@constants/option.constant";
import { PositionClaimInfo } from "@models/position/info/position-claim-info";
import { PositionBalanceInfo } from "@models/position/info/position-balance-info";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { convertToKMB } from "@utils/stake-position-utils";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { MyPositionClaimContent } from "../my-position-card/MyPositionCardClaimContent";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PositionAPRInfo } from "@models/position/info/position-apr-info";
import { MyPositionAprContent } from "../my-position-card/MyPositionCardAprContent";
import { numberToFormat } from "@utils/string-utils";
import { toUnitFormat } from "@utils/number-utils";

interface MyLiquidityContentProps {
  connected: boolean;
  positions: PoolPositionModel[];
  breakpoint: DEVICE_TYPE;
  isDisabledButton: boolean;
  claimAll: () => void;
  loading: boolean;
  loadngTransactionClaim: boolean;
  isOtherPosition: boolean;
}

const MyLiquidityContent: React.FC<MyLiquidityContentProps> = ({
  connected,
  positions,
  breakpoint,
  claimAll,
  loading,
  loadngTransactionClaim,
  isOtherPosition,
}) => {
  const { tokenPrices } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

  const positionData = positions?.[0]?.pool;

  const isDisplay = useMemo(() => {
    return connected === true || positions.length > 0;
  }, [connected, positions]);

  const allBalances = useMemo(() => {
    if (!isDisplay) {
      return null;
    }
    return positions.reduce<{ [key in string]: PositionBalanceInfo }>(
      (balanceMap, position) => {
        const sumOfBalances = Number(position.tokenABalance) + Number(position.tokenBBalance);
        const depositRatio = sumOfBalances === 0 ? 0.5 : Number(position.tokenABalance) / sumOfBalances;
        const tokenABalance =
          makeDisplayTokenAmount(
            position.pool.tokenA,
            position.tokenABalance,
          ) || 0;
        const tokenBBalance =
          makeDisplayTokenAmount(
            position.pool.tokenB,
            position.tokenBBalance,
          ) || 0;
        const tokenABalanceInfo = {
          token: position.pool.tokenA,
          balanceUSD:
            tokenABalance *
            Number(tokenPrices[position.pool.tokenA.priceId]?.usd || 1),
          percent: `${Math.round(depositRatio * 100)}%`,
        };
        const tokenBBalanceInfo = {
          token: position.pool.tokenB,
          balanceUSD:
            tokenBBalance *
            Number(tokenPrices[position.pool.tokenB.priceId]?.usd || 1),
          percent: `${Math.round((1 - depositRatio) * 100)}%`,
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
        const changedTokenABalanceUSD =
          balanceMap[tokenABalanceInfo.token.priceId].balanceUSD +
          tokenABalanceInfo.balanceUSD;
        const changedTokenABalance =
          balanceMap[tokenABalanceInfo.token.priceId].balance +
          Number(position.tokenABalance);
        balanceMap[tokenABalanceInfo.token.priceId] = {
          ...tokenABalanceInfo,
          balance: changedTokenABalance,
          balanceUSD: changedTokenABalanceUSD,
        };
        const changedTokenBBalanceUSD =
          balanceMap[tokenBBalanceInfo.token.priceId].balanceUSD +
          tokenBBalanceInfo.balanceUSD;
        const changedTokenBBalance =
          balanceMap[tokenBBalanceInfo.token.priceId].balance +
          Number(position.tokenBBalance);
        balanceMap[tokenBBalanceInfo.token.priceId] = {
          ...tokenBBalanceInfo,
          balance: changedTokenBBalance,
          balanceUSD: changedTokenBBalanceUSD,
        };
        return balanceMap;
      },
      {},
    );
  }, [isDisplay, positions, tokenPrices]);

  const totalBalance = useMemo(() => {
    if (!isDisplay) {
      return "-";
    }
    if (!allBalances) {
      return "$0";
    }
    const balance = Object.values(allBalances).reduce(
      (acc, current) => (acc += current.balanceUSD),
      0,
    );
    return `$${numberToFormat(`${balance}`, 2)}`;
  }, [allBalances, isDisplay]);

  const claimableRewardInfo = useMemo(():
    | { [key in RewardType]: PositionClaimInfo[] }
    | null => {
    if (!isDisplay) {
      return null;
    }
    const infoMap: {
      [key in RewardType]: { [key in string]: PositionClaimInfo };
    } = {
      SWAP_FEE: {},
      STAKING: {},
      EXTERNAL: {},
    };
    positions
      .flatMap(position => position.rewards)
      .map(reward => ({
        token: reward.token,
        rewardType: reward.rewardType,
        balance: makeDisplayTokenAmount(reward.token, reward.totalAmount) || 0,
        balanceUSD:
          makeDisplayTokenAmount(
            reward.token,
            Number(reward.totalAmount) *
            Number(tokenPrices[reward.token.priceId]?.usd),
          ) || 0,
        claimableAmount:
          makeDisplayTokenAmount(reward.token, reward.claimableAmount) || 0,
        claimableUSD: Number(reward.claimableUsdValue),
        accumulatedRewardOf1d: makeDisplayTokenAmount(reward.token, reward.accumulatedRewardOf1d || 0) || 0,
        claimableUsdValue: Number(reward.claimableUsdValue),
        aprOf7d: Number(reward.aprOf7d),
      }))
      .forEach(rewardInfo => {
        const existReward =
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceId];
        if (existReward) {
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceId] = {
            ...existReward,
            balance: existReward.balance + rewardInfo.balance,
            balanceUSD: existReward.balanceUSD + rewardInfo.balanceUSD,
            claimableAmount:
              existReward.claimableAmount + rewardInfo.claimableAmount,
            claimableUSD: existReward.claimableUSD + rewardInfo.claimableUSD,
            accumulatedRewardOf1d: existReward.accumulatedRewardOf1d + rewardInfo.accumulatedRewardOf1d,
            claimableUsdValue: existReward.claimableUsdValue + rewardInfo.claimableUsdValue,
            aprOf7d: existReward.aprOf7d + rewardInfo.aprOf7d,
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
  }, [isDisplay, positions, tokenPrices]);

  const aprRewardInfo = useMemo(():
    | { [key in RewardType]: PositionAPRInfo[] }
    | null => {
    if (!isDisplay) {
      return null;
    }
    const infoMap: {
      [key in RewardType]: { [key in string]: PositionAPRInfo };
    } = {
      SWAP_FEE: {},
      STAKING: {},
      EXTERNAL: {},
    };
    positions
      .flatMap(position => position.rewards)
      .map(reward => ({
        token: reward.token,
        rewardType: reward.rewardType,
        tokenAmountOf7d: Number(reward.accumulatedRewardOf7d),
        aprOf7d: Number(reward.aprOf7d),
      }))
      .forEach(rewardInfo => {
        const existReward =
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceId];
        if (existReward) {
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceId] = {
            ...existReward,
            tokenAmountOf7d: existReward.tokenAmountOf7d + rewardInfo.tokenAmountOf7d,
            aprOf7d: existReward.aprOf7d + rewardInfo.aprOf7d,
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
  }, [isDisplay, positions, tokenPrices]);

  const dailyEarning = useMemo(() => {
    if (!isDisplay) {
      return "-";
    }
    if (positions.length === 0) {
      return "$0";
    }
    const claimableUsdValue = claimableRewardInfo
      ? Object.values(claimableRewardInfo)
        .flatMap(item => item)
        .reduce((accum, current) => {
          return accum + Number(current.accumulatedRewardOf1d);
        }, 0)
      : 0;

    return toUnitFormat(claimableUsdValue, true, true);
  }, [positions, isDisplay]);

  const unclaimedRewardInfo = useMemo((): PositionClaimInfo[] | null => {
    if (!isDisplay) {
      return null;
    }
    const infoMap: { [key in string]: PositionClaimInfo } = {};
    positions
      .flatMap(position => position.rewards)
      .map(reward => ({
        token: reward.token,
        rewardType: reward.rewardType,
        balance: makeDisplayTokenAmount(reward.token, reward.totalAmount) || 0,
        balanceUSD:
          makeDisplayTokenAmount(
            reward.token,
            Number(reward.totalAmount) *
            Number(tokenPrices[reward.token.priceId]?.usd || 0),
          ) || 0,
        claimableAmount:
          makeDisplayTokenAmount(reward.token, reward.claimableAmount) || 0,
        claimableUSD: Number(reward.claimableUsdValue),
        accumulatedRewardOf1d: makeDisplayTokenAmount(reward.token, reward.accumulatedRewardOf1d || 0) || 0,
        claimableUsdValue: Number(reward.claimableUsdValue),
        aprOf7d: Number(reward.aprOf7d),
      }))
      .forEach(rewardInfo => {
        if (rewardInfo.claimableAmount > 0) {
          const existReward = infoMap[rewardInfo.token.priceId];
          if (existReward) {
            infoMap[rewardInfo.token.priceId] = {
              ...existReward,
              balance: existReward.balance + rewardInfo.balance,
              balanceUSD: existReward.balanceUSD + rewardInfo.balanceUSD,
              claimableUSD: existReward.claimableUSD + rewardInfo.claimableUSD,
              accumulatedRewardOf1d: existReward.accumulatedRewardOf1d + rewardInfo.accumulatedRewardOf1d,
              claimableUsdValue: existReward.claimableUsdValue + rewardInfo.claimableUsdValue,
              aprOf7d: existReward.aprOf7d + rewardInfo.aprOf7d,
            };
          } else {
            infoMap[rewardInfo.token.priceId] = rewardInfo;
          }
        }
      });
    return Object.values(infoMap);
  }, [isDisplay, positions, tokenPrices]);

  const claimableUSD = useMemo(() => {
    if (!isDisplay) {
      return "-";
    }
    const claimableUsdValue = claimableRewardInfo
      ? Object.values(claimableRewardInfo)
        .flatMap(item => item)
        .reduce((accum, current) => {
          return accum + Number(current.claimableUsdValue);
        }, 0)
      : 0;

    return toUnitFormat(claimableUsdValue, true, true);
  }, [claimableRewardInfo, isDisplay]);

  const claimable = useMemo(() => {
    if (!isDisplay || unclaimedRewardInfo === null) {
      return false;
    }
    return (
      unclaimedRewardInfo.reduce((accum, current) => {
        return accum + current.claimableAmount;
      }, 0) > 0
    );
  }, [isDisplay, unclaimedRewardInfo]);

  const tokenABalance = useMemo(() => {
    if (!positionData) return 0;
    const sum = positions?.reduce((accumulator, currentValue) => accumulator + Number(currentValue.tokenABalance), 0);
    return makeDisplayTokenAmount(positionData?.tokenA, sum) || 0;
  }, [positionData?.tokenA, positionData?.tokenABalance]);

  const tokenBBalance = useMemo(() => {
    if (!positionData) return 0;
    const sum = positions?.reduce((accumulator, currentValue) => accumulator + Number(currentValue.tokenBBalance), 0);
    return makeDisplayTokenAmount(positionData?.tokenB, sum) || 0;
  }, [positionData?.tokenB, positionData?.tokenBBalance]);

  const depositRatio = useMemo(() => {
    const sumOfBalances = tokenABalance + tokenBBalance;
    if (sumOfBalances === 0) {
      return 0.5;
    }
    return tokenABalance / (tokenABalance + tokenBBalance / positionData?.price);
  }, [tokenABalance, tokenBBalance, positionData?.price]);

  const depositRatioStrOfTokenA = useMemo(() => {
    const depositStr = `${Math.round(depositRatio * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const depositRatioStrOfTokenB = useMemo(() => {
    const depositStr = `${Math.round((1 - depositRatio) * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const isWrapText = useMemo(() => {
    return (
      positionData?.tokenA?.symbol.length === 4 ||
      positionData?.tokenB?.symbol.length === 4
    );
  }, [
    positionData?.tokenB?.symbol,
    positionData?.tokenA?.symbol,
  ]);

  const feeDaily = useMemo(() => {
    // const temp = claimableRewardInfo?.SWAP_FEE;
    // const sumUSD =
    //   temp?.reduce((accum, current) => accum + current.balance, 0) || 0;
    // return formatUsdNumber(`${sumUSD}`, 2, true);
    return "$0";
  }, []);

  const feeClaim = useMemo(() => {
    const temp = claimableRewardInfo?.SWAP_FEE;
    const sumUSD =
      temp?.reduce((accum, current) => accum + current.claimableUsdValue, 0) || 0;
    return toUnitFormat(`${sumUSD}`, true, true);
  }, [claimableRewardInfo]);

  const logoDaily = useMemo(() => {
    const temp = claimableRewardInfo?.SWAP_FEE;
    return temp?.map(item => getGnotPath(item.token).logoURI) || [];
  }, [claimableRewardInfo]);

  const logoReward = useMemo(() => {
    const temp = claimableRewardInfo?.STAKING;
    const rewardTokens = positionData?.rewardTokens || [];
    const rewardLogo = rewardTokens?.map(item => getGnotPath(item).logoURI) || [];
    return [...new Set([...rewardLogo, ...temp?.map(item => getGnotPath(item.token).logoURI) || []])];
  }, [claimableRewardInfo, getGnotPath, positionData]);

  const rewardDaily = useMemo(() => {
    const temp = claimableRewardInfo?.STAKING;
    const sumUSD =
      temp?.reduce((accum, current) => accum + current.balance, 0) || 0;
    return toUnitFormat(`${sumUSD}`, true, true);
  }, [claimableRewardInfo]);

  const rewardClaim = useMemo(() => {
    const temp = claimableRewardInfo?.STAKING;
    const sumUSD =
      temp?.reduce((accum, current) => accum + current.claimableAmount, 0) || 0;
    return toUnitFormat(`${sumUSD}`, true, true);
  }, [claimableRewardInfo]);

  return (
    <MyLiquidityContentWrapper>
      <section>
        <h4>Total Balance</h4>
        {!loading && (
          <span className="content-value disabled">{totalBalance}</span>
        )}
        {loading && (
          <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
            <span
              css={pulseSkeletonStyle({
                h: 22,
                w: "200px",
                tabletWidth: 160,
                smallTableWidth: 140,
              })}
            />
          </SkeletonEarnDetailWrapper>
        )}
        {!loading && positions.length > 0 && (
          <div className="sub-content">
            <div className="sub-content-detail">
              <MissingLogo
                symbol={positionData?.tokenA?.symbol}
                url={positionData?.tokenA?.logoURI}
                width={20}
                className="image-logo"
              />
              <span>
                {convertToKMB(`${tokenABalance}`)}{" "}
                <span
                  className={`token-symbol ${isWrapText ? "wrap-text" : ""
                    }`}
                >
                  {positionData?.tokenA?.symbol}
                </span>{" "}
                <span className="token-percent">
                  {depositRatioStrOfTokenA}
                </span>
              </span>
            </div>
            <div className="divider"></div>
            <div className="sub-content-detail">
              <MissingLogo
                symbol={positionData?.tokenB?.symbol}
                url={positionData?.tokenB?.logoURI}
                width={20}
                className="image-logo"
              />
              <span>
                {convertToKMB(`${tokenBBalance}`)}{" "}
                <span
                  className={`token-symbol ${isWrapText ? "wrap-text" : ""
                    }`}
                >
                  {positionData?.tokenB?.symbol}
                </span>{" "}
                <span className="token-percent">
                  {depositRatioStrOfTokenB}
                </span>
              </span>
            </div>
          </div>
        )}
      </section>
      <section>
        <h4>Total Daily Earnings</h4>
        {!loading && aprRewardInfo ? (
          <Tooltip
            placement="top"
            FloatingContent={
              <div>
                <MyPositionAprContent rewardInfo={aprRewardInfo} />
              </div>
            }
          >
            <span className="content-value">{dailyEarning}</span>
          </Tooltip>
        ) : (
          !loading && <span className="content-value disabled">{dailyEarning}</span>
        )}
        {loading && (
          <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
            <span
              css={pulseSkeletonStyle({
                h: 22,
                w: "200px",
                tabletWidth: 160,
                smallTableWidth: 140,
              })}
            />
          </SkeletonEarnDetailWrapper>
        )}
        {!loading && positions.length > 0 && (
          <div className="total-daily">
            <div className="content-wrap">
              <span>Fees</span>
              {breakpoint === DEVICE_TYPE.WEB && <OverlapLogo
                logos={logoDaily}
                size={20}
              />}
              <span className="apr-value">{feeDaily}</span>
            </div>
            <div className="divider"></div>
            <div className="content-wrap content-reward">
              <span>Rewards</span>
              {logoReward.length > 0 && breakpoint === DEVICE_TYPE.WEB && <OverlapLogo
                logos={logoReward}
                size={20}
              />}
              <span className="apr-value">{rewardDaily}</span>
            </div>
          </div>
        )}
      </section>
      <section>
        {breakpoint === DEVICE_TYPE.MOBILE ? (
          <div className="mobile-wrap">
            <div className="column-wrap">
              <h4>Total Claimable Rewards</h4>
              {!loading && (
                <div className="claim-wrap">
                  {claimableRewardInfo || unclaimedRewardInfo ? (
                    <Tooltip
                      placement="top"
                      FloatingContent={
                        <MyPositionClaimContent
                          rewardInfo={claimableRewardInfo}
                          unclaimedRewardInfo={unclaimedRewardInfo}
                        />
                      }
                    >
                      <span className="content-value">{claimableUSD}</span>
                    </Tooltip>
                  ) : (
                    <span className="content-value disabled">
                      {claimableUSD}
                    </span>
                  )}
                </div>
              )}
              {loading && (
                <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
                  <span
                    css={pulseSkeletonStyle({
                      h: 22,
                      w: "200px",
                      tabletWidth: 160,
                      smallTableWidth: 140,
                    })}
                  />
                </SkeletonEarnDetailWrapper>
              )}
            </div>
            {claimable && !isOtherPosition && (
              <Button
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
                leftIcon={
                  loadngTransactionClaim ? (
                    <LoadingSpinner className="loading-button" />
                  ) : undefined
                }
                onClick={claimAll}
              />
            )}
          </div>
        ) : (
          <>
            <h4>Total Claimable Rewards</h4>
            <div className="claim-wrap">
              {!loading && (claimableRewardInfo || unclaimedRewardInfo) ? (
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <MyPositionClaimContent
                      rewardInfo={claimableRewardInfo}
                      unclaimedRewardInfo={unclaimedRewardInfo}
                    />
                  }
                >
                  <span className="content-value has-tooltip">
                    {claimableUSD}
                  </span>
                </Tooltip>
              ) : (
                !loading && (
                  <span className="content-value disabled">
                    {claimableUSD}
                  </span>
                )
              )}
              {loading && (
                <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
                  <span
                    css={pulseSkeletonStyle({
                      h: 22,
                      w: "200px",
                      tabletWidth: 160,
                      smallTableWidth: 140,
                    })}
                  />
                </SkeletonEarnDetailWrapper>
              )}
              {claimable && !isOtherPosition && (
                <Button
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
                  leftIcon={
                    loadngTransactionClaim ? (
                      <LoadingSpinner className="loading-button" />
                    ) : undefined
                  }
                />
              )}
            </div>
            {!loading && positions.length > 0 && (
              <div className="total-daily">
                <div className="content-wrap">
                  <span>Fees</span>
                  {breakpoint === DEVICE_TYPE.WEB && <OverlapLogo
                    logos={logoDaily}
                    size={20}
                  />}
                  <span className="apr-value">{feeClaim}</span>
                </div>
                <div className="divider"></div>
                <div className="content-wrap content-reward">
                  <span>Rewards</span>
                  {logoReward.length > 0 && breakpoint === DEVICE_TYPE.WEB && <OverlapLogo
                    logos={logoReward}
                    size={20}
                  />}
                  <span className="apr-value">{rewardClaim}</span>
                </div>
              </div>
            )}
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
//     const tokenAUnclaimedBalance = makeDisplayTokenAmount(tokenA, position.unclaimedFeeAAmount) || 0;
//     const tokenBUnclaimedBalance = makeDisplayTokenAmount(tokenB, position.unclaimedFeeBAmount) || 0;
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
