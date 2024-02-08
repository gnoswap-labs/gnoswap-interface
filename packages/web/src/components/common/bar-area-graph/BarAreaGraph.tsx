import { PoolBinModel } from "@models/pool/pool-bin-model";
import { TokenModel } from "@models/token/token-model";
import React from "react";
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
  binsMyAmount: PoolBinModel[];
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
  pool,
  binsMyAmount,
}) => {

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
        maxTickPosition={maxTick}
        minTickPosition={minTick}
        poolPrice={pool?.price || 1}
        isPosition
        binsMyAmount={binsMyAmount || []}
      />
    </BarAreaGraphWrapper>
  );
};

export default BarAreaGraph;
