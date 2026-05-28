import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { RANGE_STATUS_OPTION, SwapFeeTierInfoMap } from "@constants/option.constant";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import { MyPositionCardWrapper, MyPositionCardWrapperBorder } from "./MyPositionCard.styles";
import BarAreaGraph from "../../bar-area-graph/BarAreaGraph";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { isEndTickBy, tickToPrice, tickToPriceStr } from "@utils/swap-utils";
import { isMaxTick, isMinTick, makeDisplayPrice } from "@utils/pool-utils";
import IconStrokeArrowUp from "../../icons/IconStrokeArrowUp";
import IconStrokeArrowDown from "../../icons/IconStrokeArrowDown";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import { TokenPriceModel } from "@models/token/token-price-model";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import IconStar from "../../icons/IconStar";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";
import { useTranslation } from "react-i18next";
import MissingLogo from "../../missing-logo/MissingLogo";
import { QUERY_PARAMETER } from "@constants/page.constant";
import { usePrefetchNavigation } from "@hooks/common/use-prefetch-navigation";
import { usePoolLiquiditySegmentsByPath } from "@hooks/pool/data/use-pool-liquidity-segments-by-path";
import { LIQUIDITY_GRAPH_BIN_COUNT, LIQUIDITY_GRAPH_DEFAULT_VISIBLE_TICK_RANGE } from "@constants/graph.constant";

