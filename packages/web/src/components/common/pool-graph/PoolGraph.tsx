import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as uuid from "uuid";

import { FloatingPosition } from "@hooks/common/use-floating-tooltip";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { PoolLiquiditySegmentModel } from "@models/pool/pool-liquidity-model";
import { TokenModel } from "@models/token/token-model";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import FloatingTooltip from "../tooltip/FloatingTooltip";

import PoolGraphSVG from "./pool-graph-svg/PoolGraphSVG";
import PoolGraphTooltip from "./pool-graph-tooltip/PoolGraphTooltip";
import { PoolGraphWrapper } from "./PoolGraph.styles";
import { ReservedBin, TooltipInfo } from "./PoolGraph.types";
import {
  createPoolGraphBins,
  formatPoolGraphTokenUsd,
  formatPoolGraphTooltipPrice,
  getPoolGraphTooltipTick,
} from "./PoolGraph.utils";

export interface PoolGraphProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  liquiditySegments: PoolLiquiditySegmentModel[];
  currentTick?: number | null;
  mouseover?: boolean;
  visibleLabel?: boolean;
  width: number;
  height: number;
  margin?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  themeKey: "dark" | "light";
  nextSpacing?: boolean;
  position?: FloatingPosition;
  offset?: number;
  isPosition?: boolean;
  positionLiquidity?: string | number | null;
  positionTickLower?: number | null;
  positionTickUpper?: number | null;
  isReversed?: boolean;
  disabled?: boolean;
  disableBlackBars?: boolean;
}

