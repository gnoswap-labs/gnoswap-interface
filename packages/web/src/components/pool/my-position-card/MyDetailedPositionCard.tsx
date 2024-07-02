import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconStaking from "@components/common/icons/IconStaking";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION, RewardType } from "@constants/option.constant";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { DEVICE_TYPE } from "@styles/media";
import React, { useCallback, useMemo, useState } from "react";
import {
  CopyTooltip,
  ManageItem,
  MyPositionCardWrapper,
  PositionCardAnchor,
  ToolTipContentWrapper,
} from "./MyPositionCard.styles";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { TokenModel } from "@models/token/token-model";
import { BalanceTooltipContent } from "./MyPositionCardBalanceContent";
import { MyPositionRewardContent } from "./MyPositionCardRewardContent";
import { PositionRewardInfo } from "@models/position/info/position-reward-info";
import { MyPositionAprContent } from "./MyPositionCardAprContent";
import { PositionAPRInfo } from "@models/position/info/position-apr-info";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { IncreaseState, ThemeState } from "@states/index";
import { useAtomValue, useAtom } from "jotai";
import IconSwap from "@components/common/icons/IconSwap";
import IconInfo from "@components/common/icons/IconInfo";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import { useWindowSize } from "@hooks/common/use-window-size";
import SelectBox from "@components/common/select-box/SelectBox";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import { isEndTickBy, tickToPrice, tickToPriceStr } from "@utils/swap-utils";
import { LoadingChart } from "../pool-pair-info-content/PoolPairInfoContent.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { numberToFormat } from "@utils/string-utils";
import PositionHistory from "./PositionHistory";
import useRouter from "@hooks/common/use-custom-router";
import IconLinkPage from "@components/common/icons/IconLinkPage";
import { useCopy } from "@hooks/common/use-copy";
import BigNumber from "bignumber.js";
import IconPolygon from "@components/common/icons/IconPolygon";
import Button from "@components/common/button/Button";
import { useGetPositionBins } from "@query/positions";
import { toPriceFormat } from "@utils/number-utils";
import { TokenPriceModel } from "@models/token/token-price-model";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";

interface MyDetailedPositionCardProps {
  position: PoolPositionModel;
  breakpoint: DEVICE_TYPE;
  loading: boolean;
  address: string;
  isHiddenAddPosition: boolean;
  connected: boolean;
  tokenPrices: Record<string, TokenPriceModel>;
}

