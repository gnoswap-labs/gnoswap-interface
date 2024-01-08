import { PoolBinModel } from "@models/pool/pool-bin-model";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import React, { useCallback, useMemo } from "react";
import PoolGraph from "../pool-graph/PoolGraph";
import { BarAreaGraphLabel, BarAreaGraphWrapper } from "./BarAreaGraph.styles";
import { useColorGraph } from "@hooks/common/use-color-graph";

export interface BarAreaGraphData {
  value: string;
  time: string;
}

export interface BarAreaGraphProps {
  className?: string;
  strokeWidth?: number;
  bins: PoolBinModel[];
  currentTick?: number;
  minGap?: number;
  width?: number;
  height?: number;
  minLabel?: string;
  maxLabel?: string;
  minTick?: number;
  maxTick?: number;
  editable?: boolean;
  isHiddenStart?: boolean;
  currentIndex?: number;
  tokenA: TokenModel;
  tokenB: TokenModel;
  themeKey: "dark" | "light";
  minTickRate?: number;
  maxTickRate?: number;
}

const VIEWPORT_DEFAULT_WIDTH = 400;
const VIEWPORT_DEFAULT_HEIGHT = 200;

const BarAreaGraph: React.FC<BarAreaGraphProps> = ({
  className = "",
  isHiddenStart,
  bins,
  width = VIEWPORT_DEFAULT_WIDTH,
  height = VIEWPORT_DEFAULT_HEIGHT,
  currentTick,
  minLabel,
  maxLabel,
  minTick,
  maxTick,
  tokenA,
  tokenB,
  themeKey,
  minTickRate,
  maxTickRate,
}) => {
  const { redColor, greenColor } = useColorGraph();

  const getSelectorPoints = useCallback(() => {
    function estimateTick(tick: number) {
      if (tick < 0) return 0;
      if (tick > width) return width;
      return tick;
    }
    const currentMinTick = estimateTick(minTick || 0);
    const currentMaxTick = estimateTick(maxTick || 0);
    return `${currentMinTick},0 ${currentMinTick},${height} ${currentMaxTick},${height} ${currentMaxTick},0`;
  }, [minTick, maxTick, height, width]);

  const minTickPosition = useMemo(() => {
    if (!minTick) {
      return null;
    }
    if (minTick < 0) {
      return 0;
    }
    if (minTick > width) {
      return width;
    }
    return minTick;
  }, [minTick, width]);

  const maxTickPosition = useMemo(() => {
    if (!maxTick) {
      return null;
    }
    if (maxTick < 0) {
      return 0;
    }
    if (maxTick > width) {
      return width;
    }
    return maxTick;
  }, [maxTick, width]);

  const isMinTickGreen = useMemo(() => {
    if (!minTickPosition) {
      return true;
    }
    return BigNumber(minTickPosition).isGreaterThanOrEqualTo(width / 2);
  }, [minTickPosition, width]);

  const isMaxTickGreen = useMemo(() => {
    if (!maxTickPosition) {
      return true;
    }
    return BigNumber(maxTickPosition).isGreaterThanOrEqualTo(width / 2);
  }, [maxTickPosition, width]);

  const startColor = useMemo(() => {
    if (minTickPosition === null) {
      return null;
    }
    return isMinTickGreen ? greenColor : redColor;
  }, [minTickPosition, isMinTickGreen, redColor, greenColor]);

  const endColor = useMemo(() => {
    if (maxTickPosition === null) {
      return null;
    }
    return isMaxTickGreen ? greenColor : redColor;
  }, [maxTickPosition, isMaxTickGreen, redColor, greenColor]);

  function isAvailRange(rate: number) {
    if (rate < -90) {
      return false;
    }
    if (rate > 1000) {
      return false;
    }
    return true;
  }

  const visibleArea = minTickPosition !== null && maxTickPosition !== null && startColor && endColor && !isHiddenStart;

  const visiblieMinLabel =
    visibleArea && minTickRate && isAvailRange(minTickRate);

  const visiblieMaxLabel =
    visibleArea && maxTickRate && isAvailRange(maxTickRate);

  return (
    <BarAreaGraphWrapper
      className={className}
      width={width}
      height={height}
    >
      <PoolGraph
        currentTick={currentTick !== undefined ? currentTick : null}
        width={width}
        height={height}
        bins={bins}
        tokenA={tokenA}
        tokenB={tokenB}
        themeKey={themeKey}
        mouseover
        position="top"
        offset={40}
      />
      {visibleArea && (
        <svg className="selector" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="gradient-area" gradientTransform="rotate(0)">
              <stop offset="0%" stopColor={startColor.gradient} />
              <stop offset="100%" stopColor={endColor.gradient} />
            </linearGradient>
          </defs>
          <g>
            <line
              className="start-line"
              stroke={startColor.startLine}
              strokeWidth={2}
              x1={minTickPosition}
              y1={0}
              x2={minTickPosition}
              y2={height}
            />
          </g>
          <polygon
            className="area"
            fill={"url(#gradient-area)"}
            points={getSelectorPoints()}
          />
          <g className="endline-wrapper">
            <line
              className="end-line"
              stroke={endColor.startLine}
              strokeWidth={2}
              x1={maxTickPosition}
              y1={0}
              x2={maxTickPosition}
              y2={height}
            />
          </g>
        </svg>
      )}

      {visiblieMinLabel ? (
        <BarAreaGraphLabel
          className="min"
          x={minTickPosition}
          y={20}
          backgroundColor={startColor.start}
        >
          {minLabel}
        </BarAreaGraphLabel>
      ): null}
      {visiblieMaxLabel ? (
        <BarAreaGraphLabel
          className="max"
          x={maxTickPosition}
          y={20}
          backgroundColor={endColor.start}
        >
          {maxLabel}
        </BarAreaGraphLabel>
      ): null}

    </BarAreaGraphWrapper>
  );
};

export default BarAreaGraph;