const PoolGraph: React.FC<PoolGraphProps> = ({
  tokenA,
  tokenB,
  liquiditySegments = [],
  currentTick = null,
  mouseover,
  width,
  height,
  margin = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  themeKey,
  nextSpacing = false,
  position,
  offset = 20,
  isPosition = false,
  positionLiquidity = null,
  positionTickLower = null,
  positionTickUpper = null,
  isReversed = false,
  disabled = true,
  disableBlackBars = true,
}) => {
  const graphIdRef = useRef(uuid.v4());
  const graphId = graphIdRef.current.toString();
  const getBinId = useCallback((index: number) => `pool-graph-bin-${graphId}-${index}`, [graphId]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const lastHoverBinIndexRef = useRef<number | undefined>();
  const { tokenPrices } = useTokenData();

  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom;

  const reservedBins: ReservedBin[] = useMemo(() => {
    return createPoolGraphBins({
      liquiditySegments,
      boundsHeight,
      tokenA,
      tokenB,
      currentTick,
      isReversed,
      positionLiquidity,
      positionTickLower,
      positionTickUpper,
    }).sort((left, right) => left.minTick - right.minTick);
  }, [
    liquiditySegments,
    boundsHeight,
    tokenA,
    tokenB,
    currentTick,
    isReversed,
    positionLiquidity,
    positionTickLower,
    positionTickUpper,
  ]);

  const minX = useMemo(() => {
    if (reservedBins.length === 0) {
      return 0;
    }
    return Math.min(...reservedBins.map(bin => bin.minTick));
  }, [reservedBins]);
  const maxX = useMemo(() => {
    const maxTick = reservedBins.length > 0 ? Math.max(...reservedBins.map(bin => bin.maxTick)) : 1;
    return maxTick === minX ? minX + 1 : maxTick;
  }, [reservedBins, minX]);
  const maxHeight = useMemo(() => {
    if (reservedBins.length === 0) {
      return 0;
    }
    return Math.max(...reservedBins.map(bin => bin.reserveTokenMap));
  }, [reservedBins]);

  const currentTickRelative = useMemo(() => {
    if (currentTick === null) return null;
    return isReversed ? -currentTick : currentTick;
  }, [currentTick, isReversed]);

  const scaleX = useMemo(() => {
    return (value: number) => margin.left + ((value - minX) / (maxX - minX)) * boundsWidth;
  }, [minX, maxX, boundsWidth, margin.left]);

  const scaleY = useMemo(() => {
    return (value: number) => {
      if (maxHeight <= 0) {
        return boundsHeight;
      }
      return boundsHeight - (value / maxHeight) * boundsHeight;
    };
  }, [boundsHeight, maxHeight]);

  const [tickOfPrices, setTickOfPrices] = useState<{
    tokenA: { [key in number]: string };
    tokenB: { [key in number]: string };
  }>({ tokenA: {}, tokenB: {} });
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const [positionX, setPositionX] = useState<number | null>(null);
  const [positionY, setPositionY] = useState<number | null>(null);

  const binSpacing = useMemo(() => {
    if (reservedBins.length < 1) {
      return 0;
    }
    if (reservedBins.length === 2) {
      return 20;
    }
    if (reservedBins.length < 2) {
      return 0;
    }
    const spacing = Math.abs(scaleX(reservedBins[1].minTick) - scaleX(reservedBins[0].minTick));
    if (spacing < 2) {
      return spacing;
    }
    return spacing;
  }, [reservedBins, scaleX]);

  const tooltipPosition = useMemo((): FloatingPosition => {
    if (position) {
      return position;
    }
    if (!positionX || !positionY) {
      return "top-start";
    }
    const isTop = positionY > height * 0.6;
    const isStart = positionX < width - 50;
    if (isTop) {
      return `top-${isStart ? "start" : "end"}`;
    }
    return `${isStart ? "right" : "left"}`;
  }, [width, height, positionX, positionY, position]);

  const onMouseMoveChartBin = useCallback(
    (event: MouseEvent) => {
      if (!mouseover || Object.keys(tickOfPrices.tokenA).length === 0) {
        return;
      }
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      const currentBin = reservedBins.find(bin => {
        if (mouseY < 0.000001 || mouseY > height) {
          return false;
        }
        const isHoveringCurrentBin = document.getElementById(getBinId(bin.index))?.matches(":hover");

        const isHoveringPreviousBin = document.getElementById(getBinId(bin.index - 1))?.matches(":hover");

        const isHoveringNextBin = document.getElementById(getBinId(bin.index + 1))?.matches(":hover");

        const hoveredBinIndex = (() => {
          if (isHoveringCurrentBin) return bin.index;

          if (isHoveringPreviousBin) return bin.index - 1;

          if (isHoveringNextBin) return bin.index + 1;
        })();

        if (hoveredBinIndex !== 0 && !hoveredBinIndex) return false;

        return bin.index === hoveredBinIndex;
      });

      if (!currentBin) {
        lastHoverBinIndexRef.current = -1;
        setPositionX(null);
        setPositionY(null);

        if (!nextSpacing) {
          setTooltipInfo(null);
        }
        return;
      }

      // Only updates the position when the hovered area is the same bar and has tooltip information.
      if (currentBin.index === lastHoverBinIndexRef.current) {
        if (tooltipInfo) {
          setPositionX(mouseX);
          setPositionY(mouseY);
          return;
        }
      }

      lastHoverBinIndexRef.current = currentBin.index;

      if (
        Math.abs(height - mouseY - 0.0001) >
        boundsHeight -
          scaleY(currentBin.reserveTokenMap) +
          (scaleY(currentBin.reserveTokenMap) > height - 3 && scaleY(currentBin.reserveTokenMap) !== height ? 3 : 0)
      ) {
        setPositionX(null);
        setPositionY(null);
        setTooltipInfo(null);
        return;
      }
      const tooltipTick = getPoolGraphTooltipTick(currentBin, currentTick);

      const tokenAAmountStr = currentBin.reserveTokenA;
      const tokenBAmountStr = currentBin.reserveTokenB;
      const positionTokenAAmountStr = currentBin?.reserveTokenAMyAmount;
      const positionTokenBAmountStr = currentBin?.reserveTokenBMyAmount;
      const hasNoPositionLiquidity = !disableBlackBars && isPosition && !currentBin.isPositionActive;

      const tokenAAmount = tokenAAmountStr
        ? formatTokenExchangeRate(tokenAAmountStr, {
            maxSignificantDigits: tokenA.decimals + 1,
            minLimit: 0.000001,
          })
        : "-";
      const tokenBAmount = tokenBAmountStr
        ? formatTokenExchangeRate(tokenBAmountStr, {
            maxSignificantDigits: tokenB.decimals + 1,
            minLimit: 0.000001,
          })
        : "-";
      const positionTokenAAmount =
        !positionTokenAAmountStr || hasNoPositionLiquidity
          ? "0"
          : formatTokenExchangeRate(positionTokenAAmountStr, {
              maxSignificantDigits: tokenA.decimals + 1,
              minLimit: 0.000001,
            }) || "0";
      const positionTokenBAmount =
        !positionTokenBAmountStr || hasNoPositionLiquidity
          ? "0"
          : formatTokenExchangeRate(positionTokenBAmountStr, {
              maxSignificantDigits: tokenB.decimals + 1,
              minLimit: 0.000001,
            }) || "0";
      const positionTokenAUsd = formatPoolGraphTokenUsd(
        hasNoPositionLiquidity ? "0" : positionTokenAAmountStr,
        tokenA,
        tokenPrices,
      );
      const positionTokenBUsd = formatPoolGraphTokenUsd(
        hasNoPositionLiquidity ? "0" : positionTokenBAmountStr,
        tokenB,
        tokenPrices,
      );

      setTooltipInfo({
        tokenA,
        tokenB,
        tokenAAmount,
        tokenBAmount,
        tokenAUsd: formatPoolGraphTokenUsd(tokenAAmountStr, tokenA, tokenPrices),
        tokenBUsd: formatPoolGraphTokenUsd(tokenBAmountStr, tokenB, tokenPrices),
        positionTokenAAmount,
        positionTokenBAmount,
        positionTokenAUsd,
        positionTokenBUsd,
        tokenAVisible: currentBin.reserveTokenAVisible,
        tokenBVisible: currentBin.reserveTokenBVisible,
        positionTokenAVisible: currentBin.positionReserveTokenAVisible,
        positionTokenBVisible: currentBin.positionReserveTokenBVisible,
        isPositionActive: currentBin.isPositionActive,
        positionLiquidityShare: hasNoPositionLiquidity ? "0%" : currentBin.positionLiquidityShare,
        price: tickOfPrices.tokenA[tooltipTick],
        disabled: false,
      });
      setPositionX(mouseX);
      setPositionY(mouseY);
    },
    [
      mouseover,
      tickOfPrices,
      reservedBins,
      binSpacing,
      currentTick,
      disableBlackBars,
      isPosition,
      tokenA,
      tokenB,
      tokenPrices,
    ],
  );

  function onMouseOutChartBin() {
    setPositionX(null);
    setPositionY(null);
  }

  useEffect(() => {
    if (reservedBins.length > 0) {
      new Promise<{
        tokenA: { [key in number]: string };
        tokenB: { [key in number]: string };
      }>(resolve => {
        const tickOfPrices = reservedBins
          .flatMap(bin => {
            const tooltipTick = getPoolGraphTooltipTick(bin, currentTick);
            return [bin.sourceMinTick, tooltipTick];
          })
          .reduce<{
            tokenA: { [key in number]: string };
            tokenB: { [key in number]: string };
          }>(
            (acc, current) => {
              if (!acc.tokenA[current]) {
                acc.tokenA[current] = formatPoolGraphTooltipPrice(current, tokenA, tokenB);
              }
              if (!acc.tokenB[current]) {
                acc.tokenB[current] = formatPoolGraphTooltipPrice(-current, tokenB, tokenA);
              }
              return acc;
            },
            { tokenA: {}, tokenB: {} },
          );
        resolve(tickOfPrices);
      }).then(setTickOfPrices);
      return;
    }
    setTickOfPrices({ tokenA: {}, tokenB: {} });
  }, [reservedBins, tokenA, tokenB]);

  useEffect(() => {
    if (tooltipInfo) {
      window.addEventListener("scroll", onMouseOutChartBin);
      return () => window.removeEventListener("scroll", onMouseOutChartBin);
    }
  }, [tooltipInfo]);

  return (
    <PoolGraphWrapper>
      <FloatingTooltip
        className="chart-tooltip"
        isHiddenArrow
        position={tooltipPosition}
        offset={offset}
        content={
          !!tooltipInfo && !disabled ? (
            <div ref={tooltipRef} className={`tooltip-container ${themeKey}-shadow`}>
              <PoolGraphTooltip tooltipInfo={tooltipInfo} isPosition={isPosition} disabled={disabled} />
            </div>
          ) : null
        }
      >
        <PoolGraphSVG
          ref={svgRef}
          graphId={graphId}
          width={width}
          height={height}
          margin={margin}
          currentTick={currentTick}
          reservedBins={reservedBins}
          isReversed={isReversed}
          isPosition={isPosition}
          disabled={disabled}
          themeKey={themeKey}
          binSpacing={binSpacing}
          scaleX={scaleX}
          scaleY={scaleY}
          currentTickRelative={currentTickRelative}
          d3Position={{
            minX,
            maxX,
          }}
          onMouseMove={onMouseMoveChartBin}
          onMouseOut={onMouseOutChartBin}
          disableBlackBars={disableBlackBars}
        />
      </FloatingTooltip>
    </PoolGraphWrapper>
  );
};

export default React.memo(PoolGraph);