const MyDetailedPositionCard: React.FC<MyDetailedPositionCardProps> = ({
  position,
  breakpoint,
  loading,
  address,
  isHiddenAddPosition,
  connected,
  tokenPrices,
}) => {
  const router = useRouter();
  const { width } = useWindowSize();
  const [isSwap, setIsSwap] = useState(false);
  const themeKey = useAtomValue(ThemeState.themeKey);
  const GRAPH_WIDTH = useMemo(
    () => Math.min(width - (width > 767 ? 224 : 80), 1216),
    [width],
  );
  const [, setSelectedPosition] = useAtom(IncreaseState.selectedPosition);
  const [copied, setCopy] = useCopy();
  const { data: bins = [] } = useGetPositionBins(position.lpTokenId, 40);

  const isClosed = position.closed;

  const tokenA = useMemo(() => {
    return position.pool.tokenA;
  }, [position.pool.tokenA]);

  const tokenB = useMemo(() => {
    return position.pool.tokenB;
  }, [position.pool.tokenB]);

  const currentTick = useMemo(() => {
    return position.pool.currentTick || null;
  }, [position.pool.currentTick]);

  const price = useMemo(() => {
    return position.pool.price || 1;
  }, [position.pool.price]);

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
    const tokenABalance =
      makeDisplayTokenAmount(tokenA, position.tokenABalance) || 0;
    return tokenAUSD * tokenABalance;
  }, [getTokenPrice, position.tokenABalance, tokenA]);

  const tokenBBalanceUSD = useMemo(() => {
    const tokenBUSD = Number(getTokenPrice(tokenB.priceID) || "1");
    const tokenBBalance =
      makeDisplayTokenAmount(tokenB, position.tokenBBalance) || 0;
    return tokenBUSD * tokenBBalance;
  }, [getTokenPrice, position.tokenBBalance, tokenB]);

  const positionBalanceUSD = useMemo(() => {
    if (isClosed || !position.positionUsdValue) {
      return "-";
    }
    if (
      BigNumber(position.positionUsdValue).isLessThan(0.01) &&
      BigNumber(position.positionUsdValue).isGreaterThan(0)
    ) {
      return "<$0.01";
    }
    return `$${numberToFormat(`${position.positionUsdValue}`, {
      decimals: 2,
    })}`;
  }, [position.positionUsdValue, isClosed]);

  const balances = useMemo((): {
    token: TokenModel;
    balance: number;
    balanceUSD: number;
    percent: string;
  }[] => {
    const sumOfBalances =
      Number(position.tokenABalance) + Number(position.tokenBBalance);
    const tokenABalance = Number(position.tokenABalance);
    const tokenBBalance = Number(position.tokenBBalance);
    const depositRatio =
      sumOfBalances === 0
        ? 0.5
        : tokenABalance /
          (tokenABalance + tokenBBalance / position?.pool?.price);
    return [
      {
        token: tokenA,
        balance: Number(position.tokenABalance),
        balanceUSD: tokenABalanceUSD,
        percent: `${Math.round(depositRatio * 100)}%`,
      },
      {
        token: tokenB,
        balance: Number(position.tokenBBalance),
        balanceUSD: tokenBBalanceUSD,
        percent: `${Math.round((1 - depositRatio) * 100)}%`,
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

  const totalRewardInfo = useMemo(():
    | { [key in RewardType]: PositionRewardInfo[] }
    | null => {
    const rewards = position.reward;
    if (rewards.length === 0) {
      return null;
    }

    const totalRewardInfo = rewards.reduce<{
      [key in RewardType]: PositionRewardInfo[];
    }>(
      (accum, current) => {
        if (!accum[current.rewardType]) {
          accum[current.rewardType] = [];
        }

        const index = accum[current.rewardType].findIndex(
          item => item.token.priceID === current.rewardToken.priceID,
        );

        if (index !== -1) {
          accum[current.rewardType][index] = {
            ...accum[current.rewardType][index],
            claimableAmount:
              accum[current.rewardType][index].claimableAmount +
              current.claimableAmount,
            claimableUSD:
              accum[current.rewardType][index].claimableUSD ??
              0 + Number(current.claimableUsd),
            accumulatedRewardOf1dUsd:
              accum[current.rewardType][index].accumulatedRewardOf1dUsd +
              Number(current.accuReward1D ?? 0) *
                Number(getTokenPrice(current.rewardToken.priceID) ?? 0),
          };
        } else {
          accum[current.rewardType].push({
            claimableAmount: current.claimableAmount || 0,
            token: current.rewardToken,
            balance:
              makeDisplayTokenAmount(
                current.rewardToken,
                current.totalAmount,
              ) || 0,
            balanceUSD:
              Number(current.totalAmount) *
              Number(getTokenPrice(current.rewardToken.priceID) || 0),
            claimableUSD: Number(current.claimableUsd) || 0,
            accumulatedRewardOf1d: current.accuReward1D
              ? Number(current.accuReward1D)
              : 0,
            accumulatedRewardOf1dUsd:
              Number(current.accuReward1D ?? 0) *
              Number(getTokenPrice(current.rewardToken.priceID) ?? 0),
          });
        }
        return accum;
      },
      {
        SWAP_FEE: [],
        // Not use any more
        STAKING: [],
        EXTERNAL: [],
        INTERNAL: [],
      },
    );

    return totalRewardInfo;
  }, [getTokenPrice, position.reward]);

  const totalRewardUSD = useMemo(() => {
    const isEmpty =
      !position.reward ||
      position.reward.length === 0 ||
      position.reward.every(item => !item.claimableUsd);

    if (isClosed || isEmpty) {
      return "-";
    }

    const usdValue = position.reward.reduce<number>(
      (acc, current) => acc + Number(current.claimableUsd),
      0,
    );

    if (
      BigNumber(usdValue).isLessThan(0.01) &&
      BigNumber(usdValue).isGreaterThan(0)
    ) {
      return "<$0.01";
    }

    return `$${numberToFormat(`${usdValue}`, { decimals: 2 })}`;
  }, [isClosed, position.reward]);

  const totalDailyEarning = useMemo(() => {
    const isEmpty =
      !totalRewardInfo ||
      position.reward.length === 0 ||
      position.reward.every(item => !item.accuReward1D);

    if (isClosed || isEmpty) {
      return "-";
    }

    const totalDailyEarningValue = Object.values(totalRewardInfo)
      .flatMap(item => item)
      .reduce((acc, current) => {
        return acc + Number(current.accumulatedRewardOf1dUsd);
      }, 0);

    return toPriceFormat(totalDailyEarningValue, {
      usd: true,
      minLimit: 0.01,
      isRounding: false,
      fixedLessThan1Decimal: 2,
    });
  }, [isClosed, position.reward, totalRewardInfo]);

  const aprRewardInfo: { [key in RewardType]: PositionAPRInfo[] } | null =
    useMemo(() => {
      const aprRewardInfo = position.reward.reduce<{
        [key in RewardType]: PositionAPRInfo[];
      }>(
        (accum, current) => {
          const currentTypeRewards = accum[current.rewardType];

          if (!currentTypeRewards) {
            accum[current.rewardType] = [];
          }
          const index = accum[current.rewardType].findIndex(
            item => item.token.priceID === current.rewardToken.priceID,
          );
          if (index != -1) {
            accum[current.rewardType][index] = {
              ...accum[current.rewardType][index],
              accuReward1D:
                accum[current.rewardType][index].accuReward1D +
                Number(current.accuReward1D),
              apr: accum[current.rewardType][index].apr + Number(current.apr),
            };
          } else {
            accum[current.rewardType].push({
              token: current.rewardToken,
              rewardType: current.rewardType,
              accuReward1D: Number(current.accuReward1D),
              accuReward1DPrice: Number(current.accuReward1D),
              apr: Number(current.apr),
            });
          }
          return accum;
        },
        {
          SWAP_FEE: [],
          // NOt use anymore
          STAKING: [],
          EXTERNAL: [],
          INTERNAL: [],
        },
      );
      return aprRewardInfo;
    }, [position.reward]);

  const stringPrice = useMemo(() => {
    const price = tickToPriceStr(position?.pool?.currentTick, {
      decimals: 40,
      isFormat: false,
    });
    if (isSwap) {
      return (
        <>
          1 {tokenB?.symbol} ={" "}
          {formatTokenExchangeRate(1 / position?.pool?.price, {
            isInfinite: price === "∞",
            maxSignificantDigits: 6,
            fixedDecimalDigits: 6,
            minLimit: 0.000001,
          })}{" "}
          {tokenA?.symbol}
        </>
      );
    }
    return (
      <>
        1 {tokenA?.symbol} ={" "}
        {formatTokenExchangeRate(price, {
          isInfinite: price === "∞",
          maxSignificantDigits: 6,
          fixedDecimalDigits: 6,
          minLimit: 0.000001,
        })}{" "}
        {tokenB?.symbol}
      </>
    );
  }, [
    isSwap,
    tokenB?.symbol,
    tokenA?.symbol,
    position?.pool?.price,
    position?.pool?.currentTick,
  ]);

  const poolBin = useMemo(() => {
    return (bins ?? []).map(item => ({
      index: item.index,
      reserveTokenA: Number(item.poolReserveTokenA),
      reserveTokenB: Number(item.poolReserveTokenB),
      minTick: Number(item.minTick),
      maxTick: Number(item.maxTick),
      liquidity: Number(item.poolLiquidity),
    }));
  }, [bins]);

  const positionBin = useMemo(() => {
    return (bins ?? []).map(item => ({
      index: item.index,
      reserveTokenA: Number(item.reserveTokenA),
      reserveTokenB: Number(item.reserveTokenB),
      minTick: Number(item.minTick),
      maxTick: Number(item.maxTick),
      liquidity: Number(item.liquidity),
    }));
  }, [bins]);

  const tickRange = useMemo(() => {
    const ticks = positionBin.flatMap(bin => [bin.minTick, bin.maxTick]);
    const min = Math.min(...ticks);
    const max = Math.max(...ticks);
    return [min, max];
  }, [positionBin]);

  const minTickPosition = useMemo(() => {
    const [min, max] = tickRange;
    const currentTick = position.pool.currentTick;
    if (position.tickLower === currentTick) {
      return 0;
    }
    if (position.tickLower < currentTick) {
      return (
        ((position.tickLower - min) / (currentTick - min)) * (GRAPH_WIDTH / 2)
      );
    }
    return (
      ((position.tickLower - currentTick) / (max - currentTick)) *
        (GRAPH_WIDTH / 2) +
      GRAPH_WIDTH / 2
    );
  }, [GRAPH_WIDTH, position.pool.currentTick, position.tickLower, tickRange]);

  const maxTickPosition = useMemo(() => {
    const [min, max] = tickRange;
    const currentTick = position.pool.currentTick;
    if (position.tickUpper === currentTick) {
      return 0;
    }
    if (position.tickUpper < currentTick) {
      return (
        ((position.tickUpper - min) / (currentTick - min)) * (GRAPH_WIDTH / 2)
      );
    }
    return (
      ((position.tickUpper - currentTick) / (max - currentTick)) *
        (GRAPH_WIDTH / 2) +
      GRAPH_WIDTH / 2
    );
  }, [GRAPH_WIDTH, position.pool.currentTick, position.tickUpper, tickRange]);

  const isFullRange = useMemo(() => {
    const [min, max] = tickRange;
    if (positionBin.length === 0) return false;

    const isMinEndTick = isEndTickBy(min, position.pool.fee);
    const isMaxEndTick = isEndTickBy(max, position.pool.fee);

    const minPrice = tickToPriceStr(min, { isEnd: isMinEndTick });
    const maxPrice = tickToPriceStr(max, { isEnd: isMaxEndTick });

    return minPrice === "0" && maxPrice === "∞";
  }, [tickRange, positionBin.length, position.pool.fee]);

  const minPriceStr = useMemo(() => {
    const isEndTick = isEndTickBy(position.tickLower, position.pool.fee);
    const maxPrice = tickToPrice(position.tickUpper);
    const minPrice = tickToPriceStr(position.tickLower, {
      isEnd: isEndTick,
      decimals: 40,
      isFormat: false,
    });

    if (isFullRange) return "0 ";

    if (!isSwap) {
      return formatTokenExchangeRate(minPrice, {
        minLimit: 0.000001,
        maxSignificantDigits: 6,
        fixedDecimalDigits: 6,
        isInfinite: minPrice === "∞",
      });
    }

    return formatTokenExchangeRate(`${Number(1 / Number(maxPrice))}`, {
      minLimit: 0.000001,
      maxSignificantDigits: 6,
      fixedDecimalDigits: 6,
    });
  }, [
    position.tickLower,
    position.pool.fee,
    position.tickUpper,
    isFullRange,
    isSwap,
  ]);

  const currentPrice = useMemo(() => {
    return !isSwap
      ? tickToPrice(position?.pool.currentTick)
      : 1 / tickToPrice(position?.pool.currentTick);
  }, [position?.pool.currentTick, isSwap]);

  const minTickRate = useMemo(() => {
    const minPrice = !isSwap
      ? tickToPrice(position.tickLower)
      : 1 / tickToPrice(position.tickLower);
    return ((currentPrice - minPrice) / currentPrice) * 100;
  }, [currentPrice, position.tickLower, isSwap]);

  const maxTickRate = useMemo(() => {
    const maxPrice = !isSwap
      ? tickToPrice(position.tickUpper)
      : 1 / tickToPrice(position.tickUpper);
    return ((maxPrice - currentPrice) / currentPrice) * 100;
  }, [currentPrice, position.tickUpper, isSwap]);

  const maxPriceStr = useMemo(() => {
    const isEndTick = isEndTickBy(position.tickUpper, position.pool.fee);

    const minPrice = tickToPrice(position.tickLower);

    const maxPrice = tickToPriceStr(position.tickUpper, {
      isEnd: isEndTick,
      decimals: 40,
      isFormat: false,
    });

    if (isFullRange) {
      return "∞";
    }

    if (isFullRange) {
      return "∞";
    }

    if (!isSwap) {
      return formatTokenExchangeRate(maxPrice, {
        minLimit: 0.000001,
        maxSignificantDigits: 6,
        fixedDecimalDigits: 6,
        isInfinite: maxPrice === "∞",
      });
    }

    return formatTokenExchangeRate(`${Number(1 / Number(minPrice))}`, {
      minLimit: 0.000001,
      maxSignificantDigits: 6,
      fixedDecimalDigits: 6,
    });
  }, [
    position.tickLower,
    position.tickUpper,
    isFullRange,
    isSwap,
    position.pool.fee,
  ]);

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

    return `${maxTickRate > 1 ? "+" : ""}${
      Math.abs(maxTickRate) < 1 ? "<1" : Math.round(maxTickRate)
    }%`;
  }, [maxTickRate]);

  const startClass = useMemo(() => {
    return (!isSwap ? minTickRate : -maxTickRate) > 0 ? "negative" : "positive";
  }, [minTickRate, isSwap, maxTickRate]);

  const endClass = useMemo(() => {
    return (!isSwap ? maxTickRate : -minTickRate) > 0 ? "positive" : "negative";
  }, [maxTickRate, isSwap, minTickRate]);
  const handleSelect = (text: string) => {
    if (text == "Decrease Liquidity") {
      setSelectedPosition(position);
      router.push(
        "/earn/pool/" +
          router.query["pool-path"] +
          "/" +
          position?.id +
          "/decrease-liquidity",
      );
    } else if (text === "Increase Liquidity") {
      setSelectedPosition(position);
      router.push(
        "/earn/pool/" +
          router.query["pool-path"] +
          "/" +
          position?.id +
          "/increase-liquidity",
      );
    } else {
      setSelectedPosition(position);
      router.push(
        "/earn/pool/" +
          router.query["pool-path"] +
          "/" +
          position?.id +
          "/reposition",
      );
    }
  };

  const isHideBar = useMemo(() => {
    const isAllReserveZeroBin40 = poolBin.every(
      item =>
        Number(item.reserveTokenA) === 0 && Number(item.reserveTokenB) === 0,
    );
    const isAllReserveZeroBin = positionBin.every(
      item =>
        Number(item.reserveTokenA) === 0 && Number(item.reserveTokenB) === 0,
    );

    return isAllReserveZeroBin40 && isAllReserveZeroBin;
  }, [poolBin, positionBin]);

  const isShowRewardInfoTooltip = useMemo(() => {
    return (
      aprRewardInfo !== null &&
      (aprRewardInfo?.EXTERNAL.length !== 0 ||
        aprRewardInfo?.INTERNAL.length !== 0 ||
        aprRewardInfo?.SWAP_FEE.length !== 0)
    );
  }, [aprRewardInfo]);

  const isShowTotalRewardInfo = useMemo(() => {
    return (
      totalRewardInfo &&
      (totalRewardInfo?.EXTERNAL.length !== 0 ||
        totalRewardInfo?.INTERNAL.length !== 0 ||
        totalRewardInfo?.SWAP_FEE.length !== 0)
    );
  }, [totalRewardInfo]);

  return (
    <>
      <PositionCardAnchor id={`${position.id}`} />
      <MyPositionCardWrapper type={isClosed ? "closed" : "none"}>
        <div className="box-title">
          <div className="box-header">
            <div className="box-left">
              {breakpoint !== DEVICE_TYPE.MOBILE ? (
                <>
                  {loading && (
                    <SkeletonEarnDetailWrapper height={36} mobileHeight={24}>
                      <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
                    </SkeletonEarnDetailWrapper>
                  )}
                  {!loading && (
                    <div className="coin-info">
                      <OverlapTokenLogo
                        tokens={[tokenA, tokenB]}
                        size={36}
                        mobileSize={24}
                      />
                    </div>
                  )}
                  {!loading && (
                    <div className="link-page">
                      <span className="product-id">ID #{position.id}</span>
                      <div
                        onClick={() => {
                          if (isClosed) {
                            setCopy(
                              `${
                                window.location.host + window.location.pathname
                              }?addr=${address}`,
                            );
                            return;
                          }

                          setCopy(
                            `${
                              window.location.host + window.location.pathname
                            }?addr=${address}#${position.id}`,
                          );
                        }}
                      >
                        <IconLinkPage className="icon-link" />
                        {copied && (
                          <CopyTooltip>
                            <div className={`box ${themeKey}-shadow`}>
                              <span>URL Copied!</span>
                            </div>
                            <IconPolygon className="polygon-icon" />
                          </CopyTooltip>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mobile-container">
                    {loading && (
                      <SkeletonEarnDetailWrapper height={36} mobileHeight={24}>
                        <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
                      </SkeletonEarnDetailWrapper>
                    )}
                    {!loading && (
                      <div className="coin-info">
                        <MissingLogo
                          symbol={tokenA.symbol}
                          url={tokenA.logoURI}
                          className="token-logo"
                          width={36}
                          mobileWidth={24}
                        />
                        <MissingLogo
                          symbol={tokenB.symbol}
                          url={tokenB.logoURI}
                          className="token-logo"
                          width={36}
                          mobileWidth={24}
                        />
                      </div>
                    )}
                    {!loading && (
                      <div className="link-page">
                        <span className="product-id">ID #{position.id}</span>
                        <div
                          onClick={() => {
                            if (isClosed) {
                              setCopy(
                                `${
                                  window.location.host +
                                  window.location.pathname
                                }?addr=${address}`,
                              );
                              return;
                            }

                            setCopy(
                              `${
                                window.location.host + window.location.pathname
                              }?addr=${address}#${position.id}`,
                            );
                          }}
                        >
                          <IconLinkPage className="icon-link" />
                          {copied && (
                            <CopyTooltip>
                              {breakpoint === DEVICE_TYPE.MOBILE && (
                                <IconPolygon className="polygon-icon rotate-90" />
                              )}
                              <div className={`box ${themeKey}-shadow`}>
                                <span>URL Copied!</span>
                              </div>
                              {breakpoint !== DEVICE_TYPE.MOBILE && (
                                <IconPolygon className="polygon-icon" />
                              )}
                            </CopyTooltip>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              <Badge
                type={BADGE_TYPE.PRIMARY}
                leftIcon={<IconStaking />}
                text={"Staked"}
                className={!position.staked ? "visible-badge" : ""}
              />
            </div>
            <div className="flex-button">
              {!isClosed && (
                <Button
                  text="Copy Positioning"
                  className="copy-button"
                  style={{
                    textColor: "text01",
                  }}
                  onClick={() => {
                    const queryParamsArr = [
                      `tickLower=${position.tickLower}`,
                      `tickUpper=${position.tickUpper}`,
                      "price_range_type=Custom",
                    ];

                    if (router.asPath.includes("?")) {
                      const urlWithoutQuery = router.asPath.split("?")[0];
                      const lastQuery = `last_query=${
                        router.asPath.split("?")[1]
                      }`;

                      router.push(
                        urlWithoutQuery +
                          `/add?${[...queryParamsArr, lastQuery].join("&")}`,
                      );
                      return;
                    }

                    if (router.asPath.includes("#")) {
                      const urlWithoutHash = router.asPath.split("#")[0];
                      const lastQuery = `last_query=${
                        router.asPath.split("?")[1]
                      }`;

                      router.push(
                        urlWithoutHash +
                          `/add?${[...queryParamsArr, lastQuery].join("&")}`,
                      );
                      return;
                    }

                    router.push(
                      router.asPath + `/add?${queryParamsArr.join("&")}`,
                    );
                  }}
                />
              )}
              {!position.staked && !isHiddenAddPosition && connected && (
                <SelectBox
                  current={"Manage"}
                  items={
                    isClosed
                      ? ["Increase Liquidity"]
                      : [
                          "Reposition",
                          "Increase Liquidity",
                          "Decrease Liquidity",
                        ]
                  }
                  select={handleSelect}
                  render={period => <ManageItem>{period}</ManageItem>}
                  className={!inRange && !isClosed ? "out-range" : ""}
                />
              )}
            </div>
          </div>
        </div>
        <div className="info-wrap">
          <div className="info-box">
            <span className="symbol-text">Balance</span>
            {loading && (
              <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
                <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
              </SkeletonEarnDetailWrapper>
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
              !loading && (
                <span className="content-text disabled">
                  {positionBalanceUSD}
                </span>
              )
            )}
          </div>
          <div className="info-box">
            <span className="symbol-text">Daily Earnings</span>
            {!isClosed && isShowRewardInfoTooltip && !loading ? (
              <Tooltip
                placement="top"
                FloatingContent={
                  <div>
                    <MyPositionAprContent rewardInfo={aprRewardInfo} />
                  </div>
                }
              >
                <span className="content-text">{totalDailyEarning}</span>
              </Tooltip>
            ) : (
              !loading && (
                <span className="content-text disabled">
                  {totalDailyEarning}
                </span>
              )
            )}
            {loading && (
              <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
                <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
              </SkeletonEarnDetailWrapper>
            )}
          </div>
          <div className="info-box">
            <span className="symbol-text">Claimable Rewards</span>
            {!isClosed && !loading && isShowTotalRewardInfo ? (
              <Tooltip
                placement="top"
                FloatingContent={
                  <div>
                    {totalRewardInfo && (
                      <MyPositionRewardContent rewardInfo={totalRewardInfo} />
                    )}
                  </div>
                }
              >
                <span className="content-text">{totalRewardUSD}</span>
              </Tooltip>
            ) : (
              !loading && (
                <span className="content-text disabled">{totalRewardUSD}</span>
              )
            )}
            {loading && (
              <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
                <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
              </SkeletonEarnDetailWrapper>
            )}
          </div>
        </div>
        <div className="position-wrapper-chart">
          <div className="position-header">
            <div>Current Price</div>
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
                <div
                  className="icon-wrapper"
                  onClick={() => setIsSwap(!isSwap)}
                >
                  <IconSwap />
                </div>
              )}
              {loading && (
                <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                  <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
                </SkeletonEarnDetailWrapper>
              )}
              {loading && (
                <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                  <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
                </SkeletonEarnDetailWrapper>
              )}
            </div>
            {!loading && (
              <div className="range-badge">
                <RangeBadge
                  status={
                    isClosed
                      ? RANGE_STATUS_OPTION.NONE
                      : inRange
                      ? RANGE_STATUS_OPTION.IN
                      : RANGE_STATUS_OPTION.OUT
                  }
                />
              </div>
            )}
          </div>
          {!loading && (
            <PoolGraph
              tokenA={tokenA}
              tokenB={tokenB}
              bins={poolBin}
              currentTick={currentTick}
              width={GRAPH_WIDTH}
              height={150}
              mouseover
              themeKey={themeKey}
              position="top"
              offset={40}
              poolPrice={price}
              isPosition
              minTickPosition={minTickPosition}
              maxTickPosition={maxTickPosition}
              binsMyAmount={positionBin}
              isSwap={isSwap}
              showBar={!isHideBar}
            />
          )}
          {loading && (
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
                <span className={startClass}>
                  {!isSwap ? minTickLabel : maxTickLabel}
                </span>
                )&nbsp;
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <ToolTipContentWrapper>
                      The price at which the position will be converted entirely
                      to&nbsp;
                      {(!isSwap ? tokenA : tokenB)?.symbol}.
                    </ToolTipContentWrapper>
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
                <span className={endClass}>
                  {!isSwap ? maxTickLabel : minTickLabel}
                </span>
                )&nbsp;
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <ToolTipContentWrapper>
                      The price at which the position will be converted entirely
                      to&nbsp;
                      {(!isSwap ? tokenB : tokenA)?.symbol}.
                    </ToolTipContentWrapper>
                  }
                >
                  <IconInfo />
                </Tooltip>
              </div>
            </div>
          )}
        </div>
        <PositionHistory
          position={position}
          isClosed={isClosed}
          tokenA={tokenA}
          tokenB={tokenB}
        />
      </MyPositionCardWrapper>
    </>
  );
};

export default MyDetailedPositionCard;
