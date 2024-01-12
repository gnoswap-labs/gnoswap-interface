import { RANGE_STATUS_OPTION, SwapFeeTierInfoMap } from "@constants/option.constant";
import { POSITION_CONTENT_LABEL } from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import {
  MyPositionCardWrapper,
  MyPositionCardWrapperBorder,
} from "./MyPositionCard.styles";
import BarAreaGraph from "../bar-area-graph/BarAreaGraph";
import { useMemo, useState } from "react";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { makeSwapFeeTierByTickSpacing, tickToPrice } from "@utils/swap-utils";
import { numberToFormat } from "@utils/string-utils";
import { useTokenData } from "@hooks/token/use-token-data";
import { convertToKMB } from "@utils/stake-position-utils";
import { isMaxTick, isMinTick } from "@utils/pool-utils";
import IconStrokeArrowUp from "../icons/IconStrokeArrowUp";
import IconStrokeArrowDown from "../icons/IconStrokeArrowDown";
import BigNumber from "bignumber.js";

interface MyPositionCardProps {
  position: PoolPositionModel;
  movePoolDetail: (id: string) => void;
  mobile: boolean;
  currentIndex?: number;
  themeKey: "dark" | "light";
}

const MyPositionCard: React.FC<MyPositionCardProps> = ({
  position,
  movePoolDetail,
  mobile,
  currentIndex,
  themeKey,
}) => {
  const GRAPH_WIDTH = mobile ? 226 : 290;
  const GRAPH_HEIGHT = 80;
  const { pool } = position;
  const { tokenA, tokenB } = pool;
  const [isHiddenStart] = useState(false);
  const { tokenPrices } = useTokenData();
  const [viewMyRange, setViewMyRange] = useState(false);
  
  const inRange = useMemo(() => {
    return pool.currentTick <= position.tickUpper && pool.currentTick >= position.tickLower;
  }, [pool.currentTick, position.tickLower, position.tickUpper]);

  const feeRateStr = useMemo(() => {
    const rateStr = SwapFeeTierInfoMap[makeSwapFeeTierByTickSpacing(pool.tickSpacing)].rateStr;
    return `${rateStr}`;
  }, [pool.tickSpacing]);

  const positionUsdValueStr = useMemo(() => {
    return `$${convertToKMB(position.positionUsdValue, 2)}`;
  }, [position.positionUsdValue]);

  const aprStr = useMemo(() => {
    return position.apr === "" ? "-" : `${numberToFormat(position.apr, 2)}%`;
  }, [position.apr]);

  const currentPrice = useMemo(() => {
    return tickToPrice(pool.currentTick);
  }, [pool.currentTick]);

  const minTickRate = useMemo(() => {
    if (isMinTick(position.tickLower)) {
      return 0;
    }
    const minPrice = tickToPrice(position.tickLower);
    return Math.round(((currentPrice - minPrice) / currentPrice) * 100);
  }, [currentPrice, position.tickLower]);

  const maxTickRate = useMemo(() => {
    if (isMaxTick(position.tickUpper)) {
      return Infinity;
    }
    const maxPrice = tickToPrice(position.tickUpper);
    return Math.round(((maxPrice - currentPrice) / currentPrice) * 100);
  }, [currentPrice, position.tickUpper]);

  const minTickLabel = useMemo(() => {
    return `${minTickRate}%`;
  }, [minTickRate]);

  const maxTickLabel = useMemo(() => {
    return `${maxTickRate}%`;
  }, [maxTickRate]);

  const tickRange = useMemo(() => {
    const ticks = pool.bins.flatMap(bin => [bin.minTick, bin.maxTick]);
    const min = Math.min(...ticks);
    const max = Math.max(...ticks);
    return [min, max];
  }, [pool.bins]);

  const minTickPosition = useMemo(() => {
    const [min, max] = tickRange;
    const currentTick = position.pool.currentTick;
    if (position.tickLower === currentTick) {
      return 0;
    }
    if (position.tickLower < currentTick) {
      return (position.tickLower - min) / (currentTick - min) * (GRAPH_WIDTH / 2);
    }
    return (position.tickLower - currentTick) / (max - currentTick) * (GRAPH_WIDTH / 2) + (GRAPH_WIDTH / 2);
  }, [GRAPH_WIDTH, position.pool.currentTick, position.tickLower, tickRange]);

  const maxTickPosition = useMemo(() => {
    const [min, max] = tickRange;
    const currentTick = position.pool.currentTick;
    if (position.tickUpper === currentTick) {
      return 0;
    }
    if (position.tickUpper < currentTick) {
      return (position.tickUpper - min) / (currentTick - min) * (GRAPH_WIDTH / 2);
    }
    return (position.tickUpper - currentTick) / (max - currentTick) * (GRAPH_WIDTH / 2) + (GRAPH_WIDTH / 2);
  }, [GRAPH_WIDTH, position.pool.currentTick, position.tickUpper, tickRange]);
  
  const minPriceStr = useMemo(() => {
    const tokenAPrice = tokenPrices[tokenA.path]?.usd || "0";
    const tokenAPriceStr = numberToFormat(tokenAPrice, 6);
    return `1 ${tokenA.symbol} = ${tokenAPriceStr}`;
  }, [tokenB.path, tokenB.symbol, tokenPrices, tokenA.path, tokenA.symbol]);

  const maxPriceStr = useMemo(() => {
    const tokenBPrice = tokenPrices[tokenB.path]?.usd || "0";
    const tokenBPriceStr = numberToFormat(tokenBPrice, 6);
    return `${tokenBPriceStr}`;
  }, [tokenB.path, tokenB.symbol, tokenPrices, tokenA.path, tokenA.symbol]);

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

  const isMinTickGreen = useMemo(() => {
    if (!getMinTick) {
      return true;
    }
    return BigNumber(getMinTick).isGreaterThanOrEqualTo(GRAPH_WIDTH / 2);
  }, [getMinTick, GRAPH_WIDTH]);

  const isMaxTickGreen = useMemo(() => {
    if (!getMaxTick) {
      return true;
    }
    return BigNumber(getMaxTick).isGreaterThanOrEqualTo(GRAPH_WIDTH / 2);
  }, [getMaxTick]);

  const startClass = useMemo(() => {
    if (getMinTick === null) {
      return null;
    }
    return isMinTickGreen ? "positive" : "negative";
  }, [getMinTick, isMinTickGreen]);

  const endClass = useMemo(() => {
    if (getMaxTick === null) {
      return "";
    }
    return isMaxTickGreen ? "positive" : "negative";
  }, [getMaxTick, isMaxTickGreen]);

  return (
    <MyPositionCardWrapperBorder
      className={`${position.staked ? "special-card" : ""}`}
      viewMyRange={viewMyRange}
    >
      <div className="base-border">
        <MyPositionCardWrapper
          staked={position.staked}
          onClick={() => movePoolDetail(pool.id)}
        >
          <div className="title-wrapper">
            <div className="box-header">
              <DoubleLogo
                left={tokenA.logoURI}
                right={tokenB.logoURI}
                leftSymbol={tokenA.symbol}
                rightSymbol={tokenB.symbol}
                size={24}
              />
              <span>{`${tokenA.symbol}/${tokenB.symbol}`}</span>
              <div className="badge-group">
                <Badge
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={feeRateStr}
                />
                
              </div>
            </div>
            <RangeBadge
              status={
                inRange
                  ? RANGE_STATUS_OPTION.IN
                  : RANGE_STATUS_OPTION.OUT
              }
            />
          </div>
          <div className="list-wrapper">
            <div className="list-header">
              <span className="label-text">{POSITION_CONTENT_LABEL.VALUE}</span>
              <span className="label-text">{POSITION_CONTENT_LABEL.APR}</span>
            </div>
            <div className="list-content">
              <span>{positionUsdValueStr}</span>
              {aprStr}
            </div>
            <div className="list-header mt-4">
              <span className="label-text">{POSITION_CONTENT_LABEL.DAILY}</span>
              <span className="label-text">{POSITION_CONTENT_LABEL.CLAIMABLE}</span>
            </div>
            <div className="list-content">
              <span>$200</span>
              $1.50K
            </div>
          </div>
          <div className="view-my-range">
            <span onClick={onClickViewRange}>View my range <IconStrokeArrowUp /></span>
          </div>
          <div className={`pool-price-graph ${viewMyRange ? "open" : ""}`} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="view-my-range">
              <span onClick={onClickViewRange}>Hide my range <IconStrokeArrowDown /></span>
            </div>
            <div className="chart-wrapper">
              <BarAreaGraph
                width={GRAPH_WIDTH}
                height={GRAPH_HEIGHT}
                currentTick={pool.currentTick}
                minLabel={minTickLabel}
                maxLabel={maxTickLabel}
                minTick={minTickPosition}
                maxTick={maxTickPosition}
                bins={pool.bins}
                tokenA={tokenA}
                tokenB={tokenB}
                isHiddenStart={isHiddenStart}
                currentIndex={currentIndex}
                themeKey={themeKey}
                minTickRate={minTickRate}
                maxTickRate={maxTickRate}
              />
            </div>
            <div className="min-max-price">
                <p className={`label-text ${startClass}`}>{minPriceStr}(<span>{startClass === "positive" ? "+" : "-"}{minTickLabel}</span>) ~</p>
                <p className={`label-text ${endClass}`}>{maxPriceStr}(<span>{endClass === "positive" ? "+" : "-"}{maxTickLabel}</span>){tokenB.symbol}</p>
            </div>
          </div>
        </MyPositionCardWrapper>
      </div>
    </MyPositionCardWrapperBorder>
  );
};

export default MyPositionCard;
