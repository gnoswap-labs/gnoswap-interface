import { useAtomValue } from "jotai";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { sanitizeHtml } from "@utils/sanitize-html";
import { cx } from "@emotion/css";

import { WUGNOT_TOKEN } from "@common/values/token-constant";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconAdd from "@components/common/icons/IconAdd";
import IconInfo from "@components/common/icons/IconInfo";
import IconLinkPage from "@components/common/icons/IconLinkPage";
import IconPolygon from "@components/common/icons/IconPolygon";
import IconRemove from "@components/common/icons/IconRemove";
import IconStaking from "@components/common/icons/IconStaking";
import IconSwap from "@components/common/icons/IconSwap";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { PulseSkeletonWrapper } from "@components/common/pulse-skeleton/PulseSkeletonWrapper.style";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import {
  LIQUIDITY_GRAPH_BIN_COUNT,
  LIQUIDITY_GRAPH_INITIAL_ZOOM_LEVEL,
  LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES,
} from "@constants/graph.constant";
import RewardTooltipContent, {
  PositionRewardForTooltip,
} from "@components/common/reward-tooltip-content/RewardTooltipContent";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION, RewardType, DisplayRewardType } from "@constants/option.constant";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useCopy } from "@hooks/common/use-copy";
import useRouter from "@hooks/common/use-custom-router";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolLiquiditySegmentsByPath } from "@hooks/pool/data/use-pool-liquidity-segments-by-path";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { ThemeState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import { isGNOTPath } from "@utils/common";
import { formatOtherPrice } from "@utils/new-number-utils";
import { makeRouteUrl } from "@utils/page.utils";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import { isEndTickBy, tickToPrice, tickToPriceStr } from "@utils/swap-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { isClaimableReward, mapToDisplayRewardType } from "@utils/reward-utils";
import { makeDisplayPrice, sortTokensByPoolOrder } from "@utils/pool-utils";

import { DailyEarningTooltipContent, PositionAPRInfo } from "../stat-tooltip-contents/DailyEarningTooltipContent";
import { BalanceTooltipContent, PositionBalanceInfo } from "./BalanceTooltipContent";
import ManageButton from "./manage-button/ManageButton";
import PositionHistory from "./PositionHistory";
import { DEFAULT_TOKEN_PRICE_RATIO } from "@common/values";

import {
  CopyTooltip,
  LoadingChart,
  MyPositionCardWrapper,
  PositionCardAnchor,
  ToolTipContentWrapper,
} from "./MyDetailedPositionCard.styles";

const emptyRewardInfo: { [key in DisplayRewardType]: PositionAPRInfo[] } = {
  SWAP_FEE: [],
  EXTERNAL_REWARD: [],
  INTERNAL_REWARD: [],
  NONE: [],
};

interface MyDetailedPositionCardProps {
  position: PoolPositionModel;
  isStakable: boolean;
  breakpoint: DEVICE_TYPE;
  loading: boolean;
  address: string;
  isHiddenAddPosition: boolean;
  connected: boolean;
  tokenPrices: Record<string, TokenPriceModel>;
  isOwnerAddress: boolean;

  claim: (position: PoolPositionModel) => void;
}

const MyDetailedPositionCard: React.FC<MyDetailedPositionCardProps> = ({
  position,
  isStakable,
  breakpoint,
  loading,
  address,
  isHiddenAddPosition,
  connected,
  tokenPrices,
  isOwnerAddress,
  claim,
}) => {
  const router = useRouter();
  const { width } = useWindowSize();
  const [isSwap, setIsSwap] = useState(false);
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { t } = useTranslation();

  const GRAPH_WIDTH = useMemo(() => Math.min(width - (width > 767 ? 224 : 80), 1216), [width]);
  const [copied, setCopy] = useCopy();
  const [copiedPosition, setCopiedPosition] = useCopy();
  const [zoomLevel, setZoomLevel] = useState<number>(LIQUIDITY_GRAPH_INITIAL_ZOOM_LEVEL);
  const visibleTickRange = useMemo(() => LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[zoomLevel], [zoomLevel]);
  const isClosed = position.closed;

  const isDisplay = useMemo(() => {
    const tokenAPrice = isGNOTPath(position.pool?.tokenA.path)
      ? tokenPrices[WUGNOT_TOKEN.priceID]?.usd
      : tokenPrices[position.pool?.tokenA.priceID]?.usd;

    const tokenBPrice = isGNOTPath(position.pool?.tokenB.path)
      ? tokenPrices[WUGNOT_TOKEN.priceID]?.usd
      : tokenPrices[position.pool?.tokenB.priceID]?.usd;

    return !isClosed && !!tokenAPrice && !!tokenBPrice;
  }, [
    isClosed,
    position.pool?.tokenA.path,
    position.pool?.tokenA.priceID,
    position.pool?.tokenB.path,
    position.pool?.tokenB.priceID,
    tokenPrices,
  ]);

  const tokenA = useMemo(() => {
    return position.pool.tokenA;
  }, [position.pool.tokenA]);

  const tokenB = useMemo(() => {
    return position.pool.tokenB;
  }, [position.pool.tokenB]);

  const currentTick = useMemo(() => {
    return position.pool.currentTick ?? null;
  }, [position.pool.currentTick]);

  const { liquiditySegments, isLoading: isLoadingLiquiditySegments } = usePoolLiquiditySegmentsByPath(
    position.poolPath,
    {
      currentTick: currentTick ?? undefined,
      currentPrice: position.pool.price,
      tokenA,
      tokenB,
      includeTokenAmounts: true,
      visibleTickRange,
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    },
    {
      enabled: !loading && !!position.poolPath,
    },
  );

  const inRange = useMemo(() => {
    const { tickLower, tickUpper, pool } = position;
    const currentTick = pool.currentTick;
    if (currentTick < tickLower || currentTick > tickUpper) {
      return false;
    }
    return true;
  }, [position]);

  const getTokenPrice = useCallback(
    (priceId: string) => {
      return tokenPrices?.[priceId]?.usd;
    },
    [tokenPrices],
  );

  const tokenABalanceUSD = useMemo(() => {
    const tokenAUSD = Number(getTokenPrice(tokenA.priceID) || "1");
    const tokenABalance = makeDisplayTokenAmount(tokenA, position.tokenABalance) || 0;
    return tokenAUSD * tokenABalance;
  }, [getTokenPrice, position.tokenABalance, tokenA]);

  const tokenBBalanceUSD = useMemo(() => {
    const tokenBUSD = Number(getTokenPrice(tokenB.priceID) || "1");
    const tokenBBalance = makeDisplayTokenAmount(tokenB, position.tokenBBalance) || 0;
    return tokenBUSD * tokenBBalance;
  }, [getTokenPrice, position.tokenBBalance, tokenB]);

  const positionBalanceUSD = useMemo(() => {
    if (!isDisplay || !position.positionUsdValue) {
      return "-";
    }
    return formatOtherPrice(position.positionUsdValue, { isKMB: false });
  }, [isDisplay, position.positionUsdValue]);

  const getTokenBalance = useCallback((balance: string) => {
    if (!balance) return 0;
    return Number(balance);
  }, []);

  const tokenABalance = useMemo(() => {
    return getTokenBalance(position.tokenABalance);
  }, [position.tokenABalance]);

  const tokenBBalance = useMemo(() => {
    return getTokenBalance(position.tokenBBalance);
  }, [position.tokenBBalance]);

  const depositRatio = useMemo(() => {
    const sumOfBalances = tokenABalance + tokenBBalance;
    if (sumOfBalances === 0) {
      return 0.5;
    }

    const priceRatio = position?.pool?.price || DEFAULT_TOKEN_PRICE_RATIO;

    return tokenABalance / (tokenABalance + tokenBBalance / priceRatio);
  }, [tokenABalance, tokenBBalance, position?.pool?.price]);

  const depositRatioStrOfTokenA = useMemo(() => {
    const depositStr = `${Math.round(depositRatio * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const depositRatioStrOfTokenB = useMemo(() => {
    const depositStr = `${Math.round((1 - depositRatio) * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const balances = useMemo((): PositionBalanceInfo[] => {
    return [
      {
        token: tokenA,
        balance: Number(position.tokenABalance),
        balanceUSD: tokenABalanceUSD,
        percent: depositRatioStrOfTokenA,
      },
      {
        token: tokenB,
        balance: Number(position.tokenBBalance),
        balanceUSD: tokenBBalanceUSD,
        percent: depositRatioStrOfTokenB,
      },
    ];
  }, [
    position.tokenABalance,
    position.tokenBBalance,
    tokenA,
    tokenABalanceUSD,
    tokenB,
    tokenBBalanceUSD,
    position.pool,
  ]);

  const totalRewardInfo = useMemo((): { [key in DisplayRewardType]: PositionRewardForTooltip[] } | null => {
    const rewards = position.rewards;
    if (rewards.length === 0) {
      return null;
    }

    const totalRewardInfo = rewards.reduce<{
      [key in DisplayRewardType]: PositionRewardForTooltip[];
    }>(
      (accum, current) => {
        const rewardType = current.rewardToken.rewardType as RewardType;
        const displayRewardType = mapToDisplayRewardType(rewardType);

        if (!accum[displayRewardType]) {
          accum[displayRewardType] = [];
        }

        const index = accum[displayRewardType].findIndex(item => item.token.priceID === current.rewardToken.priceID);

        const tokenPrice = tokenPrices[current.rewardToken.priceID].usd
          ? Number(tokenPrices[current.rewardToken.priceID].usd)
          : null;

        if (index !== -1) {
          const existReward = accum[displayRewardType][index];
          const accuReward1D = (() => {
            if (existReward.accumulatedRewardOf1d === null && !current.accuReward1D) {
              return null;
            }

            if (existReward.accumulatedRewardOf1d === null) {
              return Number(current.accuReward1D);
            }

            if (!current.accuReward1D) {
              return existReward.accumulatedRewardOf1d;
            }

            return existReward.accumulatedRewardOf1d + Number(current.accuReward1D);
          })();
          const accuReward1DUsd = accuReward1D !== null && tokenPrice !== null ? accuReward1D * tokenPrice : null;
          const usd = (() => {
            if (accum[displayRewardType][index].usd === null && !current.claimableUsd) {
              return null;
            }

            if (accum[displayRewardType][index].usd === null) {
              return Number(current.claimableUsd);
            }

            if (!current.claimableUsd) {
              return accum[displayRewardType][index].usd;
            }

            return (accum[displayRewardType][index].usd || 0) + Number(current.claimableUsd);
          })();

          accum[displayRewardType][index] = {
            ...existReward,
            amount: (accum[displayRewardType][index].amount || 0) + Number(current.claimableAmount),
            usd: usd,
            accumulatedRewardOf1dUsd: accuReward1DUsd,
            accumulatedRewardOf1d: accuReward1D,
          };
        } else {
          accum[displayRewardType].push({
            rewardType: displayRewardType,
            token: current.rewardToken,
            amount: Number(current.claimableAmount) || 0,
            usd: current.claimableUsd ? Number(current.claimableUsd) : null,
            accumulatedRewardOf1d: current.accuReward1D ? Number(current.accuReward1D) : 0,
            accumulatedRewardOf1dUsd:
              Number(current.accuReward1D ?? 0) * Number(getTokenPrice(current.rewardToken.priceID) ?? 0),
          });
        }
        return accum;
      },
      {
        SWAP_FEE: [],
        EXTERNAL_REWARD: [],
        INTERNAL_REWARD: [],
        NONE: [],
      },
    );

    Object.keys(totalRewardInfo).forEach(key => {
      const rewardType = key as DisplayRewardType;
      if (totalRewardInfo[rewardType].length > 0) {
        totalRewardInfo[rewardType] = sortTokensByPoolOrder(totalRewardInfo[rewardType], tokenA.path, tokenB.path);
      }
    });

    return totalRewardInfo;
  }, [getTokenPrice, isDisplay, position.rewards, tokenPrices, tokenA.path, tokenB.path]);

  const totalRewardUSD = useMemo(() => {
    if (!isDisplay) {
      return "-";
    }

    const usdValue = position.rewards.reduce<number | null>((acc, current) => {
      if (acc === null && current === null) {
        return null;
      }

      if (acc === null) {
        return Number(current.claimableUsd);
      }

      if (!current.claimableUsd) {
        return acc;
      }

      return acc + Number(current.claimableUsd);
    }, null);

    return formatOtherPrice(usdValue, { isKMB: false });
  }, [isDisplay, position.rewards]);

  const positionWithClaimableRewards = useMemo(() => {
    return {
      ...position,
      rewards: position.rewards.filter(isClaimableReward),
    };
  }, [position]);

  const isClaimable = useMemo(() => {
    return isOwnerAddress && positionWithClaimableRewards.rewards.length > 0;
  }, [isOwnerAddress, positionWithClaimableRewards.rewards]);

  const totalDailyEarning = useMemo(() => {
    const isEmpty = !totalRewardInfo || position.rewards.length === 0;

    if (!isDisplay || isEmpty) {
      return "-";
    }

    const totalDailyEarningValue = Object.values(totalRewardInfo)
      .flatMap(item => item)
      .reduce((acc: number | null, current) => {
        if ((acc === null || acc === undefined) && current === null) {
          return null;
        }

        if (acc === null || acc === undefined) {
          return current.accumulatedRewardOf1dUsd;
        }

        if (current.accumulatedRewardOf1dUsd == null) {
          return acc;
        }

        return acc + current.accumulatedRewardOf1dUsd;
      }, null);

    return formatOtherPrice(totalDailyEarningValue, { isKMB: false });
  }, [isDisplay, position.rewards.length, totalRewardInfo]);

  const aprRewardInfo = useMemo((): { [key in DisplayRewardType]: PositionAPRInfo[] } => {
    if (position.rewards.length === 0) {
      return emptyRewardInfo;
    }

    const aprRewardInfo = position.rewards.reduce<{
      [key in DisplayRewardType]: PositionAPRInfo[];
    }>(
      (accum, current) => {
        const rewardType = current.rewardToken.rewardType as RewardType;
        const displayRewardType = mapToDisplayRewardType(rewardType);

        const currentTypeRewards = accum[displayRewardType];
        const tokenPrice = tokenPrices[current.rewardToken.priceID].usd
          ? Number(tokenPrices[current.rewardToken.priceID].usd)
          : null;

        if (!currentTypeRewards) {
          accum[displayRewardType] = [];
        }

        const index = accum[displayRewardType].findIndex(item => item.token.priceID === current.rewardToken.priceID);

        if (index != -1) {
          const existReward = accum[displayRewardType][index];
          const accuReward1D = (() => {
            if (existReward.accuReward1D === null && !current.accuReward1D) {
              return null;
            }

            if (existReward.accuReward1D === null) {
              return Number(current.accuReward1D);
            }

            if (!current.accuReward1D) {
              return existReward.accuReward1D;
            }

            return existReward.accuReward1D + Number(current.accuReward1D);
          })();
          const apr = (() => {
            if (existReward.apr === null && current.apr === null) {
              return null;
            }

            if (existReward.apr === null) {
              return current.apr;
            }

            if (current.apr === null) {
              return existReward.apr;
            }

            return existReward.apr + current.apr;
          })();
          const accuReward1DUsd = accuReward1D !== null && tokenPrice !== null ? accuReward1D * tokenPrice : null;

          accum[displayRewardType][index] = {
            ...existReward,
            accuReward1D,
            accuReward1DPrice: accuReward1DUsd,
            apr: apr,
          };
        } else {
          accum[displayRewardType].push({
            token: current.rewardToken,
            rewardType: rewardType,
            accuReward1D: current.accuReward1D ? Number(current.accuReward1D) : null,
            accuReward1DPrice:
              current.accuReward1D && tokenPrice !== null ? Number(current.accuReward1D) * tokenPrice : null,
            apr: current.apr ? Number(current.apr) : null,
          });
        }
        return accum;
      },
      {
        SWAP_FEE: [],
        EXTERNAL_REWARD: [],
        INTERNAL_REWARD: [],
        NONE: [],
      },
    );

    Object.keys(aprRewardInfo).forEach(key => {
      const rewardType = key as DisplayRewardType;
      if (aprRewardInfo[rewardType].length > 0) {
        aprRewardInfo[rewardType] = sortTokensByPoolOrder(aprRewardInfo[rewardType], tokenA.path, tokenB.path);
      }
    });

    return aprRewardInfo;
  }, [position.rewards, tokenPrices, tokenA.path, tokenB.path]);

  const stringPrice = useMemo(() => {
    const price = tickToPrice(position?.pool?.currentTick);

    if (isSwap) {
      const displayPrice = makeDisplayPrice(1 / price, tokenB, tokenA);
      return (
        <>
          1 {tokenB?.displaySymbol || ""} ={" "}
          {formatTokenExchangeRate(displayPrice, {
            maxSignificantDigits: 6,
            minLimit: 0.000001,
          })}{" "}
          {tokenA?.displaySymbol || ""}
        </>
      );
    }
    const displayPrice = makeDisplayPrice(price, tokenA, tokenB);
    return (
      <>
        1 {tokenA?.displaySymbol || ""} ={" "}
        {formatTokenExchangeRate(displayPrice, {
          maxSignificantDigits: 6,
          minLimit: 0.000001,
        })}{" "}
        {tokenB?.displaySymbol || ""}
      </>
    );
  }, [isSwap, tokenA, tokenB, position?.pool?.currentTick]);

  const isFullRange = useMemo(() => {
    const isMinEndTick = isEndTickBy(position.tickLower, position.pool.fee);
    const isMaxEndTick = isEndTickBy(position.tickUpper, position.pool.fee);

    const minPrice = tickToPriceStr(position.tickLower, { isEnd: isMinEndTick });
    const maxPrice = tickToPriceStr(position.tickUpper, { isEnd: isMaxEndTick });

    return minPrice === "0" && maxPrice === "∞";
  }, [position.tickLower, position.tickUpper, position.pool.fee]);

  const minPriceStr = useMemo(() => {
    if (isFullRange) return "0 ";

    if (!isSwap) {
      const isEndTick = isEndTickBy(position.tickLower, position.pool.fee);
      const minPrice = tickToPriceStr(position.tickLower, { isEnd: isEndTick });
      if (minPrice === "∞") return "∞";

      const displayMinPrice = makeDisplayPrice(tickToPrice(position.tickLower), tokenA, tokenB);
      return formatTokenExchangeRate(displayMinPrice, {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      });
    }

    const isEndTick = isEndTickBy(position.tickUpper, position.pool.fee);
    if (isEndTick) return "0";

    const displayMinPrice = makeDisplayPrice(1 / tickToPrice(position.tickUpper), tokenB, tokenA);
    return formatTokenExchangeRate(displayMinPrice, {
      maxSignificantDigits: 6,
      minLimit: 0.000001,
    });
  }, [position.tickLower, position.pool.fee, position.tickUpper, isFullRange, isSwap, tokenA, tokenB]);

  const currentPrice = useMemo(() => {
    return !isSwap ? tickToPrice(position?.pool.currentTick) : 1 / tickToPrice(position?.pool.currentTick);
  }, [position?.pool.currentTick, isSwap]);

  const minTickRate = useMemo(() => {
    const minPrice = !isSwap ? tickToPrice(position.tickLower) : 1 / tickToPrice(position.tickLower);
    return ((currentPrice - minPrice) / currentPrice) * 100;
  }, [currentPrice, position.tickLower, isSwap]);

  const maxTickRate = useMemo(() => {
    const maxPrice = !isSwap ? tickToPrice(position.tickUpper) : 1 / tickToPrice(position.tickUpper);
    return ((maxPrice - currentPrice) / currentPrice) * 100;
  }, [currentPrice, position.tickUpper, isSwap]);

  const maxPriceStr = useMemo(() => {
    if (isFullRange) {
      return "∞";
    }

    if (!isSwap) {
      const isEndTick = isEndTickBy(position.tickUpper, position.pool.fee);
      const maxPrice = tickToPriceStr(position.tickUpper, { isEnd: isEndTick });
      if (maxPrice === "∞") {
        return "∞";
      }

      const displayMaxPrice = makeDisplayPrice(tickToPrice(position.tickUpper), tokenA, tokenB);
      return formatTokenExchangeRate(displayMaxPrice, {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      });
    }

    const isEndTick = isEndTickBy(position.tickLower, position.pool.fee);
    if (isEndTick) return "∞";

    const displayMaxPrice = makeDisplayPrice(1 / tickToPrice(position.tickLower), tokenB, tokenA);
    return formatTokenExchangeRate(displayMaxPrice, {
      maxSignificantDigits: 6,
      minLimit: 0.000001,
    });
  }, [position.tickLower, position.tickUpper, isFullRange, isSwap, position.pool.fee, tokenA, tokenB]);

  const minTickLabel = useMemo(() => {
    if (Math.abs(minTickRate) >= 1000) return ">999%";

    if (Math.abs(minTickRate) > 0 && Math.abs(minTickRate) < 1) {
      return "<1%";
    }

    return (minTickRate < -1 ? "+" : "") + Math.round(minTickRate * -1) + "%";
  }, [minTickRate]);

  const maxTickLabel = useMemo(() => {
    if (maxTickRate === 999) return `>${maxTickRate}%`;

    if (maxTickRate >= 1000) return ">999%";

    return `${maxTickRate > 1 ? "+" : ""}${Math.abs(maxTickRate) < 1 ? "<1" : Math.round(maxTickRate)}%`;
  }, [maxTickRate]);

  const startClass = useMemo(() => {
    return (!isSwap ? minTickRate : -maxTickRate) > 0 ? "negative" : "positive";
  }, [minTickRate, isSwap, maxTickRate]);

  const endClass = useMemo(() => {
    return (!isSwap ? maxTickRate : -minTickRate) > 0 ? "positive" : "negative";
  }, [maxTickRate, isSwap, minTickRate]);

  const isHideBar = useMemo(() => {
    return liquiditySegments.length === 0 && !position.liquidity;
  }, [liquiditySegments.length, position.liquidity]);

  const availInfo = useMemo(
    () => ({
      availZoomIn: zoomLevel < LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES.length - 1,
      availZoomOut: zoomLevel > 0,
    }),
    [zoomLevel],
  );

  const handleZoomIn = useCallback(() => {
    if (availInfo.availZoomIn && zoomLevel + 1 < LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES.length) {
      setZoomLevel(zoomLevel + 1);
    }
  }, [zoomLevel, availInfo.availZoomIn]);

  const handleZoomOut = useCallback(() => {
    if (availInfo.availZoomOut && zoomLevel > 0) {
      setZoomLevel(zoomLevel - 1);
    }
  }, [zoomLevel, availInfo.availZoomOut]);

  const isShowRewardInfoTooltip = useMemo(() => {
    return (
      aprRewardInfo !== null &&
      (aprRewardInfo?.EXTERNAL_REWARD.length !== 0 ||
        aprRewardInfo?.INTERNAL_REWARD.length !== 0 ||
        aprRewardInfo?.SWAP_FEE.length !== 0)
    );
  }, [aprRewardInfo]);

  const isShowTotalRewardInfo = useMemo(() => {
    return (
      totalRewardInfo &&
      (totalRewardInfo?.EXTERNAL_REWARD.length !== 0 ||
        totalRewardInfo?.INTERNAL_REWARD.length !== 0 ||
        totalRewardInfo?.SWAP_FEE.length !== 0)
    );
  }, [totalRewardInfo]);

  const getPoolLink = useCallback(
    (isDirect: boolean) => {
      const hash = isDirect ? position.id : undefined;
      return (
        window.location.host +
        makeRouteUrl(
          PAGE_PATH.POOL,
          {
            [QUERY_PARAMETER.POOL_PATH]: position.poolPath,
            [QUERY_PARAMETER.ADDRESS]: address,
          },
          hash,
        )
      );
    },
    [position, address],
  );

  const cardHeader = (
    <div className="box-title">
      <div className="box-header">
        <div className="box-left">
          {breakpoint !== DEVICE_TYPE.MOBILE ? (
            <>
              {loading && (
                <PulseSkeletonWrapper height={36} mobileHeight={24}>
                  <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
                </PulseSkeletonWrapper>
              )}
              {!loading && (
                <div className="coin-info">
                  <MissingLogo url={position.tokenUri} symbol={`ID #${position.id}`} width={36} mobileWidth={24} />
                </div>
              )}
              {!loading && (
                <div className="link-page">
                  <span className="product-id">ID #{position.id}</span>
                  <div
                    onClick={() => {
                      if (isClosed) {
                        setCopy(getPoolLink(false));
                        return;
                      }

                      setCopy(getPoolLink(true));
                    }}
                  >
                    <IconLinkPage className="icon-link" />
                    {copied && (
                      <CopyTooltip>
                        <div className={`box ${themeKey}-shadow`}>
                          <span>{t("common:urlCopied")}</span>
                        </div>
                        <IconPolygon className="polygon-icon" />
                      </CopyTooltip>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mobile-container">
              {loading && (
                <PulseSkeletonWrapper height={36} mobileHeight={24}>
                  <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
                </PulseSkeletonWrapper>
              )}
              {!loading && (
                <div className="coin-info">
                  <MissingLogo url={position.tokenUri} symbol={`ID #${position.id}`} width={36} mobileWidth={24} />
                </div>
              )}
              {!loading && (
                <div className="link-page">
                  <span className="product-id">ID #{position.id}</span>
                  <div
                    onClick={() => {
                      if (isClosed) {
                        setCopy(getPoolLink(false));
                        return;
                      }
                      setCopy(getPoolLink(true));
                    }}
                  >
                    <IconLinkPage className="icon-link" />
                    {copied && (
                      <CopyTooltip>
                        <div className={`box ${themeKey}-shadow`}>
                          <span>{t("common:urlCopied")}</span>
                        </div>
                        <IconPolygon className="polygon-icon" />
                      </CopyTooltip>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <Badge
            type={BADGE_TYPE.PRIMARY}
            leftIcon={<IconStaking />}
            text={t("business:staked")}
            className={!position.staked ? "visible-badge" : ""}
          />
        </div>
        <div className="flex-button">
          {!isClosed && (
            <Button
              text={copiedPosition ? t("common:copied") + "!" : t("Pool:position.card.btn.copyPosition")}
              className="copy-button"
              style={{
                textColor: "text14",
              }}
              onClick={() => {
                const queryParamsArr = [
                  `poolPath=${position.poolPath}`,
                  `tickLower=${position.tickLower}`,
                  `tickUpper=${position.tickUpper}`,
                  "price_range_type=Custom",
                ];

                if (router.asPath.includes("?")) {
                  const urlWithoutQuery = router.asPath.split("?")[0];

                  setCopiedPosition(window.location.host + urlWithoutQuery + `/add?${queryParamsArr.join("&")}`);
                  return;
                }

                if (router.asPath.includes("#")) {
                  const urlWithoutHash = router.asPath.split("#")[0];

                  setCopiedPosition(window.location.host + urlWithoutHash + `/add?${queryParamsArr.join("&")}`);
                  return;
                }

                setCopiedPosition(window.location.host + router.asPath + `/add?${queryParamsArr.join("&")}`);
              }}
            />
          )}

          {!isHiddenAddPosition && connected && (
            <ManageButton
              position={position}
              inRange={inRange}
              isClosed={isClosed}
              isStaked={position.staked}
              isStakable={isStakable}
            />
          )}
        </div>
      </div>
    </div>
  );

  const cardStat = (
    <div className="info-wrap">
      <div className="info-box">
        <span className="symbol-text">{t("business:balance")}</span>
        {loading && (
          <PulseSkeletonWrapper height={39} mobileHeight={25}>
            <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
          </PulseSkeletonWrapper>
        )}
        {!isClosed && !loading ? (
          <Tooltip
            placement="top"
            FloatingContent={
              <div>
                <BalanceTooltipContent balances={balances} />
              </div>
            }
          >
            <span className="content-text">{positionBalanceUSD}</span>
          </Tooltip>
        ) : (
          !loading && <span className="content-text disabled">{positionBalanceUSD}</span>
        )}
      </div>
      <div className="info-box">
        <span className="symbol-text">{t("Pool:position.card.dailyEarn.title")}</span>
        {!isClosed && isShowRewardInfoTooltip && !loading ? (
          <Tooltip
            placement="top"
            FloatingContent={
              <div>
                <DailyEarningTooltipContent rewardInfo={aprRewardInfo} />
              </div>
            }
          >
            <span className="content-text">{totalDailyEarning}</span>
          </Tooltip>
        ) : (
          !loading && <span className="content-text disabled">{totalDailyEarning}</span>
        )}
        {loading && (
          <PulseSkeletonWrapper height={39} mobileHeight={25}>
            <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
          </PulseSkeletonWrapper>
        )}
      </div>
      <div className="info-box">
        <span className="symbol-text">{t("Pool:position.card.claimableReward.title")}</span>
        {!isClosed && !loading && isShowTotalRewardInfo ? (
          <div className="info-box-flex">
            <Tooltip
              placement="top"
              forcedClose={!isClaimable}
              FloatingContent={
                <div>{totalRewardInfo && <RewardTooltipContent rewardInfo={totalRewardInfo} sortByUsd={false} />}</div>
              }
            >
              <span className={cx("content-text", { claimable: isClaimable })}>{totalRewardUSD}</span>
            </Tooltip>
            {isClaimable && <ClaimButton text={"Claim"} onClick={() => claim(positionWithClaimableRewards)} />}
          </div>
        ) : (
          !loading && <span className="content-text disabled">{totalRewardUSD}</span>
        )}
        {loading && (
          <PulseSkeletonWrapper height={39} mobileHeight={25}>
            <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
          </PulseSkeletonWrapper>
        )}
      </div>
    </div>
  );

  const cardGraph = (
    <div className="position-wrapper-chart">
      <div className="position-header">
        <div>{t("business:currentPrice")}</div>
        <div className="swap-price">
          {!loading && (
            <MissingLogo
              symbol={!isSwap ? tokenA?.symbol : tokenB?.symbol}
              url={!isSwap ? tokenA?.logoURI : tokenB?.logoURI}
              width={20}
              className="image-logo"
            />
          )}
          {!loading && stringPrice}
          {!loading && (
            <div className="icon-wrapper" onClick={() => setIsSwap(!isSwap)}>
              <IconSwap />
            </div>
          )}
          {loading && (
            <PulseSkeletonWrapper height={18} mobileHeight={18}>
              <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
            </PulseSkeletonWrapper>
          )}
          {loading && (
            <PulseSkeletonWrapper height={18} mobileHeight={18}>
              <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
            </PulseSkeletonWrapper>
          )}
        </div>
        {!loading && (
          <div className="range-badge">
            <RangeBadge
              status={isClosed ? RANGE_STATUS_OPTION.NONE : inRange ? RANGE_STATUS_OPTION.IN : RANGE_STATUS_OPTION.OUT}
            />
          </div>
        )}
        {!loading && !isLoadingLiquiditySegments && (
          <div className="zoom-controller">
            <button
              type="button"
              aria-label="Zoom out"
              disabled={!availInfo.availZoomOut}
              className={cx({ disabled: !availInfo.availZoomOut })}
              onClick={handleZoomOut}
            >
              <IconRemove />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              disabled={!availInfo.availZoomIn}
              className={cx({ disabled: !availInfo.availZoomIn })}
              onClick={handleZoomIn}
            >
              <IconAdd />
            </button>
          </div>
        )}
      </div>
      {!loading && !isLoadingLiquiditySegments && (
        <PoolGraph
          tokenA={tokenA}
          tokenB={tokenB}
          liquiditySegments={liquiditySegments}
          currentTick={currentTick}
          currentPrice={position.pool.price}
          width={GRAPH_WIDTH}
          height={150}
          mouseover
          themeKey={themeKey}
          position="top"
          offset={40}
          isPosition
          positionLiquidity={position.liquidity.toString()}
          positionTickLower={position.tickLower}
          positionTickUpper={position.tickUpper}
          isReversed={isSwap}
          disabled={isHideBar}
          disableBlackBars={false}
        />
      )}
      {(loading || isLoadingLiquiditySegments) && (
        <LoadingChart>
          <LoadingSpinner />
        </LoadingChart>
      )}
      {!loading && (
        <div className="convert-price">
          <div>
            1&nbsp;
            {(!isSwap ? tokenA : tokenB)?.symbol} =&nbsp;
            {minPriceStr}&nbsp;
            {(!isSwap ? tokenB : tokenA)?.symbol}&nbsp;(
            <span className={startClass}>{!isSwap ? minTickLabel : maxTickLabel}</span>
            )&nbsp;
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(
                      t("Pool:position.ratioTooltip", {
                        symbol: (!isSwap ? tokenA : tokenB)?.displaySymbol || "",
                      }),
                    ),
                  }}
                />
              }
            >
              <IconInfo />
            </Tooltip>
            &nbsp;
          </div>
          <div>
            ~&nbsp;
            {maxPriceStr} &nbsp;
            {(!isSwap ? tokenB : tokenA)?.symbol}&nbsp;(
            <span className={endClass}>{!isSwap ? maxTickLabel : minTickLabel}</span>
            )&nbsp;
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(
                      t("Pool:position.ratioTooltip", {
                        symbol: (!isSwap ? tokenB : tokenA)?.displaySymbol || "",
                      }),
                    ),
                  }}
                />
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <PositionCardAnchor id={`${position.id}`} />
      <MyPositionCardWrapper type={isClosed ? "closed" : "none"}>
        {cardHeader}
        {cardStat}
        {cardGraph}
        <PositionHistory position={position} isClosed={isClosed} />
      </MyPositionCardWrapper>
    </>
  );
};

interface ClaimButtonProps {
  text: string;
  onClick: () => void;
}

const ClaimButton = ({ text, onClick }: ClaimButtonProps) => {
  const defaultStyle = {
    fullWidth: false,
    hierarchy: ButtonHierarchy.Primary,
  };

  return <Button text={text} style={defaultStyle} onClick={onClick} />;
};

export default MyDetailedPositionCard;
