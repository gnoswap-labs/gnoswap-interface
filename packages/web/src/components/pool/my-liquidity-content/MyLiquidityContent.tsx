import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import Tooltip from "@components/common/tooltip/Tooltip";
import { MyLiquidityContentWrapper } from "./MyLiquidityContent.styles";
import { DEVICE_TYPE } from "@styles/media";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { RewardType } from "@constants/option.constant";
import { PositionClaimInfo } from "@models/position/info/position-claim-info";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { convertToKMB } from "@utils/stake-position-utils";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { MyPositionClaimContent } from "../my-position-card/MyPositionCardClaimContent";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PositionAPRInfo } from "@models/position/info/position-apr-info";
import { MyPositionAprContent } from "../my-position-card/MyPositionCardAprContent";
import { numberToFormat } from "@utils/string-utils";
import { toPriceFormat, toUnitFormat } from "@utils/number-utils";
import { TokenPriceModel } from "@models/token/token-price-model";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { TokenModel } from "@models/token/token-model";

interface MyLiquidityContentProps {
  connected: boolean;
  positions: PoolPositionModel[];
  breakpoint: DEVICE_TYPE;
  isDisabledButton: boolean;
  claimAll: () => void;
  loadingTransactionClaim: boolean;
  isOtherPosition: boolean;
  isLoadingPositionsById: boolean;
  tokenPrices: Record<string, TokenPriceModel>;
}

