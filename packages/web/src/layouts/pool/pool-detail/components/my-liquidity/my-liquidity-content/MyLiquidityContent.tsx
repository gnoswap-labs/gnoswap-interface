import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { WUGNOT_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { PulseSkeletonWrapper } from "@components/common/pulse-skeleton/PulseSkeletonWrapper.style";
import RewardTooltipContent, {
  PositionRewardForTooltip,
} from "@components/common/reward-tooltip-content/RewardTooltipContent";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RewardType, DisplayRewardType } from "@constants/option.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { DEVICE_TYPE } from "@styles/media";
import { isGNOTPath } from "@utils/common";
import { formatOtherPrice, formatPoolPairAmount } from "@utils/new-number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { mapToDisplayRewardType } from "@utils/reward-utils";
import { DEFAULT_TOKEN_PRICE_RATIO } from "@common/values";
import { sortDisplayRewards } from "@utils/pool-utils";

import {
  AmountDisplayWrapper,
  MyLiquidityContentWrapper,
  TokenAmountTooltipContentWrapper,
} from "./MyLiquidityContent.styles";

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

const sumRewardUsd = (rewards: PositionRewardForTooltip[]): number | null => {
  return rewards.reduce<number | null>((accum, current) => {
    if (accum === null || current.usd === null) {
      return null;
    }

    return accum + current.usd;
  }, 0);
};

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

  const canShowData = useMemo(
    () => (!isSwitchNetwork && connected) || isOtherPosition,
    [connected, isSwitchNetwork, isOtherPosition],
  );

  const isDisplayPrice = useMemo(() => {
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
    if (!canShowData || !isDisplayPrice) {
      return "-";
    }
    const balance = positions.reduce((current, next) => {
      return current + Number(next.usdValue);
    }, 0);

    return formatOtherPrice(balance, { isKMB: false });
  }, [canShowData, isDisplayPrice, positions]);

  const claimableRewardInfo = useMemo((): { [key in DisplayRewardType]: PositionRewardForTooltip[] } | null => {
    if (!canShowData) {
      return null;
    }
    const infoMap: {
      [key in DisplayRewardType]: { [key in string]: PositionRewardForTooltip };
    } = {
      SWAP_FEE: {},
      INTERNAL_REWARD: {},
      EXTERNAL_REWARD: {},
      NONE: {},
    };

    positions
      .flatMap(position => position.rewards)
      .map(reward => ({
        token: reward.rewardToken,
        rewardType: reward.rewardToken.rewardType as RewardType,
        balance: reward.totalAmount || 0,
        balanceUSD:
          makeDisplayTokenAmount(
            reward.rewardToken,
            Number(reward.totalAmount) * Number(tokenPrices[reward.rewardToken.priceID]?.usd),
          ) || 0,
        amount: reward.claimableAmount ? Number(reward.claimableAmount) : null,
        usd: reward.claimableUsd ? Number(reward.claimableUsd) : null,
        accumulatedRewardOf1d: null,
        claimableUsdValue: reward.claimableUsd ? Number(reward.claimableUsd) : null,
      }))
      .forEach(rewardInfo => {
        const mappedRewardType = mapToDisplayRewardType(rewardInfo.rewardType);

        const existReward = infoMap[mappedRewardType]?.[rewardInfo.token.priceID];
        const tokenPrice = tokenPrices[rewardInfo.token.priceID]?.usd
          ? Number(tokenPrices[rewardInfo.token.priceID]?.usd)
          : null;
        if (existReward) {
          const accumulatedRewardOf1d = (() => {
            if (existReward.accumulatedRewardOf1d === null && rewardInfo.accumulatedRewardOf1d === null) {
              return null;
            }

            if (existReward.accumulatedRewardOf1d === null) {
              return rewardInfo.accumulatedRewardOf1d;
            }

            if (rewardInfo.accumulatedRewardOf1d === null) {
              return existReward.accumulatedRewardOf1d;
            }

            return existReward.accumulatedRewardOf1d + rewardInfo.accumulatedRewardOf1d;
          })();
          const accumulatedRewardOf1dUsd =
            accumulatedRewardOf1d !== null && tokenPrice !== null ? accumulatedRewardOf1d * tokenPrice : null;

          infoMap[mappedRewardType][rewardInfo.token.priceID] = {
            ...existReward,
            usd: (() => {
              if (existReward.usd === null && rewardInfo.usd === null) {
                return null;
              }

              if (existReward.usd === null) {
                return rewardInfo.usd;
              }

              if (rewardInfo.usd === null) {
                return existReward.usd;
              }

              return existReward.usd + rewardInfo.usd;
            })(),
            amount: Number(existReward.amount || 0) + Number(rewardInfo.amount),
            accumulatedRewardOf1d: accumulatedRewardOf1d,
            accumulatedRewardOf1dUsd: accumulatedRewardOf1dUsd,
          };
        } else {
          infoMap[mappedRewardType][rewardInfo.token.priceID] = {
            ...rewardInfo,
            accumulatedRewardOf1dUsd:
              rewardInfo.accumulatedRewardOf1d !== null && tokenPrice !== null
                ? tokenPrice * rewardInfo.accumulatedRewardOf1d
                : null,
          };
        }
      });

    const sortedInfoMap = sortDisplayRewards(infoMap, positionData);

    return {
      SWAP_FEE: Object.values(sortedInfoMap["SWAP_FEE"]),
      INTERNAL_REWARD: Object.values(sortedInfoMap["INTERNAL_REWARD"]),
      EXTERNAL_REWARD: Object.values(sortedInfoMap["EXTERNAL_REWARD"]),
      NONE: Object.values(sortedInfoMap["NONE"]),
    };
  }, [canShowData, positionData, positions, tokenPrices]);

  const claimedRewardInfo = useMemo((): { [key in DisplayRewardType]: PositionRewardForTooltip[] } | null => {
    if (!canShowData) {
      return null;
    }
    const infoMap: {
      [key in DisplayRewardType]: { [key in string]: PositionRewardForTooltip };
    } = {
      SWAP_FEE: {},
      INTERNAL_REWARD: {},
      EXTERNAL_REWARD: {},
      NONE: {},
    };

    positions
      .flatMap(position => position.claimedRewards)
      .map(reward => ({
        token: reward.rewardToken,
        rewardType: reward.rewardToken.rewardType as RewardType,
        amount: reward.claimedAmount ? Number(reward.claimedAmount) : null,
        usd:
          reward.claimedAmount && tokenPrices[reward.rewardToken.priceID]?.usd
            ? Number(reward.claimedAmount) * Number(tokenPrices[reward.rewardToken.priceID]?.usd)
            : null,
        accumulatedRewardOf1d: null,
        accumulatedRewardOf1dUsd: null,
      }))
      .forEach(rewardInfo => {
        const mappedRewardType = mapToDisplayRewardType(rewardInfo.rewardType);

        const existReward = infoMap[mappedRewardType]?.[rewardInfo.token.priceID];
        if (existReward) {
          infoMap[mappedRewardType][rewardInfo.token.priceID] = {
            ...existReward,
            amount:
              existReward.amount !== null && rewardInfo.amount !== null
                ? existReward.amount + rewardInfo.amount
                : existReward.amount ?? rewardInfo.amount,
            usd: existReward.usd !== null && rewardInfo.usd !== null ? existReward.usd + rewardInfo.usd : null,
          };
        } else {
          infoMap[mappedRewardType][rewardInfo.token.priceID] = rewardInfo;
        }
      });

    const sortedInfoMap = sortDisplayRewards(infoMap, positionData);

    return {
      SWAP_FEE: Object.values(sortedInfoMap["SWAP_FEE"]),
      INTERNAL_REWARD: Object.values(sortedInfoMap["INTERNAL_REWARD"]),
      EXTERNAL_REWARD: Object.values(sortedInfoMap["EXTERNAL_REWARD"]),
      NONE: Object.values(sortedInfoMap["NONE"]),
    };
  }, [canShowData, positionData, positions, tokenPrices]);

  const isShowClaimedRewardInfoTooltip = useMemo(() => {
    return (
      claimedRewardInfo !== null &&
      (claimedRewardInfo?.EXTERNAL_REWARD.length !== 0 ||
        claimedRewardInfo?.INTERNAL_REWARD.length !== 0 ||
        claimedRewardInfo?.SWAP_FEE.length !== 0)
    );
  }, [claimedRewardInfo]);

  const claimedRewardsUSD = useMemo(() => {
    if (!canShowData) {
      return "-";
    }

    const totalClaimedUsd = positions.reduce<number | null>((accum, current) => {
      if (accum === null) {
        return null;
      }

      if (current.totalClaimedUsd !== "") {
        return accum + Number(current.totalClaimedUsd);
      }

      if (current.claimedRewards.length === 0) {
        return accum;
      }

      const claimedRewardsUsd = current.claimedRewards.reduce<number | null>((rewardAccum, reward) => {
        if (rewardAccum === null) {
          return null;
        }

        const tokenPrice = tokenPrices[reward.rewardToken.priceID]?.usd
          ? Number(tokenPrices[reward.rewardToken.priceID]?.usd)
          : null;

        if (!reward.claimedAmount || tokenPrice === null) {
          return null;
        }

        return rewardAccum + Number(reward.claimedAmount) * tokenPrice;
      }, 0);

      return claimedRewardsUsd === null ? null : accum + claimedRewardsUsd;
    }, 0);

    return formatOtherPrice(totalClaimedUsd, { isKMB: false });
  }, [canShowData, positions, tokenPrices]);

  const unclaimedRewardInfo = useMemo((): PositionRewardForTooltip[] | null => {
    if (!canShowData) {
      return null;
    }
    const infoMap: { [key in string]: PositionRewardForTooltip } = {};
    positions
      .flatMap(position => position.rewards)
      .map(reward => ({
        token: reward.rewardToken,
        rewardType: reward.rewardToken.rewardType as RewardType,
        amount: reward.claimableAmount ? makeDisplayTokenAmount(reward.rewardToken, reward.claimableAmount) : null,
        usd: reward.claimableUsd ? Number(reward.claimableUsd) : null,
        accumulatedRewardOf1d: null,
      }))
      .forEach(rewardInfo => {
        if (rewardInfo.amount) {
          const existReward = infoMap[rewardInfo.token.priceID];
          const tokenPrice = tokenPrices[rewardInfo.token.priceID]?.usd
            ? Number(tokenPrices[rewardInfo.token.priceID]?.usd)
            : null;

          if (existReward) {
            const accumulatedRewardOf1d = (() => {
              if (existReward.accumulatedRewardOf1d === null && rewardInfo.accumulatedRewardOf1d === null) {
                return null;
              }

              if (existReward.accumulatedRewardOf1d === null) {
                return rewardInfo.accumulatedRewardOf1d;
              }

              if (rewardInfo.accumulatedRewardOf1d === null) {
                return existReward.accumulatedRewardOf1d;
              }

              return existReward.accumulatedRewardOf1d + rewardInfo.accumulatedRewardOf1d;
            })();
            const accumulatedRewardOf1dUsd =
              accumulatedRewardOf1d !== null && tokenPrice !== null ? accumulatedRewardOf1d * tokenPrice : null;

            infoMap[rewardInfo.token.priceID] = {
              ...existReward,
              amount: (() => {
                if (existReward.amount === null && rewardInfo.amount === null) {
                  return null;
                }

                if (existReward.amount === null) {
                  return rewardInfo.amount;
                }

                if (rewardInfo.amount === null) {
                  return existReward.amount;
                }

                return existReward.amount + rewardInfo.amount;
              })(),
              usd: (() => {
                if (existReward.usd === null && rewardInfo.usd === null) {
                  return null;
                }

                if (existReward.usd === null) {
                  return rewardInfo.usd;
                }

                if (rewardInfo.usd === null) {
                  return existReward.usd;
                }

                return existReward.usd + rewardInfo.usd;
              })(),
              accumulatedRewardOf1d: (() => {
                if (existReward.accumulatedRewardOf1d === null && rewardInfo.accumulatedRewardOf1d === null) {
                  return null;
                }

                if (existReward.accumulatedRewardOf1d === null) {
                  return rewardInfo.accumulatedRewardOf1d;
                }

                if (rewardInfo.accumulatedRewardOf1d === null) {
                  return existReward.accumulatedRewardOf1d;
                }

                return existReward.accumulatedRewardOf1d + rewardInfo.accumulatedRewardOf1d;
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
  }, [canShowData, positions, tokenPrices]);

  const isShowClaimableRewardInfo = useMemo(() => {
    return (
      claimableRewardInfo &&
      (claimableRewardInfo?.EXTERNAL_REWARD.length !== 0 ||
        claimableRewardInfo?.INTERNAL_REWARD.length !== 0 ||
        claimableRewardInfo?.SWAP_FEE.length !== 0)
    );
  }, [claimableRewardInfo]);

  const isShowUnclaimableRewardInfo = useMemo(() => {
    return unclaimedRewardInfo && unclaimedRewardInfo.length > 0;
  }, [unclaimedRewardInfo]);

  const usd = useMemo(() => {
    const isEmpty = positions
      .filter(item => !item.closed)
      .flatMap(item => item.rewards)
      .every(item => !item.claimableUsd);

    if (!canShowData || !isDisplayPrice || isEmpty) {
      return "-";
    }

    const claimableUsdValue = claimableRewardInfo
      ? Object.values(claimableRewardInfo)
          .flatMap(item => item)
          .reduce((accum: null | number, current) => {
            if ((accum === null || accum === undefined) && current.usd === null) {
              return null;
            }

            if (accum === null || accum === undefined) {
              return current.usd;
            }

            if (current.usd === null) {
              return accum;
            }

            return accum + current.usd;
          }, null as number | null)
      : null;

    return formatOtherPrice(claimableUsdValue, { isKMB: false });
  }, [claimableRewardInfo, canShowData, isDisplayPrice, positions]);

  const canClaimAll = useMemo(() => {
    if (!canShowData || unclaimedRewardInfo === null) {
      return false;
    }

    return unclaimedRewardInfo.some(item => item.amount);
  }, [canShowData, unclaimedRewardInfo]);

  const tokenABalance = useMemo(() => {
    if (!positionData) return 0;
    const sum = positions?.reduce((accumulator, currentValue) => accumulator + Number(currentValue.tokenABalance), 0);
    return sum || 0;
  }, [positionData, positions]);

  const tokenBBalance = useMemo(() => {
    if (!positionData) return 0;
    const sum = positions?.reduce((accumulator, currentValue) => accumulator + Number(currentValue.tokenBBalance), 0);
    return sum || 0;
  }, [positionData, positions]);

  const depositRatio = useMemo(() => {
    const sumOfBalances = tokenABalance + tokenBBalance;
    if (sumOfBalances === 0) {
      return 0.5;
    }

    const priceRatio = positionData?.price || DEFAULT_TOKEN_PRICE_RATIO;

    return tokenABalance / (tokenABalance + tokenBBalance / priceRatio);
  }, [tokenABalance, tokenBBalance, positionData?.price]);

  const depositRatioStrOfTokenA = useMemo(() => {
    const depositStr = `${Math.round(depositRatio * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const depositRatioStrOfTokenB = useMemo(() => {
    const depositStr = `${Math.round((1 - depositRatio) * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const feeClaimed = useMemo(() => {
    const swapFee = claimedRewardInfo?.SWAP_FEE;
    const sumUsd = swapFee && swapFee.length > 0 ? sumRewardUsd(swapFee) : undefined;

    if (!canShowData) return "-";

    return formatOtherPrice(sumUsd, { isKMB: false });
  }, [claimedRewardInfo?.SWAP_FEE, canShowData]);

  const feeClaim = useMemo(() => {
    const swapFeeReward = claimableRewardInfo?.SWAP_FEE;

    const sumUsd = swapFeeReward?.reduce((accum: number | null, current) => {
      if (accum === null || accum === undefined) {
        if (current.usd === null) return null;

        return current.usd;
      }

      if (current.usd === null) {
        return accum;
      }

      return accum + current.usd;
    }, null);

    if (!canShowData || !isDisplayPrice) return "-";

    return formatOtherPrice(sumUsd, { isKMB: false });
  }, [claimableRewardInfo?.SWAP_FEE, canShowData, isDisplayPrice]);

  const logoClaimedFee = useMemo(() => {
    const swapFee = claimedRewardInfo?.SWAP_FEE;
    return (
      swapFee
        ?.flatMap(item => item.token)
        .reduce<TokenModel[]>((acc: TokenModel[], current) => {
          const token = acc.find(item => item.path === current.path);
          if (!token) {
            acc.push({ ...current, ...getGnotPath(current) });
          }
          return acc;
        }, []) ?? []
    );
  }, [claimedRewardInfo?.SWAP_FEE, getGnotPath]);

  const logoDaily = useMemo(() => {
    const swapFee = claimableRewardInfo?.SWAP_FEE;
    return (
      swapFee
        ?.flatMap(item => item.token)
        .reduce<TokenModel[]>((acc: TokenModel[], current) => {
          const token = acc.find(item => item.path === current.path);
          if (!token) {
            acc.push({ ...current, ...getGnotPath(current) });
          }
          return acc;
        }, []) ?? []
    );
  }, [claimableRewardInfo?.SWAP_FEE, getGnotPath]);

  const logoClaimedReward = useMemo(() => {
    const internalRewardToken = claimedRewardInfo?.INTERNAL_REWARD.map(item => item.token) ?? [];
    const externalRewardToken = claimedRewardInfo?.EXTERNAL_REWARD.map(item => item.token) ?? [];
    const tokenList = [...internalRewardToken, ...externalRewardToken];
    const currentRewardTokens = tokenList.reduce<TokenModel[]>((acc: TokenModel[], current) => {
      const token = acc.find(item => item.path === current.path);
      if (!token) {
        acc.push(current);
      }
      return acc;
    }, []);

    return currentRewardTokens.map(token => ({
      ...token,
      ...getGnotPath(token),
    }));
  }, [claimedRewardInfo?.EXTERNAL_REWARD, claimedRewardInfo?.INTERNAL_REWARD, getGnotPath]);

  const logoReward = useMemo(() => {
    const internalRewardToken = claimableRewardInfo?.INTERNAL_REWARD.map(item => item.token) ?? [];
    const rewardTokens = positionData?.rewardTokens || [];
    const tokenList = [...internalRewardToken, ...rewardTokens];
    const currentRewardTokens = tokenList.reduce<TokenModel[]>((acc: TokenModel[], current) => {
      const token = acc.find(item => item.path === current.path);
      if (!token) {
        acc.push(current);
      }
      return acc;
    }, []);

    return currentRewardTokens.map(token => ({
      ...token,
      ...getGnotPath(token),
    }));
  }, [claimableRewardInfo?.INTERNAL_REWARD, getGnotPath, positionData?.rewardTokens]);

  const rewardClaimed = useMemo(() => {
    const rewards = [...(claimedRewardInfo?.INTERNAL_REWARD ?? []), ...(claimedRewardInfo?.EXTERNAL_REWARD ?? [])];

    const sumUSD = rewards.length > 0 ? sumRewardUsd(rewards) : undefined;

    if (!canShowData) return "-";

    return formatOtherPrice(sumUSD, { isKMB: false });
  }, [claimedRewardInfo?.EXTERNAL_REWARD, claimedRewardInfo?.INTERNAL_REWARD, canShowData]);

  const rewardClaim = useMemo(() => {
    const rewards = [...(claimableRewardInfo?.EXTERNAL_REWARD ?? []), ...(claimableRewardInfo?.INTERNAL_REWARD ?? [])];

    const sumUSD = rewards?.reduce((accum: number | null, current) => {
      if (accum === null && current.usd === null) return null;

      if (accum === null) {
        return current.usd;
      }

      if (current.usd === null) {
        return accum;
      }

      return accum + current.usd;
    }, null);

    const isEmpty = sumUSD === 0;

    if (!canShowData || !isDisplayPrice || isEmpty) return "-";

    return formatOtherPrice(sumUSD, { isKMB: false });
  }, [claimableRewardInfo?.EXTERNAL_REWARD, claimableRewardInfo?.INTERNAL_REWARD, canShowData, isDisplayPrice]);

  const renderTotalBalance = () => {
    return (
      <section>
        <h4>
          {t("Pool:position.card.balance.title", {
            context: "total",
          })}
        </h4>
        {!loading && <span className="content-value disabled">{totalBalance}</span>}
        {loading && (
          <PulseSkeletonWrapper height={39} mobileHeight={25}>
            <span
              css={pulseSkeletonStyle({
                h: 22,
                w: "200px",
                tabletWidth: 160,
                smallTableWidth: 140,
              })}
            />
          </PulseSkeletonWrapper>
        )}
        {!loading && positions.length > 0 && canShowData && (
          <div className="sub-content">
            <Tooltip
              placement="top"
              className="sub-content-detail"
              forcedClose={!canShowData}
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
                  <span>{positionData?.tokenA?.displaySymbol || ""}</span>{" "}
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
                {canShowData ? (
                  <>
                    {formatPoolPairAmount(tokenABalance, {
                      decimals: 2,
                    })}{" "}
                    <span className={"token-symbol wrap-text"}>{positionData?.tokenA?.displaySymbol || ""}</span>{" "}
                    <span className="token-percent">{depositRatioStrOfTokenA}</span>
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
              forcedClose={!canShowData}
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
                  <span>{positionData?.tokenB?.displaySymbol || ""}</span>{" "}
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
                {canShowData ? (
                  <>
                    {formatPoolPairAmount(tokenBBalance, {
                      decimals: 2,
                    })}{" "}
                    <span className={"token-symbol  wrap-text"}>{positionData?.tokenB?.displaySymbol || ""}</span>{" "}
                    <span className="token-percent">{depositRatioStrOfTokenB}</span>
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
          {t("Pool:position.card.claimedReward.title", {
            context: "total",
          })}
        </h4>
        {!loading && isShowClaimedRewardInfoTooltip ? (
          <Tooltip
            placement="top"
            FloatingContent={<RewardTooltipContent rewardInfo={claimedRewardInfo} sortByUsd={false} />}
          >
            <span className="content-value">{claimedRewardsUSD}</span>
          </Tooltip>
        ) : (
          !loading && <span className="content-value disabled">{claimedRewardsUSD}</span>
        )}
        {loading && (
          <PulseSkeletonWrapper height={39} mobileHeight={25}>
            <span
              css={pulseSkeletonStyle({
                h: 22,
                w: "200px",
                tabletWidth: 160,
                smallTableWidth: 140,
              })}
            />
          </PulseSkeletonWrapper>
        )}
        {!loading && positions.length > 0 && canShowData && (
          <div className="total-daily">
            <div className="content-wrap">
              <span>{t("Pool:position.card.fee")}</span>
              {breakpoint === DEVICE_TYPE.WEB && <OverlapTokenLogo tokens={logoClaimedFee} size={20} />}
              <span className="apr-value">{feeClaimed}</span>
            </div>
            <div className="divider"></div>
            <div className="content-wrap content-reward">
              <span>{t("Pool:position.card.reward")}</span>
              {logoClaimedReward.length > 0 && breakpoint === DEVICE_TYPE.WEB && (
                <OverlapTokenLogo tokens={logoClaimedReward} size={20} />
              )}
              <span className="apr-value">{rewardClaimed}</span>
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderTotalClaim = () => {
    const title = (
      <h4>
        {t("Pool:position.card.claimableReward.title", {
          context: "total",
        })}
      </h4>
    );

    const claimableUsdComp =
      isShowClaimableRewardInfo || isShowUnclaimableRewardInfo ? (
        <Tooltip
          placement="top"
          FloatingContent={<RewardTooltipContent rewardInfo={claimableRewardInfo} sortByUsd={false} />}
        >
          <span className="content-value">{usd}</span>
        </Tooltip>
      ) : (
        !loading && <span className="content-value disabled">{usd}</span>
      );

    return (
      <section>
        {title}
        <div className="claim-wrap">
          {loading ? (
            <PulseSkeletonWrapper height={39} mobileHeight={25}>
              <span
                css={pulseSkeletonStyle({
                  h: 22,
                  w: "200px",
                  tabletWidth: 160,
                  smallTableWidth: 140,
                })}
              />
            </PulseSkeletonWrapper>
          ) : (
            claimableUsdComp
          )}
          {canClaimAll && !isOtherPosition && (
            <Button
              className="button-claim"
              disabled={!canClaimAll}
              text={loadingTransactionClaim ? "" : t("Pool:position.card.btn.claimAll")}
              style={{
                hierarchy: ButtonHierarchy.Primary,
                height: 36,
                padding: "0px 16px",
                fontType: "p1",
              }}
              onClick={claimAll}
              leftIcon={loadingTransactionClaim ? <LoadingSpinner className="loading-button" /> : undefined}
            />
          )}
        </div>
        {!loading && positions.length > 0 && (canShowData || isOtherPosition) && (
          <div className="total-daily">
            <div className="content-wrap">
              <span>{t("Pool:position.card.fee")}</span>
              {breakpoint === DEVICE_TYPE.WEB && <OverlapTokenLogo tokens={logoDaily} size={20} />}
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
