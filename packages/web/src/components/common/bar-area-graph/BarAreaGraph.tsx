import { PoolLiquiditySegmentModel } from "@models/pool/pool-liquidity-model";
import { TokenModel } from "@models/token/token-model";
import React, { useMemo } from "react";
import PoolGraph from "../pool-graph/PoolGraph";
import { BarAreaGraphWrapper } from "./BarAreaGraph.styles";

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
  liquiditySegments: PoolLiquiditySegmentModel[];
  positionLiquidity?: string | number | null;
  positionTickLower?: number | null;
  positionTickUpper?: number | null;
  disableBlackBars: boolean;
}

const VIEWPORT_DEFAULT_WIDTH = 400;
const VIEWPORT_DEFAULT_HEIGHT = 200;

const BarAreaGraph: React.FC<BarAreaGraphProps> = ({
  className = "",
  width = VIEWPORT_DEFAULT_WIDTH,
  height = VIEWPORT_DEFAULT_HEIGHT,
  currentTick,
  tokenA,
  tokenB,
  themeKey,
  liquiditySegments,
  positionLiquidity,
  positionTickLower,
  positionTickUpper,
  disableBlackBars,
}) => {
  const isHideBar = useMemo(() => {
    const hasPositionLiquidity = Number(positionLiquidity ?? 0) > 0;
    return liquiditySegments.length === 0 && !hasPositionLiquidity;
  }, [liquiditySegments.length, positionLiquidity]);

  return (
    <BarAreaGraphWrapper className={className} width={width} height={height}>
      <PoolGraph
        currentTick={currentTick !== undefined ? currentTick : null}
        width={width}
        height={height}
        liquiditySegments={liquiditySegments}
        tokenA={tokenA}
        tokenB={tokenB}
        themeKey={themeKey}
        mouseover
        position="top"
        offset={40}
        isPosition
        positionLiquidity={positionLiquidity}
        positionTickLower={positionTickLower}
        positionTickUpper={positionTickUpper}
        disabled={isHideBar}
        disableBlackBars={disableBlackBars}
      />
    </BarAreaGraphWrapper>
  );
};

export default BarAreaGraph;
