import { INCENTIVIZED_TYPE, RANGE_STATUS_OPTION, SwapFeeTierInfoMap } from "@constants/option.constant";
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
import OverlapTokenLogo from "../overlap-token-logo/OverlapTokenLogo";
import { isMaxTick, isMinTick } from "@utils/pool-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

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
  const GRAPH_WIDTH = mobile ? 226 : 258;
  const GRAPH_HEIGHT = 80;
  const { pool } = position;
  const { tokenA, tokenB } = pool;
  const [isHiddenStart, setIsHiddenStart] = useState(false);
  const { tokenPrices } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

  const inRange = useMemo(() => {
    return pool.currentTick <= position.tickUpper && pool.currentTick >= position.tickLower;
  }, [pool.currentTick, position.tickLower, position.tickUpper]);

  const feeRateStr = useMemo(() => {
    const rateStr = SwapFeeTierInfoMap[makeSwapFeeTierByTickSpacing(pool.tickSpacing)].rateStr;
    return `${rateStr} Fee`;
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
    return `${minTickRate * -1}%`;
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
    const tokenAPriceStr = numberToFormat(tokenAPrice, 2);
    return `1 ${tokenA.symbol} = ${tokenAPriceStr} ${tokenB.symbol}`;
  }, [tokenB.path, tokenB.symbol, tokenPrices, tokenA.path, tokenA.symbol]);

  const maxPriceStr = useMemo(() => {
    const tokenBPrice = tokenPrices[tokenB.path]?.usd || "0";
    const tokenBPriceStr = numberToFormat(tokenBPrice, 2);
    return `1 ${tokenA.symbol} = ${tokenBPriceStr} ${tokenB.symbol}`;
  }, [tokenB.path, tokenB.symbol, tokenPrices, tokenA.path, tokenA.symbol]);

  const handleClickShowRange = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsHiddenStart(!isHiddenStart);
  };

  const incentivizedLabel = useMemo(() => {
    if (pool.incentivizedType === "NONE_INCENTIVIZED") {
      return null;
    }
    return INCENTIVIZED_TYPE["INCENTIVIZED"];
  }, [pool.incentivizedType]);

  const rewardTokensInfo = useMemo(() => {
    return pool.rewardTokens.map((item) => {
      return {
        ...item,
        logoURI: getGnotPath(item).logoURI,
      };
    });
  }, [pool.rewardTokens]);

  return (
    <MyPositionCardWrapperBorder
      className={`${position.staked ? "special-card" : ""}`}
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
              />
              <span>{`${tokenA.symbol}/${tokenB.symbol}`}</span>
            </div>
            <div className="badge-group">
              {incentivizedLabel && (
                <Badge
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={<>
                    {incentivizedLabel}
                    <OverlapTokenLogo tokens={rewardTokensInfo} size={16} />
                  </>}
                />
              )}
              <Badge
                type={BADGE_TYPE.DARK_DEFAULT}
                text={feeRateStr}
              />
            </div>
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
          </div>
          <div className="pool-price-graph" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="price-range-info">
              <div className="current-price" onClick={handleClickShowRange}>
                <span>{isHiddenStart ? "Show Range" : "Hide Range"}</span>
              </div>
              <RangeBadge
                status={
                  inRange
                    ? RANGE_STATUS_OPTION.IN
                    : RANGE_STATUS_OPTION.OUT
                }
              />
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
              <div className="price-section">
                <span className="label-text">
                  {POSITION_CONTENT_LABEL.MIN_PRICE}
                </span>
                <span className="label-text">{minPriceStr}</span>
              </div>
              <div className="price-section">
                <span className="label-text">
                  {POSITION_CONTENT_LABEL.MAX_PRICE}
                </span>
                <span className="label-text">{maxPriceStr}</span>
              </div>
            </div>
          </div>
        </MyPositionCardWrapper>
      </div>
    </MyPositionCardWrapperBorder>
  );
};

export default MyPositionCard;
