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
  positionBins: PoolBinModel[];
  poolBins: PoolBinModel[];
}

const VIEWPORT_DEFAULT_WIDTH = 400;
const VIEWPORT_DEFAULT_HEIGHT = 200;

const BarAreaGraph: React.FC<BarAreaGraphProps> = ({
  className = "",
  positionBins,
  width = VIEWPORT_DEFAULT_WIDTH,
  height = VIEWPORT_DEFAULT_HEIGHT,
  currentTick,
  minTick,
  maxTick,
  tokenA,
  tokenB,
  themeKey,
  pool,
  poolBins,
}) => {
  const isHideBar = useMemo(() => {
    const isAllReserveZeroBin40 = poolBins.every(
      item =>
        Number(item.reserveTokenA) === 0 && Number(item.reserveTokenB) === 0,
    );
    const isAllReserveZeroBin = positionBins.every(
      item =>
        Number(item.reserveTokenA) === 0 && Number(item.reserveTokenB) === 0,
    );

    return isAllReserveZeroBin40 && isAllReserveZeroBin;
  }, [poolBins, positionBins]);

  return (
    <BarAreaGraphWrapper className={className} width={width} height={height}>
      <PoolGraph
        currentTick={currentTick !== undefined ? currentTick : null}
        width={width}
        height={height}
        bins={poolBins}
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
        binsMyAmount={positionBins}
        disabled={isHideBar}
      />
    </BarAreaGraphWrapper>
  );
};

export default BarAreaGraph;