const MyLiquidityContent: React.FC<MyLiquidityContentProps> = ({
  connected,
  positions,
  breakpoint,
  claimAll,
  loadingTransactionClaim,
  isOtherPosition,
  isLoadingPositionsById: loading,
  tokenPrices,
}) => {
  const { getGnotPath } = useGnotToGnot();

  const positionData = positions?.[0]?.pool;

  const isDisplay = useMemo(() => {
    return connected === true || positions.length > 0;
  }, [connected, positions]);

  const totalBalance = useMemo(() => {
    const isEmpty = positions.every(item => !item.usdValue);

    if (!isDisplay || isEmpty) {
      return "-";
    }
    const balance = positions.reduce((current, next) => {
      return current + Number(next.usdValue);
    }, 0);
    return `$${numberToFormat(`${balance}`, { decimals: 2 })}`;
  }, [isDisplay, positions]);

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
      INTERNAL: {},
      EXTERNAL: {},
      // Not use any more
      STAKING: {},
    };
    positions
      .flatMap(position => position.reward)
      .map(reward => ({
        token: reward.rewardToken,
        rewardType: reward.rewardType,
        balance: reward.totalAmount || 0,
        balanceUSD:
          makeDisplayTokenAmount(
            reward.rewardToken,
            Number(reward.totalAmount) *
            Number(tokenPrices[reward.rewardToken.priceID]?.usd),
          ) || 0,
        claimableAmount: Number(reward.claimableAmount) || 0,
        claimableUSD: Number(reward.claimableUsd),
        accumulatedRewardOf1d: Number(reward.accuReward1D) || 0,
        claimableUsdValue: Number(reward.claimableUsd),
      }))
      .forEach(rewardInfo => {
        const existReward =
          infoMap[rewardInfo.rewardType]?.[rewardInfo.token.priceID];
        if (existReward) {
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...existReward,
            balance: existReward.balance + rewardInfo.balance,
            balanceUSD: existReward.balanceUSD + rewardInfo.balanceUSD,
            claimableAmount:
              existReward.claimableAmount + rewardInfo.claimableAmount,
            claimableUSD: existReward.claimableUSD + rewardInfo.claimableUSD,
            accumulatedRewardOf1d:
              existReward.accumulatedRewardOf1d +
              rewardInfo.accumulatedRewardOf1d,
            claimableUsdValue:
              existReward.claimableUsdValue + rewardInfo.claimableUsdValue,
            accumulatedRewardOf1dUsd:
              existReward.accumulatedRewardOf1dUsd +
              rewardInfo.accumulatedRewardOf1d *
              Number(tokenPrices[rewardInfo.token.priceID]?.usd ?? 0),
          };
        } else {
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...rewardInfo,
            accumulatedRewardOf1dUsd:
              rewardInfo.accumulatedRewardOf1d *
              Number(tokenPrices[rewardInfo.token.priceID]?.usd ?? 0),
          };
        }
      });

    return {
      SWAP_FEE: Object.values(infoMap["SWAP_FEE"]),
      INTERNAL: Object.values(infoMap["INTERNAL"]),
      EXTERNAL: Object.values(infoMap["EXTERNAL"]),
      // Not use any more
      STAKING: Object.values(infoMap["STAKING"]),
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
      INTERNAL: {},
      EXTERNAL: {},
      // Not use any more
      STAKING: {},
    };
    positions
      .flatMap(position => position.reward)
      .map(reward => ({
        token: reward.rewardToken,
        rewardType: reward.rewardType,
        accuReward1D: Number(reward.accuReward1D),
        apr: Number(reward.apr),
      }))
      .forEach(rewardInfo => {
        const existReward =
          infoMap[rewardInfo.rewardType]?.[rewardInfo.token.priceID];
        const tokenPrice = Number(
          tokenPrices[rewardInfo.token.priceID]?.usd ?? 0,
        );
        if (existReward) {
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...existReward,
            accuReward1D: existReward.accuReward1D + rewardInfo.accuReward1D,
            apr: existReward.apr + rewardInfo.apr,
            accuReward1DPrice:
              existReward.accuReward1D * tokenPrice +
              rewardInfo.accuReward1D * tokenPrice,
          };
        } else {
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...rewardInfo,
            accuReward1DPrice: rewardInfo.accuReward1D * tokenPrice,
          };
        }
      });
    return {
      SWAP_FEE: Object.values(infoMap["SWAP_FEE"]),
      INTERNAL: Object.values(infoMap["INTERNAL"]),
      EXTERNAL: Object.values(infoMap["EXTERNAL"]),
      // Not use any more
      STAKING: Object.values(infoMap["STAKING"]),
    };
  }, [isDisplay, positions, tokenPrices]);

  const isShowRewardInfoTooltip = useMemo(() => {
    return (
      aprRewardInfo !== null &&
      (aprRewardInfo?.EXTERNAL.length !== 0 ||
        aprRewardInfo?.INTERNAL.length !== 0 ||
        aprRewardInfo?.SWAP_FEE.length !== 0)
    );
  }, [aprRewardInfo]);

  const dailyEarning = useMemo(() => {
    const isEmpty = positions
      .flatMap(item => item.reward)
      .every(item => !item.accuReward1D);

    if (!isDisplay || isEmpty) {
      return "-";
    }

    const claimableUsdValue = claimableRewardInfo
      ? Object.values(claimableRewardInfo)
        .flatMap(item => item)
        .reduce((accum, current) => {
          return accum + Number(current.accumulatedRewardOf1dUsd);
        }, 0)
      : 0;

    return toPriceFormat(claimableUsdValue, {
      usd: true,
      minLimit: 0.01,
      fixedLessThan1Decimal: 2,
    });
  }, [positions, isDisplay, claimableRewardInfo]);

  const unclaimedRewardInfo = useMemo((): PositionClaimInfo[] | null => {
    if (!isDisplay) {
      return null;
    }
    const infoMap: { [key in string]: PositionClaimInfo } = {};
    positions
      .flatMap(position => position.reward)
      .map(reward => ({
        token: reward.rewardToken,
        rewardType: reward.rewardType,
        balance:
          makeDisplayTokenAmount(reward.rewardToken, reward.totalAmount) || 0,
        balanceUSD:
          makeDisplayTokenAmount(
            reward.rewardToken,
            Number(reward.totalAmount) *
            Number(tokenPrices[reward.rewardToken.priceID]?.usd || 0),
          ) || 0,
        claimableAmount:
          makeDisplayTokenAmount(reward.rewardToken, reward.claimableAmount) ||
          0,
        claimableUSD: Number(reward.claimableUsd),
        accumulatedRewardOf1d:
          makeDisplayTokenAmount(
            reward.rewardToken,
            reward.accuReward1D || 0,
          ) || 0,
        claimableUsdValue: Number(reward.claimableUsd),
      }))
      .forEach(rewardInfo => {
        if (rewardInfo.claimableAmount > 0) {
          const existReward = infoMap[rewardInfo.token.priceID];
          if (existReward) {
            infoMap[rewardInfo.token.priceID] = {
              ...existReward,
              balance: existReward.balance + rewardInfo.balance,
              balanceUSD: existReward.balanceUSD + rewardInfo.balanceUSD,
              claimableUSD: existReward.claimableUSD + rewardInfo.claimableUSD,
              accumulatedRewardOf1d:
                existReward.accumulatedRewardOf1d +
                rewardInfo.accumulatedRewardOf1d,
              claimableUsdValue:
                existReward.claimableUsdValue + rewardInfo.claimableUsdValue,
              accumulatedRewardOf1dUsd:
                existReward.accumulatedRewardOf1dUsd +
                rewardInfo.accumulatedRewardOf1d *
                Number(tokenPrices[rewardInfo.token.priceID]?.usd ?? 0),
            };
          } else {
            infoMap[rewardInfo.token.priceID] = {
              ...rewardInfo,
              accumulatedRewardOf1dUsd:
                rewardInfo.accumulatedRewardOf1d *
                Number(tokenPrices[rewardInfo.token.priceID]?.usd ?? 0),
            };
          }
        }
      });
    return Object.values(infoMap);
  }, [isDisplay, positions, tokenPrices]);

  const isShowClaimableRewardInfo = useMemo(() => {
    return (
      claimableRewardInfo &&
      (claimableRewardInfo?.EXTERNAL.length !== 0 ||
        claimableRewardInfo?.INTERNAL.length !== 0 ||
        claimableRewardInfo?.SWAP_FEE.length !== 0)
    );
  }, [claimableRewardInfo]);

  const isShowUnclaimableRewardInfo = useMemo(() => {
    return unclaimedRewardInfo && unclaimedRewardInfo.length > 0;
  }, [unclaimedRewardInfo]);

  const claimableUSD = useMemo(() => {
    const isEmpty = positions
      .flatMap(item => item.reward)
      .every(item => !item.claimableUsd);

    if (!isDisplay || isEmpty) {
      return "-";
    }

    const claimableUsdValue = positions.reduce(
      (positionAcc, positionCurrent) => {
        const currentPositionDailyReward = positionCurrent.reward.reduce(
          (rewardAcc, rewardCurrent) => {
            return rewardAcc + Number(rewardCurrent.claimableUsd);
          },
          0,
        );

        return positionAcc + currentPositionDailyReward;
      },
      0,
    );
    return toPriceFormat(claimableUsdValue, {
      usd: true,
      forcedDecimals: true,
      lestThan1Decimals: 2,
      isKMBFormat: false,
      minLimit: 0.01,
    });
  }, [isDisplay, positions]);

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
    const sum = positions?.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.tokenABalance),
      0,
    );
    return sum || 0;
  }, [positionData, positions]);

  const tokenBBalance = useMemo(() => {
    if (!positionData) return 0;
    const sum = positions?.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.tokenBBalance),
      0,
    );
    return sum || 0;
  }, [positionData, positions]);

  const depositRatio = useMemo(() => {
    const sumOfBalances = tokenABalance + tokenBBalance;
    if (sumOfBalances === 0) {
      return 0.5;
    }
    return (
      tokenABalance / (tokenABalance + tokenBBalance / positionData?.price)
    );
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
  }, [positionData?.tokenB?.symbol, positionData?.tokenA?.symbol]);

  const feeDaily = useMemo(() => {
    if (!isDisplay) return "-";

    const swapFee = aprRewardInfo?.SWAP_FEE;
    const sumUSD =
      swapFee?.reduce((accum, current) => accum + current.accuReward1DPrice, 0) ||
      0;
    if (sumUSD > 0 && sumUSD <= 0.01) return "<$0.01";

    return toPriceFormat(`${"0.202"}`, {
      minLimit: 0.01,
      isRounding: false,
      lestThan1Decimals: 2,
      greaterThan1Decimals: 2,
      usd: true,
    });
  }, [aprRewardInfo?.SWAP_FEE, isDisplay]);

  const feeClaim = useMemo(() => {
    if (!isDisplay) return "-";

    const swapFeeReward = claimableRewardInfo?.SWAP_FEE;
    const sumUSD =
      swapFeeReward?.reduce((accum, current) => accum + current.claimableUsdValue, 0) ||
      0;
    return toUnitFormat(`${sumUSD}`, true, true);
  }, [claimableRewardInfo?.SWAP_FEE, isDisplay]);

  const logoDaily = useMemo(() => {
    const swapFee = claimableRewardInfo?.SWAP_FEE;
    return swapFee?.flatMap(item => item.token).reduce<TokenModel[]>(
      (acc: TokenModel[], current) => {
        const token = acc.find(item => item.path === current.path);
        if (token) {
          acc.push({ ...token, ...getGnotPath(token) });
        }
        return acc;
      },
      [],
    ) ?? [];
  }, [claimableRewardInfo?.SWAP_FEE, getGnotPath]);

  const logoReward = useMemo(() => {
    const internalRewardToken = claimableRewardInfo?.INTERNAL.map(item => item.token) ?? [];
    const rewardTokens = positionData?.rewardTokens || [];
    const tokenList = [...internalRewardToken, ...rewardTokens];
    const currentRewardTokens = tokenList.reduce<TokenModel[]>(
      (acc: TokenModel[], current) => {
        const token = acc.find(item => item.path === current.path);
        if (token) {
          acc.push(token);
        }
        return acc;
      },
      [],
    );

    return currentRewardTokens.map(token => ({
      ...token,
      ...getGnotPath(token),
    }));
  }, [claimableRewardInfo?.INTERNAL, getGnotPath, positionData?.rewardTokens]);

  const rewardDaily = useMemo(() => {
    if (!isDisplay) return "-";

    const rewards = [
      ...(aprRewardInfo?.INTERNAL ?? []),
      ...(aprRewardInfo?.EXTERNAL ?? []),
    ];
    const sumUSD =
      rewards?.reduce((accum, current) => accum + current.accuReward1DPrice, 0) ||
      0;
    return toUnitFormat(`${sumUSD}`, true, true);
  }, [aprRewardInfo?.EXTERNAL, aprRewardInfo?.INTERNAL]);

  const rewardClaim = useMemo(() => {
    if (!isDisplay) return "-";

    const rewards = [
      ...(claimableRewardInfo?.EXTERNAL ?? []),
      ...(claimableRewardInfo?.INTERNAL ?? []),
    ];
    const sumUSD =
      rewards?.reduce((accum, current) => accum + current.claimableUsdValue, 0) ||
      0;
    return toUnitFormat(`${sumUSD}`, true, true);
  }, [claimableRewardInfo?.EXTERNAL, claimableRewardInfo?.INTERNAL, isDisplay]);

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
                  className={`token-symbol ${isWrapText ? "wrap-text" : ""}`}
                >
                  {positionData?.tokenA?.symbol}
                </span>{" "}
                <span className="token-percent">{depositRatioStrOfTokenA}</span>
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
                  className={`token-symbol ${isWrapText ? "wrap-text" : ""}`}
                >
                  {positionData?.tokenB?.symbol}
                </span>{" "}
                <span className="token-percent">{depositRatioStrOfTokenB}</span>
              </span>
            </div>
          </div>
        )}
      </section>
      <section>
        <h4>Total Daily Earnings</h4>
        {!loading && isShowRewardInfoTooltip ? (
          <Tooltip
            placement="top"
            FloatingContent={
              <div>
                {aprRewardInfo && (
                  <MyPositionAprContent rewardInfo={aprRewardInfo} />
                )}
              </div>
            }
          >
            <span className="content-value">{dailyEarning}</span>
          </Tooltip>
        ) : (
          !loading && (
            <span className="content-value disabled">{dailyEarning}</span>
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
        {!loading && positions.length > 0 && (
          <div className="total-daily">
            <div className="content-wrap">
              <span>Fees</span>
              {breakpoint === DEVICE_TYPE.WEB && (
                <OverlapTokenLogo tokens={logoDaily} size={20} />
              )}
              <span className="apr-value">{feeDaily}</span>
            </div>
            <div className="divider"></div>
            <div className="content-wrap content-reward">
              <span>Rewards</span>
              {logoReward.length > 0 && breakpoint === DEVICE_TYPE.WEB && (
                <OverlapTokenLogo tokens={logoReward} size={20} />
              )}
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
                  {isShowClaimableRewardInfo || isShowUnclaimableRewardInfo ? (
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
                text={loadingTransactionClaim ? "" : "Claim All"}
                style={{
                  hierarchy: ButtonHierarchy.Primary,
                  width: 86,
                  height: 36,
                  padding: "10px 16px",
                  fontType: "p1",
                }}
                leftIcon={
                  loadingTransactionClaim ? (
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
              {!loading &&
                (isShowClaimableRewardInfo || isShowUnclaimableRewardInfo) ? (
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
                  <span className="content-value disabled">{claimableUSD}</span>
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
                  text={loadingTransactionClaim ? "" : "Claim All"}
                  style={{
                    hierarchy: ButtonHierarchy.Primary,
                    height: 36,
                    padding: "0px 16px",
                    fontType: "p1",
                  }}
                  onClick={claimAll}
                  leftIcon={
                    loadingTransactionClaim ? (
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
                  {breakpoint === DEVICE_TYPE.WEB && (
                    <OverlapTokenLogo tokens={logoDaily} size={20} />
                  )}
                  <span className="apr-value">{feeClaim}</span>
                </div>
                <div className="divider"></div>
                <div className="content-wrap content-reward">
                  <span>Rewards</span>
                  {logoReward.length > 0 && breakpoint === DEVICE_TYPE.WEB && (
                    <OverlapTokenLogo tokens={logoReward} size={20} />
                  )}
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
//       balanceUSD: tokenAUnclaimedBalance * Number(tokenPrices[tokenA.priceID]?.usd || 0),
//       token: tokenA
//     }, {
//       balance: tokenBUnclaimedBalance,
//       balanceUSD: tokenBUnclaimedBalance * Number(tokenPrices[tokenB.priceID]?.usd || 0),
//       token: tokenB
//     }];
//   }).forEach(claimInfo => {
//     const currentInfo = infoMap[claimInfo.token.priceID];
//     if (currentInfo) {
//       infoMap[claimInfo.token.priceID] = {
//         ...claimInfo,
//         balance: currentInfo.balance + claimInfo.balance,
//         balanceUSD: currentInfo.balanceUSD + claimInfo.balanceUSD,
//       };
//     } else {
//       infoMap[claimInfo.token.priceID] = claimInfo;
//     }
//   });
//   return Object.values(infoMap);
// }