interface MyPositionCardProps {
  address?: string | null;
  position: PoolPositionModel;
  movePoolDetail: (poolId: string, positionId: number) => void;
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

interface MyPositionRangeGraphProps {
  position: PoolPositionModel;
  currentIndex?: number;
  themeKey: "dark" | "light";
  graphWidth: number;
  graphHeight: number;
  isHiddenStart: boolean;
  onClickViewRange: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const MyPositionRangeGraph: React.FC<MyPositionRangeGraphProps> = ({
  position,
  currentIndex,
  themeKey,
  graphWidth,
  graphHeight,
  isHiddenStart,
  onClickViewRange,
}) => {
  const { t } = useTranslation();
  const { pool } = position;
  const { tokenA, tokenB } = pool;

  const { liquiditySegments, isFetched: isFetchedLiquiditySegments } = usePoolLiquiditySegmentsByPath(
    position.poolPath,
    {
      currentTick: pool.currentTick,
      tokenA,
      tokenB,
      includeTokenAmounts: true,
      visibleTickRange: LIQUIDITY_GRAPH_DEFAULT_VISIBLE_TICK_RANGE,
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    },
    {
      enabled: true,
    },
  );

  const currentPrice = useMemo(() => tickToPrice(pool.currentTick), [pool.currentTick]);

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
          Math.abs(minTickRate) > 0 && Math.abs(minTickRate) < 1 ? "<1" : Math.round(minTickRate * -1)
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

  const isFullRange = useMemo(() => {
    const isMinEndTick = isEndTickBy(position.tickLower, position.pool.fee);
    const isMaxEndTick = isEndTickBy(position.tickUpper, position.pool.fee);

    const minPrice = tickToPriceStr(position.tickLower, { isEnd: isMinEndTick });
    const maxPrice = tickToPriceStr(position.tickUpper, { isEnd: isMaxEndTick });

    return minPrice === "0" && maxPrice === "∞";
  }, [position.tickLower, position.tickUpper, position.pool.fee]);

  const minPriceStr = useMemo(() => {
    const isEndTick = isEndTickBy(position.tickLower, position.pool.fee);

    const minPrice = isEndTick ? tickToPriceStr(position.tickLower, { isEnd: true }) : null;

    if (isFullRange) return "0";
    if (minPrice === "∞") return "∞";

    const displayMinPrice = makeDisplayPrice(tickToPrice(position.tickLower), tokenA, tokenB);

    return formatTokenExchangeRate(displayMinPrice, {
      minLimit: 0.000001,
      maxSignificantDigits: 6,
    });
  }, [position.tickLower, position.pool.fee, isFullRange, tokenA, tokenB]);

  const maxPriceStr = useMemo(() => {
    const isEndTick = isEndTickBy(position.tickUpper, position.pool.fee);
    const maxPrice = isEndTick ? tickToPriceStr(position.tickUpper, { isEnd: true }) : null;

    if (isFullRange) return "∞";
    if (maxPrice === "∞") return "∞";

    const displayMaxPrice = makeDisplayPrice(tickToPrice(position.tickUpper), tokenA, tokenB);

    return formatTokenExchangeRate(displayMaxPrice, {
      maxSignificantDigits: 6,
      minLimit: 0.000001,
      fixedDecimalDigits: 6,
    });
  }, [position.tickUpper, position.pool.fee, isFullRange, tokenA, tokenB]);

  const getMinTick = useMemo(() => {
    return estimateTick(position.tickLower, graphWidth);
  }, [graphWidth, position.tickLower]);

  const getMaxTick = useMemo(() => {
    return estimateTick(position.tickUpper, graphWidth);
  }, [graphWidth, position.tickUpper]);

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

  return (
    <div className="pool-price-graph open" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
      <div className="view-my-range">
        <span onClick={onClickViewRange}>
          {t("Earn:positions.card.hideRange")} <IconStrokeArrowDown />
        </span>
      </div>
      {isFetchedLiquiditySegments ? (
        <React.Fragment>
          <div className="chart-wrapper">
            <BarAreaGraph
              width={graphWidth}
              height={graphHeight}
              currentTick={pool.currentTick}
              minLabel={minTickLabel}
              maxLabel={maxTickLabel}
              tokenA={tokenA}
              tokenB={tokenB}
              isHiddenStart={isHiddenStart}
              currentIndex={currentIndex}
              themeKey={themeKey}
              minTickRate={minTickRate}
              maxTickRate={maxTickRate}
              liquiditySegments={liquiditySegments}
              positionLiquidity={position.liquidity.toString()}
              positionTickLower={position.tickLower}
              positionTickUpper={position.tickUpper}
              disableBlackBars={false}
            />
          </div>
          <div className="min-max-price">
            <p className={`label-text ${startClass}`}>
              {minPriceStr}(<span>{minTickLabel}</span>) ~
            </p>
            <p className={`label-text ${endClass}`}>
              {maxPriceStr}(<span>{maxTickLabel}</span>) {tokenB.displaySymbol}
            </p>
          </div>
        </React.Fragment>
      ) : (
        <div className="graph-loading-wrapper">
          <LoadingSpinner className="icon-loading" size={"SMALL"} />
        </div>
      )}
    </div>
  );
};

const MyPositionCard: React.FC<MyPositionCardProps> = ({
  address,
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
  const [shortenInRange, setShortenInRange] = useState(false);

  const { prefetch } = usePrefetchNavigation({
    pageType: "POOL",
    params: {
      [QUERY_PARAMETER.POOL_PATH]: position.poolPath,
      [QUERY_PARAMETER.ADDRESS]: address,
    },
    hash: position.id,
  });

  // fake close
  const inRange: boolean | null = useMemo(() => {
    if (position.closed === true) return null;
    return pool.currentTick <= position.tickUpper && pool.currentTick >= position.tickLower;
  }, [pool.currentTick, position.tickLower, position.tickUpper, position.closed]);

  const feeRateStr = SwapFeeTierInfoMap[position.feeTier].rateStr;

  const positionUsdValueStr = useMemo(() => {
    if (!position.positionUsdValue || position.positionUsdValue === "0") return "-";

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

  const onClickViewRange = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setViewMyRange(!viewMyRange);
  };

  const claimableUSD = useMemo(() => {
    const result = position.rewards.reduce((acc: number | null, cur) => {
      if (acc === -1 || !cur.claimableUsd || cur.claimableUsd === "") return -1;

      if (acc === null) return Number(cur.claimableUsd);

      return Number(cur.claimableUsd) + acc;
    }, null);

    if (result === null || result === -1) return "-";

    return formatOtherPrice(result);
  }, [position.rewards]);

  const dailyEarning = useMemo(() => {
    const result = position.rewards.reduce((acc: number | null, current) => {
      const tokenPrice = tokenPrices?.[current.rewardToken.priceID].usd
        ? Number(tokenPrices?.[current.rewardToken.priceID].usd)
        : null;
      if (acc === -1 || tokenPrice === null) return -1;

      if (acc === null && !current.accuReward1D) {
        return null;
      }

      if (acc === null) return Number(current.accuReward1D) * tokenPrice;

      return acc + Number(current.accuReward1D) * tokenPrice;
    }, null);

    if (result === null || result === -1) return "-";

    return formatOtherPrice(result);
  }, [position.rewards, tokenPrices]);

  const boxHeaderId = useMemo(() => position.id + "-box-header", [position.id]);

  const handleMouseEnter = useCallback(() => {
    prefetch();
  }, [prefetch]);

  const handleClick = useCallback(() => {
    movePoolDetail(pool.id, position.id);
  }, [movePoolDetail, pool.id, position.id]);

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
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          viewMyRange={viewMyRange}
          disabled={inRange === null}
        >
          <div className="title-wrapper">
            <div id={boxHeaderId} className="box-header">
              <MissingLogo symbol={`ID #${position.id}`} url={position.tokenUri} width={24} showTooltip />
              <span>{`${tokenA.displaySymbol}/${tokenB.displaySymbol}`}</span>
              <div className="badge-group">
                <Badge type={BADGE_TYPE.DARK_DEFAULT} text={feeRateStr} />
              </div>
            </div>
            <RangeBadge
              isClosed={position.closed}
              className={inRange === null ? "disabled-range" : ""}
              isShorten={shortenInRange}
              status={
                inRange === null ? RANGE_STATUS_OPTION.NONE : inRange ? RANGE_STATUS_OPTION.IN : RANGE_STATUS_OPTION.OUT
              }
            />
          </div>
          <div className="list-wrapper">
            <div className="list-header">
              <span className="label-text">{t("Earn:positions.card.value")}</span>
              <span className="label-text">APR</span>
            </div>
            <div className="list-content">
              <span>{positionUsdValueStr}</span>
              <span className="apr-value">{aprStr}</span>
            </div>
            <div className="list-header mt-4">
              <span className="label-text">{t("Earn:positions.card.dailyEarn")}</span>
              <span className="label-text">{t("Earn:positions.card.claimRewards")}</span>
            </div>
            <div className="list-content">
              <span>{dailyEarning}</span>
              <span>{claimableUSD}</span>
            </div>
          </div>
          <div className="view-my-range">
            <span onClick={onClickViewRange}>
              {t("Earn:positions.card.viewRange")} <IconStrokeArrowUp />
            </span>
          </div>
          {viewMyRange && (
            <MyPositionRangeGraph
              position={position}
              currentIndex={currentIndex}
              themeKey={themeKey}
              graphWidth={GRAPH_WIDTH}
              graphHeight={GRAPH_HEIGHT}
              isHiddenStart={isHiddenStart}
              onClickViewRange={onClickViewRange}
            />
          )}
        </MyPositionCardWrapper>
      </div>
    </MyPositionCardWrapperBorder>
  );
};

export default MyPositionCard;
