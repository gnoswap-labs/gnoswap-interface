import { PoolBinModel } from "@models/pool/pool-bin-model";
import { TokenModel } from "@models/token/token-model";
import React, { useMemo } from "react";
import PoolGraph from "../pool-graph/PoolGraph";
import { BarAreaGraphWrapper } from "./BarAreaGraph.styles";
import { PoolModel } from "@models/pool/pool-model";

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
  pool: PoolModel;
}

const VIEWPORT_DEFAULT_WIDTH = 400;
const VIEWPORT_DEFAULT_HEIGHT = 200;

const BarAreaGraph: React.FC<BarAreaGraphProps> = ({
  className = "",
  bins,
  width = VIEWPORT_DEFAULT_WIDTH,
  height = VIEWPORT_DEFAULT_HEIGHT,
  currentTick,
  minTick,
  maxTick,
  tokenA,
  tokenB,
  themeKey,
  pool
}) => {

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
        maxTickPosition={maxTickPosition}
        minTickPosition={minTickPosition}
        poolPrice={pool?.price || 1}
      />
    </BarAreaGraphWrapper>
  );
};

export default BarAreaGraph;
