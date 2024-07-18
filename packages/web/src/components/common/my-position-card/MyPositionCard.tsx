import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  RANGE_STATUS_OPTION,
  SwapFeeTierInfoMap,
} from "@constants/option.constant";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import {
  MyPositionCardWrapper,
  MyPositionCardWrapperBorder,
} from "./MyPositionCard.styles";
import BarAreaGraph from "../bar-area-graph/BarAreaGraph";
import { PoolPositionModel } from "@models/position/pool-position-model";
import {
  isEndTickBy,
  makeSwapFeeTierByTickSpacing,
  tickToPrice,
  tickToPriceStr,
} from "@utils/swap-utils";
import { isMaxTick, isMinTick } from "@utils/pool-utils";
import IconStrokeArrowUp from "../icons/IconStrokeArrowUp";
import IconStrokeArrowDown from "../icons/IconStrokeArrowDown";
import { useGetLazyPositionBins } from "@query/positions";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { TokenPriceModel } from "@models/token/token-price-model";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import IconStar from "../icons/IconStar";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";
import { useTranslation } from "react-i18next";

interface MyPositionCardProps {
  position: PoolPositionModel;
  movePoolDetail: (poolId: string, positionId: string) => void;
  mobile: boolean;
  currentIndex?: number;
  themeKey: "dark" | "light";
  tokenPrices: Record<string, TokenPriceModel>;
}

export function estimateTick(tick: number, width: number) {
  if (tick < 0) return 0;
  if (tick > width) return width;
  return tick;
}

