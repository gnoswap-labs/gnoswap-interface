import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  AmountDisplayWrapper,
  MyLiquidityContentWrapper,
  TokenAmountTooltipContentWrapper,
} from "./MyLiquidityContent.styles";
import { DEVICE_TYPE } from "@styles/media";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { RewardType } from "@constants/option.constant";
import { PositionClaimInfo } from "@models/position/info/position-claim-info";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { MyPositionClaimContent } from "../my-position-card/MyPositionCardClaimContent";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PositionAPRInfo } from "@models/position/info/position-apr-info";
import { MyPositionAprContent } from "../my-position-card/MyPositionCardAprContent";
import { TokenPriceModel } from "@models/token/token-price-model";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { TokenModel } from "@models/token/token-model";
import {
  formatOtherPrice,
  formatPoolPairAmount,
} from "@utils/new-number-utils";
import { isGNOTPath } from "@utils/common";
import { WUGNOT_TOKEN } from "@common/values/token-constant";
import { useTranslation } from "react-i18next";

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
  isSwitchNetwork: boolean;
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
  isSwitchNetwork,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const { t } = useTranslation();

  const positionData = positions?.[0]?.pool;

  const isConnected = useMemo(
    () => !isSwitchNetwork && connected,
    [connected, isSwitchNetwork],
  );

  const isDisplayData = useMemo(() => {
    const tokenAPrice = isGNOTPath(positionData?.tokenA.path)
      ? tokenPrices[WUGNOT_TOKEN.priceID]?.usd
      : tokenPrices[positionData?.tokenA.priceID]?.usd;

    const tokenBPrice = isGNOTPath(positionData?.tokenB.path)
      ? tokenPrices[WUGNOT_TOKEN.priceID]?.usd
      : tokenPrices[positionData?.tokenB.priceID]?.usd;

    return positions.length > 0 && !!tokenAPrice && !!tokenBPrice;
  }, [
    positionData?.tokenA.path,
    positionData?.tokenA.priceID,
    positionData?.tokenB.path,
    positionData?.tokenB.priceID,
    positions.length,
    tokenPrices,
  ]);

  const totalBalance = useMemo(() => {
    const isEmpty = positions.every(item => !item.usdValue);

    if (!isConnected || !isDisplayData || isEmpty) {
      return "-";
    }
    const balance = positions.reduce((current, next) => {
      return current + Number(next.usdValue);
    }, 0);

    return formatOtherPrice(balance, { isKMB: false });
  }, [isConnected, isDisplayData, positions]);

  const claimableRewardInfo = useMemo(():
    | { [key in RewardType]: PositionClaimInfo[] }
    | null => {
    if (!isConnected || !isDisplayData) {
      return null;
    }
    const infoMap: {
      [key in RewardType]: { [key in string]: PositionClaimInfo };
    } = {
      SWAP_FEE: {},
      INTERNAL: {},
      EXTERNAL: {},
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
        claimableAmount: reward.claimableAmount
          ? Number(reward.claimableAmount)
          : null,
        claimableUSD: reward.claimableUsd ? Number(reward.claimableUsd) : null,
        accumulatedRewardOf1d: reward.accuReward1D
          ? Number(reward.accuReward1D)
          : null,
        claimableUsdValue: reward.claimableUsd
          ? Number(reward.claimableUsd)
          : null,
      }))
      .forEach(rewardInfo => {
        const existReward =
          infoMap[rewardInfo.rewardType]?.[rewardInfo.token.priceID];
        const tokenPrice = tokenPrices[rewardInfo.token.priceID].usd
          ? Number(tokenPrices[rewardInfo.token.priceID].usd)
          : null;
        if (existReward) {
          const accumulatedRewardOf1d = (() => {
            if (
              existReward.accumulatedRewardOf1d === null &&
              rewardInfo.accumulatedRewardOf1d === null
            ) {
              return null;
            }

            if (existReward.accumulatedRewardOf1d === null) {
              return rewardInfo.accumulatedRewardOf1d;
            }

            if (rewardInfo.accumulatedRewardOf1d === null) {
              return existReward.accumulatedRewardOf1d;
            }

            return (
              existReward.accumulatedRewardOf1d +
              rewardInfo.accumulatedRewardOf1d
            );
          })();
          const accumulatedRewardOf1dUsd =
            accumulatedRewardOf1d !== null && tokenPrice !== null
              ? accumulatedRewardOf1d * tokenPrice
              : null;

          infoMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...existReward,
            claimableUSD: (() => {
              if (
                existReward.claimableUSD === null &&
                rewardInfo.claimableUSD === null
              ) {
                return null;
              }

              if (existReward.claimableUSD === null) {
                return rewardInfo.claimableUSD;
              }

              if (rewardInfo.claimableUSD === null) {
                return existReward.claimableUSD;
              }

              return existReward.claimableUSD + rewardInfo.claimableUSD;
            })(),
            claimableAmount:
              Number(existReward.claimableAmount || 0) +
              Number(rewardInfo.claimableAmount),
            accumulatedRewardOf1d: accumulatedRewardOf1d,
            accumulatedRewardOf1dUsd: accumulatedRewardOf1dUsd,
          };
        } else {
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...rewardInfo,
            accumulatedRewardOf1dUsd:
              rewardInfo.accumulatedRewardOf1d !== null && tokenPrice !== null
                ? tokenPrice * rewardInfo.accumulatedRewardOf1d
                : null,
          };
        }
      });

    return {
      SWAP_FEE: Object.values(infoMap["SWAP_FEE"]),
      INTERNAL: Object.values(infoMap["INTERNAL"]),
      EXTERNAL: Object.values(infoMap["EXTERNAL"]),
    };
  }, [isConnected, isDisplayData, positions, tokenPrices]);

  const aprRewardInfo = useMemo(():
    | { [key in RewardType]: PositionAPRInfo[] }
    | null => {
    if (!isConnected || !isDisplayData) {
      return null;
    }
    const infoMap: {
      [key in RewardType]: { [key in string]: PositionAPRInfo };
    } = {
      SWAP_FEE: {},
      INTERNAL: {},
      EXTERNAL: {},
    };
    positions
      .flatMap(position => position.reward)
      .map(reward => ({
        token: reward.rewardToken,
        rewardType: reward.rewardType,
        accuReward1D: reward.accuReward1D ? Number(reward.accuReward1D) : null,
        apr: reward.apr ? Number(reward.apr) : null,
      }))
      .forEach(rewardInfo => {
        const existReward =
          infoMap[rewardInfo.rewardType]?.[rewardInfo.token.priceID];
        const tokenPrice = tokenPrices[rewardInfo.token.priceID]?.usd
          ? Number(tokenPrices[rewardInfo.token.priceID]?.usd)
          : null;

        if (existReward) {
          const accuReward1D = (() => {
            if (existReward.accuReward1D === null) {
              if (rewardInfo.accuReward1D === null) {
                return null;
              }

              return rewardInfo.accuReward1D;
            }

            if (rewardInfo.accuReward1D === null) {
              return existReward.accuReward1D;
            }

            return existReward.accuReward1D + rewardInfo.accuReward1D;
          })();

          const accuReward1DPrice =
            accuReward1D !== null && tokenPrice !== null
              ? accuReward1D * tokenPrice
              : null;

          const apr = (() => {
            if (existReward.apr === null) {
              if (rewardInfo.apr === null) {
                return null;
              }

              return Number(rewardInfo.apr);
            }

            if (rewardInfo.apr === null) {
              return Number(existReward.apr);
            }

            return Number(existReward.apr) + Number(rewardInfo.apr);
          })();

          infoMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...existReward,
            accuReward1D,
            accuReward1DPrice,
            apr: apr,
          };
        } else {
          infoMap[rewardInfo.rewardType][rewardInfo.token.priceID] = {
            ...rewardInfo,
            accuReward1DPrice:
              rewardInfo.accuReward1D !== null && tokenPrice !== null
                ? Number(rewardInfo.accuReward1D) * tokenPrice
                : null,
          };
        }
      });
    return {
      SWAP_FEE: Object.values(infoMap["SWAP_FEE"]),
      INTERNAL: Object.values(infoMap["INTERNAL"]),
      EXTERNAL: Object.values(infoMap["EXTERNAL"]),
    };
  }, [isConnected, isDisplayData, positions, tokenPrices]);

  const isShowRewardInfoTooltip = useMemo(() => {
    return (
      aprRewardInfo !== null &&
      (aprRewardInfo?.EXTERNAL.length !== 0 ||
        aprRewardInfo?.INTERNAL.length !== 0 ||
        aprRewardInfo?.SWAP_FEE.length !== 0)
    );
  }, [aprRewardInfo]);

  const dailyEarning = useMemo(() => {
    if (!isConnected || !isDisplayData) {
      return "-";
    }

    const claimableUsdValue = claimableRewardInfo
      ? Object.values(claimableRewardInfo)
          .flatMap(item => item)
          .reduce((accum: null | number, current) => {
            if (
              (accum === null || accum === undefined) &&
              current.accumulatedRewardOf1dUsd === null
            ) {
              return null;
            }

            if (accum === null || accum === undefined) {
              return current.accumulatedRewardOf1dUsd;
            }

            if (current.accumulatedRewardOf1dUsd === null) {
              return accum;
            }

            return accum + current.accumulatedRewardOf1dUsd;
          }, null as number | null)
      : null;

    return formatOtherPrice(claimableUsdValue, { isKMB: false });
  }, [isConnected, isDisplayData, claimableRewardInfo]);

  const unclaimedRewardInfo = useMemo((): PositionClaimInfo[] | null => {
    if (!isConnected || !isDisplayData) {
      return null;
    }
    const infoMap: { [key in string]: PositionClaimInfo } = {};
    positions
      .flatMap(position => position.reward)
      .map(reward => ({
        token: reward.rewardToken,
        rewardType: reward.rewardType,
        claimableAmount: reward.claimableAmount
          ? makeDisplayTokenAmount(reward.rewardToken, reward.claimableAmount)
          : null,
        claimableUSD: reward.claimableUsd ? Number(reward.claimableUsd) : null,
        accumulatedRewardOf1d: reward.accuReward1D
          ? makeDisplayTokenAmount(reward.rewardToken, reward.accuReward1D)
          : null,
      }))
      .forEach(rewardInfo => {
        if (rewardInfo.claimableAmount) {
          const existReward = infoMap[rewardInfo.token.priceID];
          const tokenPrice = tokenPrices[rewardInfo.token.priceID]?.usd
            ? Number(tokenPrices[rewardInfo.token.priceID]?.usd)
            : null;

          if (existReward) {
            const accumulatedRewardOf1d = (() => {
              if (
                existReward.accumulatedRewardOf1d === null &&
                rewardInfo.accumulatedRewardOf1d === null
              ) {
                return null;
              }

              if (existReward.accumulatedRewardOf1d === null) {
                return rewardInfo.accumulatedRewardOf1d;
              }

              if (rewardInfo.accumulatedRewardOf1d === null) {
                return existReward.accumulatedRewardOf1d;
              }

              return (
                existReward.accumulatedRewardOf1d +
                rewardInfo.accumulatedRewardOf1d
              );
            })();
            const accumulatedRewardOf1dUsd =
              accumulatedRewardOf1d !== null && tokenPrice !== null
                ? accumulatedRewardOf1d * tokenPrice
                : null;

            infoMap[rewardInfo.token.priceID] = {
              ...existReward,
              claimableAmount: (() => {
                if (
                  existReward.claimableAmount === null &&
                  rewardInfo.claimableAmount === null
                ) {
                  return null;
                }

                if (existReward.claimableAmount === null) {
                  return rewardInfo.claimableAmount;
                }

                if (rewardInfo.claimableAmount === null) {
                  return existReward.claimableAmount;
                }

                return existReward.claimableAmount + rewardInfo.claimableAmount;
              })(),
              claimableUSD: (() => {
                if (
                  existReward.claimableUSD === null &&
                  rewardInfo.claimableUSD === null
                ) {
                  return null;
                }

                if (existReward.claimableUSD === null) {
                  return rewardInfo.claimableUSD;
                }

                if (rewardInfo.claimableUSD === null) {
                  return existReward.claimableUSD;
                }

                return existReward.claimableUSD + rewardInfo.claimableUSD;
              })(),
              accumulatedRewardOf1d: (() => {
                if (
                  existReward.accumulatedRewardOf1d === null &&
                  rewardInfo.accumulatedRewardOf1d === null
                ) {
                  return null;
                }

                if (existReward.accumulatedRewardOf1d === null) {
                  return rewardInfo.accumulatedRewardOf1d;
                }

                if (rewardInfo.accumulatedRewardOf1d === null) {
                  return existReward.accumulatedRewardOf1d;
                }

                return (
                  existReward.accumulatedRewardOf1d +
                  rewardInfo.accumulatedRewardOf1d
                );
              })(),

              accumulatedRewardOf1dUsd: accumulatedRewardOf1dUsd,
            };
          } else {
            infoMap[rewardInfo.token.priceID] = {
              ...rewardInfo,
              accumulatedRewardOf1dUsd:
                rewardInfo.accumulatedRewardOf1d !== null && tokenPrice !== null
                  ? rewardInfo.accumulatedRewardOf1d * Number(tokenPrice)
                  : null,
            };
          }
        }
      });
    return Object.values(infoMap);
  }, [isConnected, isDisplayData, positions, tokenPrices]);

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
      .filter(item => !item.closed)
      .flatMap(item => item.reward)
      .every(item => !item.claimableUsd);

    if (!isConnected || !isDisplayData || isEmpty) {
      return "-";
    }

    const claimableUsdValue = claimableRewardInfo
      ? Object.values(claimableRewardInfo)
          .flatMap(item => item)
          .reduce((accum: null | number, current) => {
            if (
              (accum === null || accum === undefined) &&
              current.claimableUSD === null
            ) {
              return null;
            }

            if (accum === null || accum === undefined) {
              return current.claimableUSD;
            }

            if (current.claimableUSD === null) {
              return accum;
            }

            return accum + current.claimableUSD;
          }, null as number | null)
      : null;

    return formatOtherPrice(claimableUsdValue, { isKMB: false });
  }, [claimableRewardInfo, isConnected, isDisplayData, positions]);

  const canClaimAll = useMemo(() => {
    if (!isConnected || !isDisplayData || unclaimedRewardInfo === null) {
      return false;
    }
    return unclaimedRewardInfo.reduce((accum: number | null, current) => {
      if ((accum === null || accum === undefined) && current === null) {
        return null;
      }

      if (accum === null || accum === undefined) {
        return current.claimableAmount;
      }
      if (current.claimableAmount === null) {
        return current.claimableAmount;
      }

      return accum + current.claimableAmount;
    }, null as null);
  }, [isConnected, isDisplayData, unclaimedRewardInfo]);

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

  const feeDaily = useMemo(() => {
    const swapFee = aprRewardInfo?.SWAP_FEE;
    const sumUsd = swapFee?.reduce((accum: number | null, current) => {
      if (accum === null || accum === undefined) {
        if (current.accuReward1DPrice === null) return null;

        return current.accuReward1DPrice;
      }

      if (current.accuReward1DPrice === null) {
        return accum;
      }

      return accum + current.accuReward1DPrice;
    }, null);

    if (!isConnected || !isDisplayData) return "-";

    return formatOtherPrice(sumUsd, { isKMB: false });
  }, [aprRewardInfo?.SWAP_FEE, isConnected, isDisplayData]);

  const feeClaim = useMemo(() => {
    const swapFeeReward = claimableRewardInfo?.SWAP_FEE;

    const sumUsd = swapFeeReward?.reduce((accum: number | null, current) => {
      if (accum === null || accum === undefined) {
        if (current.claimableUSD === null) return null;

        return current.claimableUSD;
      }

      if (current.claimableUSD === null) {
        return accum;
      }

      return accum + current.claimableUSD;
    }, null);

    if (!isConnected || !isDisplayData) return "-";

    return formatOtherPrice(sumUsd, { isKMB: false });
  }, [claimableRewardInfo?.SWAP_FEE, isConnected, isDisplayData]);

  const logoDaily = useMemo(() => {
    const swapFee = claimableRewardInfo?.SWAP_FEE;
    return (
      swapFee
        ?.flatMap(item => item.token)
        .reduce<TokenModel[]>((acc: TokenModel[], current) => {
          const token = acc.find(item => item.path === current.path);
          if (token) {
            acc.push({ ...token, ...getGnotPath(token) });
          }
          return acc;
        }, []) ?? []
    );
  }, [claimableRewardInfo?.SWAP_FEE, getGnotPath]);

  const logoReward = useMemo(() => {
    const internalRewardToken =
      claimableRewardInfo?.INTERNAL.map(item => item.token) ?? [];
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
    const rewards = [
      ...(aprRewardInfo?.INTERNAL ?? []),
      ...(aprRewardInfo?.EXTERNAL ?? []),
    ];

    const sumUSD = rewards?.reduce((accum: number | null, current) => {
      if (
        (accum === null || accum === undefined) &&
        current.accuReward1DPrice === null
      )
        return null;

      if (accum === null) {
        return current.accuReward1DPrice;
      }

      if (current.accuReward1DPrice === null) {
        return accum;
      }

      return accum + current.accuReward1DPrice;
    }, null);

    if (!isConnected || !isDisplayData) return "-";

    return formatOtherPrice(sumUSD, { isKMB: false });
  }, [
    aprRewardInfo?.EXTERNAL,
    aprRewardInfo?.INTERNAL,
    isConnected,
    isDisplayData,
  ]);

  const rewardClaim = useMemo(() => {
    const rewards = [
      ...(claimableRewardInfo?.EXTERNAL ?? []),
      ...(claimableRewardInfo?.INTERNAL ?? []),
    ];

    const sumUSD = rewards?.reduce((accum: number | null, current) => {
      if (accum === null && current.claimableUSD === null) return null;

      if (accum === null) {
        return current.claimableUSD;
      }

      if (current.claimableUSD === null) {
        return accum;
      }

      return accum + current.claimableUSD;
    }, null);

    const isEmpty = sumUSD === 0;

    if (!isConnected || !isDisplayData || isEmpty) return "-";

    return formatOtherPrice(sumUSD, { isKMB: false });
  }, [
    claimableRewardInfo?.EXTERNAL,
    claimableRewardInfo?.INTERNAL,
    isConnected,
    isDisplayData,
  ]);

  const renderTotalBalance = () => {
    return (
      <section>
        <h4>
          {t("Pool:position.card.balance.title", {
            context: "total",
          })}
        </h4>
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
        {!loading && positions.length > 0 && isConnected && (
          <div className="sub-content">
            <Tooltip
              placement="top"
              className="sub-content-detail"
              isShouldShowed={isConnected}
              FloatingContent={
                <TokenAmountTooltipContentWrapper>
                  <MissingLogo
                    symbol={positionData?.tokenA?.symbol}
                    url={positionData?.tokenA?.logoURI}
                    width={20}
                    className="image-logo"
                  />
                  {formatPoolPairAmount(tokenABalance, {
                    isKMB: false,
                    decimals: positionData.tokenA.decimals,
                  })}{" "}
                  <span>{positionData?.tokenA?.symbol}</span>{" "}
                </TokenAmountTooltipContentWrapper>
              }
            >
              <MissingLogo
                symbol={positionData?.tokenA?.symbol}
                url={positionData?.tokenA?.logoURI}
                width={20}
                className="image-logo"
              />
              <AmountDisplayWrapper>
                {isConnected ? (
                  <>
                    {formatPoolPairAmount(tokenABalance, {
                      decimals: 2,
                    })}{" "}
                    <span className={"token-symbol wrap-text"}>
                      {positionData?.tokenA?.symbol}
                    </span>{" "}
                    <span className="token-percent">
                      {depositRatioStrOfTokenA}
                    </span>
                  </>
                ) : (
                  "-"
                )}
              </AmountDisplayWrapper>
            </Tooltip>
            <div className="divider"></div>
            <Tooltip
              placement="top"
              className="sub-content-detail"
              isShouldShowed={isConnected}
              FloatingContent={
                <TokenAmountTooltipContentWrapper>
                  <MissingLogo
                    symbol={positionData?.tokenB?.symbol}
                    url={positionData?.tokenB?.logoURI}
                    width={20}
                    className="image-logo"
                  />
                  {formatPoolPairAmount(tokenBBalance, {
                    isKMB: false,
                    decimals: positionData.tokenA.decimals,
                  })}{" "}
                  <span>{positionData?.tokenB?.symbol}</span>{" "}
                </TokenAmountTooltipContentWrapper>
              }
            >
              <MissingLogo
                symbol={positionData?.tokenB?.symbol}
                url={positionData?.tokenB?.logoURI}
                width={20}
                className="image-logo"
              />
              <AmountDisplayWrapper>
                {isConnected ? (
                  <>
                    {formatPoolPairAmount(tokenBBalance, {
                      decimals: 2,
                    })}{" "}
                    <span className={"token-symbol  wrap-text"}>
                      {positionData?.tokenB?.symbol}
                    </span>{" "}
                    <span className="token-percent">
                      {depositRatioStrOfTokenB}
                    </span>
                  </>
                ) : (
                  "-"
                )}
              </AmountDisplayWrapper>
            </Tooltip>
          </div>
        )}
      </section>
    );
  };

  const renderTotalEarning = () => {
    return (
      <section>
        <h4>
          {t("Pool:position.card.dailyEarn.title", {
            context: "total",
          })}
        </h4>
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
        {!loading && positions.length > 0 && isConnected && (
          <div className="total-daily">
            <div className="content-wrap">
              <span>{t("Pool:position.card.fee")}</span>
              {breakpoint === DEVICE_TYPE.WEB && (
                <OverlapTokenLogo tokens={logoDaily} size={20} />
              )}
              <span className="apr-value">{feeDaily}</span>
            </div>
            <div className="divider"></div>
            <div className="content-wrap content-reward">
              <span>{t("Pool:position.card.reward")}</span>
              {logoReward.length > 0 && breakpoint === DEVICE_TYPE.WEB && (
                <OverlapTokenLogo tokens={logoReward} size={20} />
              )}
              <span className="apr-value">{rewardDaily}</span>
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderTotalClaim = () => {
    const isMobile = breakpoint === DEVICE_TYPE.MOBILE;

    const title = (
      <h4>
        {t("Pool:position.card.claimableReward.title", {
          context: "total",
        })}
      </h4>
    );

    const loadingComp = (
      <>
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
      </>
    );

    const claimableUsdComp =
      isShowClaimableRewardInfo || isShowUnclaimableRewardInfo ? (
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
        !loading && (
          <span className="content-value disabled">{claimableUSD}</span>
        )
      );

    if (isMobile)
      return (
        <div className="mobile-wrap">
          <div className="column-wrap">
            {title}
            {!loading && <div className="claim-wrap">{claimableUsdComp}</div>}
            {loadingComp}
          </div>
          {canClaimAll && !isOtherPosition && (
            <Button
              className="button-claim"
              disabled={!canClaimAll}
              text={
                loadingTransactionClaim
                  ? ""
                  : t("Pool:position.card.btn.claimAll")
              }
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
      );

    return (
      <section>
        {title}
        <div className="claim-wrap">
          {claimableUsdComp}
          {loadingComp}
          {canClaimAll && !isOtherPosition && (
            <Button
              className="button-claim"
              disabled={!canClaimAll}
              text={
                loadingTransactionClaim
                  ? ""
                  : t("Pool:position.card.btn.claimAll")
              }
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
        {!loading && positions.length > 0 && isConnected && (
          <div className="total-daily">
            <div className="content-wrap">
              <span>{t("Pool:position.card.fee")}</span>
              {breakpoint === DEVICE_TYPE.WEB && (
                <OverlapTokenLogo tokens={logoDaily} size={20} />
              )}
              <span className="apr-value">{feeClaim}</span>
            </div>
            <div className="divider"></div>
            <div className="content-wrap content-reward">
              <span>{t("Pool:position.card.reward")}</span>
              {logoReward.length > 0 && breakpoint === DEVICE_TYPE.WEB && (
                <OverlapTokenLogo tokens={logoReward} size={20} />
              )}
              <span className="apr-value">{rewardClaim}</span>
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <MyLiquidityContentWrapper>
      {renderTotalBalance()}
      {renderTotalEarning()}
      {renderTotalClaim()}
    </MyLiquidityContentWrapper>
  );
};

export default MyLiquidityContent;