const MyPositionCard: React.FC<MyPositionCardProps> = ({
  position,
  movePoolDetail,
  currentIndex,
  themeKey,
  tokenPrices,
}) => {
  const { t } = useTranslation();

  const GRAPH_WIDTH = 290;
  const GRAPH_HEIGHT = 80;
  const { pool } = position;
  const { tokenA, tokenB } = pool;
  const [isHiddenStart] = useState(false);
  const [viewMyRange, setViewMyRange] = useState(false);
  const [isMouseoverGraph, setIsMouseoverGraph] = useState(false);
  const [shortenInRange, setShortenInRange] = useState(false);

  const { data: bins40, isFetched: isFetchedBins } = useGetLazyPositionBins(
    position.lpTokenId,
    40,
    isMouseoverGraph,
  );

  const onMouseoverViewMyRange = useCallback(() => {
    setIsMouseoverGraph(true);
  }, []);

  const onMouseoutViewMyRange = useCallback(() => {
    setIsMouseoverGraph(false);
  }, []);

  const poolBins = useMemo(() => {
    return (bins40 ?? []).map(item => ({
      index: item.index,
      reserveTokenA: Number(item.poolReserveTokenA),
      reserveTokenB: Number(item.poolReserveTokenB),
      minTick: Number(item.minTick),
      maxTick: Number(item.maxTick),
      liquidity: Number(item.poolLiquidity),
    }));
  }, [bins40]);

  const positionBins = useMemo(() => {
    return (bins40 ?? []).map(item => ({
      index: item.index,
      reserveTokenA: Number(item.reserveTokenA),
      reserveTokenB: Number(item.reserveTokenB),
      minTick: Number(item.minTick),
      maxTick: Number(item.maxTick),
      liquidity: Number(item.liquidity),
    }));
  }, [bins40]);

  // fake close
  const inRange: boolean | null = useMemo(() => {
    if (position.closed === true) return null;
    return (
      pool.currentTick <= position.tickUpper &&
      pool.currentTick >= position.tickLower
    );
  }, [
    pool.currentTick,
    position.tickLower,
    position.tickUpper,
    position.closed,
  ]);

  const feeRateStr = useMemo(() => {
    const rateStr =
      SwapFeeTierInfoMap[makeSwapFeeTierByTickSpacing(pool.tickSpacing)]
        .rateStr;
    return `${rateStr}`;
  }, [pool.tickSpacing]);

  const positionUsdValueStr = useMemo(() => {
    if (!position.positionUsdValue || position.positionUsdValue === "0")
      return "-";

    return formatOtherPrice(position.positionUsdValue);
  }, [position.positionUsdValue]);

  const aprStr = useMemo(() => {
    if (!position.apr) return "-";

    return (
      <>
        {Number(position.apr) > 100 && <IconStar size={20} />}
        {formatRate(position.apr)}
      </>
    );
  }, [position.apr]);

  const currentPrice = useMemo(() => {
    return tickToPrice(pool.currentTick);
  }, [pool.currentTick]);
  const minTickRate = useMemo(() => {
    if (isMinTick(position.tickLower)) {
      return 0;
    }
    const minPrice = tickToPrice(position.tickLower);
    return ((currentPrice - minPrice) / currentPrice) * 100;
  }, [currentPrice, position.tickLower]);

  const maxTickRate = useMemo(() => {
    if (isMaxTick(position.tickUpper)) {
      return 999;
    }
    const maxPrice = tickToPrice(position.tickUpper);
    return ((maxPrice - currentPrice) / currentPrice) * 100;
  }, [currentPrice, position.tickUpper]);

  const minTickLabel = useMemo(() => {
    return minTickRate * -1 > 1000
      ? ">999%"
      : `${minTickRate < 0 ? "+" : ""}${
          Math.abs(minTickRate) > 0 && Math.abs(minTickRate) < 1
            ? "<1"
            : Math.round(minTickRate * -1)
        }%`;
  }, [minTickRate]);

  const maxTickLabel = useMemo(() => {
    if (maxTickRate === 999) return `>${maxTickRate}`;

    if (maxTickRate >= 1000) return ">999%";

    return maxTickRate >= 1000
      ? ">999%"
      : `${maxTickRate > 0 && maxTickRate >= 1 ? "+" : ""}${
          Math.abs(maxTickRate) < 1 ? "<1" : Math.round(maxTickRate)
        }%`;
  }, [maxTickRate]);

  const tickRange = useMemo(() => {
    const ticks = positionBins.flatMap(bin => [bin.minTick, bin.maxTick]);
    const min = Math.min(...ticks);
    const max = Math.max(...ticks);
    return [min, max];
  }, [positionBins]);

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

    if (positionBins.length === 0) return false;

    const isMinEndTick = isEndTickBy(min, position.pool.fee);
    const isMaxEndTick = isEndTickBy(max, position.pool.fee);

    const minPrice = tickToPriceStr(min, { isEnd: isMinEndTick });
    const maxPrice = tickToPriceStr(max, { isEnd: isMaxEndTick });

    return minPrice === "0" && maxPrice === "∞";
  }, [tickRange, positionBins.length, position.pool.fee]);

  const minPriceStr = useMemo(() => {
    const isEndTick = isEndTickBy(position.tickLower, position.pool.fee);

    const minPrice = tickToPriceStr(position.tickLower, {
      decimals: 40,
      isEnd: isEndTick,
      isFormat: false,
    });

    if (isFullRange) return "0";

    return formatTokenExchangeRate(minPrice, {
      minLimit: 0.000001,
      maxSignificantDigits: 6,
      isInfinite: minPrice === "∞",
    });
  }, [position.tickLower, position.pool.fee, isFullRange]);

  const maxPriceStr = useMemo(() => {
    const isEndTick = isEndTickBy(position.tickUpper, position.pool.fee);
    const maxPrice = tickToPriceStr(position.tickUpper, {
      decimals: 40,
      isEnd: isEndTick,
      isFormat: false,
    });

    if (isFullRange) return "∞";

    return formatTokenExchangeRate(maxPrice, {
      maxSignificantDigits: 6,
      minLimit: 0.000001,
      isInfinite: maxPrice === "∞",
      fixedDecimalDigits: 6,
    });
  }, [position.tickUpper, position.pool.fee, isFullRange]);

  const onClickViewRange = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setViewMyRange(!viewMyRange);
  };

  const getMinTick = useMemo(() => {
    if (!minTickPosition) {
      return null;
    }
    if (minTickPosition < 0) {
      return 0;
    }
    if (minTickPosition > GRAPH_WIDTH) {
      return GRAPH_WIDTH;
    }
    return minTickPosition;
  }, [minTickPosition]);

  const getMaxTick = useMemo(() => {
    if (!maxTickPosition) {
      return null;
    }
    if (maxTickPosition < 0) {
      return 0;
    }
    if (maxTickPosition > GRAPH_WIDTH) {
      return GRAPH_WIDTH;
    }
    return maxTickPosition;
  }, [maxTickPosition]);

  const startClass = useMemo(() => {
    if (getMinTick === null) {
      return "";
    }
    return minTickRate > 0 || isFullRange ? "negative" : "positive";
  }, [getMinTick, minTickRate, isFullRange]);

  const endClass = useMemo(() => {
    if (getMaxTick === null) {
      return "";
    }
    return maxTickRate > 0 ? "positive" : "negative";
  }, [getMaxTick, maxTickRate]);

  const claimableUSD = useMemo(() => {
    const claimableUSD_ = position.reward.reduce(
      (acc, cur) => Number(cur.claimableUsd) + acc,
      0,
    );
    if (claimableUSD_ === 0) return "-";

    return formatOtherPrice(claimableUSD_);
  }, [position.reward]);

  const dailyEarning = useMemo(() => {
    const dailyEarning_ = position.reward.reduce((acc, current) => {
      const currentTokenPrice = tokenPrices?.[current.rewardToken.priceID]
        ? Number(tokenPrices?.[current.rewardToken.priceID].usd)
        : 0;

      return acc + Number(current.accuReward1D ?? 0) * currentTokenPrice;
    }, 0);

    if (dailyEarning_ === 0) return "-";

    return formatOtherPrice(dailyEarning_);
  }, [position.reward, tokenPrices]);

  const boxHeaderId = useMemo(() => position.id + "-box-header", [position.id]);

  useLayoutEffect(() => {
    const titleElement = document.getElementById(boxHeaderId);
    setShortenInRange((titleElement?.clientWidth || 0) > 210);
  }, [inRange, boxHeaderId]);

  return (
    <MyPositionCardWrapperBorder
      className={`${position.staked && inRange !== null ? "special-card" : ""}`}
      viewMyRange={viewMyRange}
    >
      <div className="base-border">
        <MyPositionCardWrapper
          staked={position.staked}
          onClick={() => movePoolDetail(pool.id, position.id)}
          viewMyRange={viewMyRange}
          disabled={inRange === null}
        >
          <div className="title-wrapper">
            <div id={boxHeaderId} className="box-header">
              <DoubleLogo
                left={tokenA.logoURI}
                right={tokenB.logoURI}
                leftSymbol={tokenA.symbol}
                rightSymbol={tokenB.symbol}
                size={24}
              />
              <span>{`${tokenA.symbol}/${tokenB.symbol}`}</span>
              <div className="badge-group">
                <Badge type={BADGE_TYPE.DARK_DEFAULT} text={feeRateStr} />
              </div>
            </div>
            <RangeBadge
              isClosed={position.closed}
              className={inRange === null ? "disabled-range" : ""}
              isShorten={shortenInRange}
              status={
                inRange === null
                  ? RANGE_STATUS_OPTION.NONE
                  : inRange
                  ? RANGE_STATUS_OPTION.IN
                  : RANGE_STATUS_OPTION.OUT
              }
            />
          </div>
          <div className="list-wrapper">
            <div className="list-header">
              <span className="label-text">
                {t("Earn:positions.card.value")}
              </span>
              <span className="label-text">APR</span>
            </div>
            <div className="list-content">
              <span>{positionUsdValueStr}</span>
              <span className="apr-value">{aprStr}</span>
            </div>
            <div className="list-header mt-4">
              <span className="label-text">
                {t("Earn:positions.card.dailyEarn")}
              </span>
              <span className="label-text">
                {t("Earn:positions.card.claimRewards")}
              </span>
            </div>
            <div className="list-content">
              <span>{dailyEarning}</span>
              {claimableUSD}
            </div>
          </div>
          <div
            className="view-my-range"
            onMouseOver={onMouseoverViewMyRange}
            onMouseOut={onMouseoutViewMyRange}
          >
            <span onClick={onClickViewRange}>
              {t("Earn:positions.card.viewRange")} <IconStrokeArrowUp />
            </span>
          </div>
          <div
            className={`pool-price-graph ${viewMyRange ? "open" : ""}`}
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
          >
            <div className="view-my-range">
              <span onClick={onClickViewRange}>
                {t("Earn:positions.card.hideRange")} <IconStrokeArrowDown />
              </span>
            </div>
            {isFetchedBins ? (
              <React.Fragment>
                <div className="chart-wrapper">
                  <BarAreaGraph
                    width={GRAPH_WIDTH}
                    height={GRAPH_HEIGHT}
                    currentTick={pool.currentTick}
                    minLabel={minTickLabel}
                    maxLabel={maxTickLabel}
                    minTick={minTickPosition}
                    maxTick={maxTickPosition}
                    poolBins={poolBins}
                    tokenA={tokenA}
                    tokenB={tokenB}
                    isHiddenStart={isHiddenStart}
                    currentIndex={currentIndex}
                    themeKey={themeKey}
                    minTickRate={minTickRate}
                    maxTickRate={maxTickRate}
                    pool={pool}
                    positionBins={positionBins}
                  />
                </div>
                <div className="min-max-price">
                  <p className={`label-text ${startClass}`}>
                    {minPriceStr}(<span>{minTickLabel}</span>) ~
                  </p>
                  <p className={`label-text ${endClass}`}>
                    {maxPriceStr}(<span>{maxTickLabel}</span>) {tokenB.symbol}
                  </p>
                </div>
              </React.Fragment>
            ) : (
              <div className="graph-loading-wrapper">
                <LoadingSpinner className="icon-loading" size={"SMALL"} />
              </div>
            )}
          </div>
        </MyPositionCardWrapper>
      </div>
    </MyPositionCardWrapperBorder>
  );
};

export default MyPositionCard;
