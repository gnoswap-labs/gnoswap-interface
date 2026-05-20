import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import * as uuid from "uuid";

import { FloatingPosition } from "@hooks/common/use-floating-tooltip";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { TokenModel } from "@models/token/token-model";
import { makeDisplayPrice } from "@utils/pool-utils";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import { tickToPrice } from "@utils/swap-utils";
import FloatingTooltip from "../tooltip/FloatingTooltip";

import PoolGraphSVG from "./pool-graph-svg/PoolGraphSVG";
import PoolGraphTooltip from "./pool-graph-tooltip/PoolGraphTooltip";
import { PoolGraphWrapper } from "./PoolGraph.styles";
import { ReservedBin, TooltipInfo } from "./PoolGraph.types";

export interface PoolGraphProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  bins: PoolBinModel[];
  currentTick?: number | null;
  mouseover?: boolean;
  zoomable?: boolean;
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
  maxTickPosition?: number | null;
  minTickPosition?: number | null;
  poolPrice: number;
  isPosition?: boolean;
  binsMyAmount?: PoolBinModel[];
  isReversed?: boolean;
  disabled?: boolean;
  shiftIndex?: number;
  displayBinCount?: number;
  zoomLevel?: number;
  disableBlackBars?: boolean;
}

const PoolGraph: React.FC<PoolGraphProps> = ({
  tokenA,
  tokenB,
  bins = [],
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
  maxTickPosition = 0,
  minTickPosition = 0,
  poolPrice,
  isPosition = false,
  binsMyAmount = [],
  isReversed = false,
  disabled = true,
  displayBinCount = 40,
  shiftIndex = 0,
  zoomLevel = 0,
  disableBlackBars = true,
}) => {
  const graphIdRef = useRef(uuid.v4());
  const graphId = graphIdRef.current.toString();
  const getBinId = useCallback((index: number) => `pool-graph-bin-${graphId}-${index}`, [graphId]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const lastHoverBinIndexRef = useRef<number | undefined>();

  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom;

  // D3 - Dimension Definition
  const defaultMinX = React.useMemo(() => Math.min(...bins.map(bin => bin.minTick)), [bins]);
  const reservedBins: ReservedBin[] = useMemo(() => {
    const length = bins.length / 2;
    const fullLength = length * 2;

    const convertReserveBins = bins.map((item, index) => {
      const reserveTokenAMap = Number(item.reserveTokenB) / (Number(poolPrice) || 1);
      const reserveTokenBMap = Number(item.reserveTokenA);

      return {
        ...item,
        reserveTokenAMyAmount: binsMyAmount?.[index]?.reserveTokenA || 0,
        reserveTokenBMyAmount: binsMyAmount?.[index]?.reserveTokenB || 0,
        reserveTokenAMap: index < length ? reserveTokenAMap : reserveTokenBMap,
        index: index,
      };
    });

    const maxHeight = d3.max(convertReserveBins, bin => bin.reserveTokenAMap) || 0;

    const reserveBins = convertReserveBins
      .sort((b1, b2) => b1.minTick - b2.minTick)
      .map(bin => {
        return {
          ...bin,
          minTick: bin.minTick - defaultMinX,
          maxTick: bin.maxTick - defaultMinX,
          reserveTokenMap: (bin.reserveTokenAMap * boundsHeight) / maxHeight,
          minTickSwap: bin.minTick - defaultMinX,
          maxTickSwap: bin.maxTick - defaultMinX,
        };
      });

    if (!isReversed) {
      return reserveBins;
    }

    const reverseReserveBins = reserveBins.map((item, i) => ({
      ...reserveBins[length * 2 - i - 1],
      minTick: item.minTick,
      maxTick: item.maxTick,
      minTickSwap: reserveBins[fullLength - i - 1].minTick,
      maxTickSwap: reserveBins[fullLength - i - 1].maxTick,
    }));
    return reverseReserveBins;
  }, [bins, isReversed, poolPrice, binsMyAmount.length]);

  const displayBins = useMemo(() => {
    const centerIndex = reservedBins.length / 2;
    const displaySideBinCount = displayBinCount / 2;

    const sliceStartIndex =
      centerIndex - displaySideBinCount + shiftIndex >= 0 ? centerIndex - displaySideBinCount + shiftIndex : 0;

    const sliceEndIndex =
      centerIndex + displaySideBinCount + shiftIndex < reservedBins.length
        ? centerIndex + displaySideBinCount + shiftIndex
        : reservedBins.length;

    return reservedBins.slice(sliceStartIndex, sliceEndIndex);
  }, [reservedBins, displayBinCount, shiftIndex]);

  const minX = useMemo(() => Math.min(...(displayBins.map(bin => bin.minTick) || 0)), [displayBins]);
  const maxX = useMemo(() => Math.max(...(displayBins.map(bin => bin.maxTick) || 0)), [displayBins]);
  const maxHeight = d3.max(reservedBins, bin => bin.reserveTokenMap) || 0;

  const currentTickRelative = useMemo(() => {
    if (currentTick === null) return null;
    return currentTick - defaultMinX;
  }, [currentTick, defaultMinX]);

  const scaleX = useMemo(() => {
    if (currentTickRelative === null) {
      return d3.scaleLinear().domain([minX, maxX]).range([margin.left, boundsWidth]);
    }

    const halfBinWidth = (maxX - minX) / displayBins.length / 2;
    const binWidth = halfBinWidth * 2;
    const halfDisplayRange = (displayBinCount / 2) * binWidth;

    const shiftOffset = shiftIndex * binWidth;

    return d3
      .scaleLinear()
      .domain([
        currentTickRelative - halfDisplayRange + shiftOffset,
        currentTickRelative + halfDisplayRange + shiftOffset,
      ])
      .range([margin.left, boundsWidth]);
  }, [currentTickRelative, minX, maxX, boundsWidth, margin.left, displayBins.length, displayBinCount, shiftIndex]);

  const scaleY = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, maxHeight || 0])
      .range([boundsHeight, 0]);
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
    if (displayBins.length < 2) {
      return 0;
    }
    const spacing = Math.abs(scaleX(displayBins[1].minTick) - scaleX(displayBins[0].minTick));
    if (spacing < 2) {
      return spacing;
    }
    return spacing;
  }, [displayBins, scaleX]);

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
      const minTick = currentBin.minTick + defaultMinX;
      const maxTick = currentBin.maxTick + defaultMinX;

      const minTickSwap = currentBin.minTickSwap + defaultMinX;
      const maxTickSwap = currentBin.maxTickSwap + defaultMinX;

      const tokenARange = {
        min: tickOfPrices.tokenA[!isReversed ? minTick : minTickSwap] || null,
        max: tickOfPrices.tokenA[!isReversed ? maxTick : maxTickSwap] || null,
      };
      const tokenBRange = {
        min: tickOfPrices.tokenB[!isReversed ? minTick : minTickSwap] || null,
        max: tickOfPrices.tokenB[!isReversed ? maxTick : maxTickSwap] || null,
      };
      const index = currentBin.index;

      const tokenAAmountStr = currentBin.reserveTokenA;
      const tokenBAmountStr = currentBin.reserveTokenB;
      const depositTokenAAmountStr = currentBin?.reserveTokenAMyAmount;
      const depositTokenBAmountStr = currentBin?.reserveTokenBMyAmount;
      let disabledBin = !!(
        maxTickPosition != null &&
        minTickPosition != null &&
        (scaleX(currentBin.minTick) < minTickPosition - binSpacing || scaleX(currentBin.minTick) > maxTickPosition)
      );
      if (isReversed) {
        disabledBin = !!(
          maxTickPosition != null &&
          minTickPosition != null &&
          (scaleX(currentBin.minTick) < scaleX(maxX) - maxTickPosition - binSpacing ||
            scaleX(currentBin.minTick) > scaleX(maxX) - minTickPosition)
        );
      }

      const tokenAAmount = tokenAAmountStr
        ? formatTokenExchangeRate(tokenAAmountStr.toString(), {
            maxSignificantDigits: tokenA.decimals + 1,
            minLimit: 0.000001,
          })
        : "-";
      const tokenBAmount = tokenBAmountStr
        ? formatTokenExchangeRate(tokenBAmountStr.toString(), {
            maxSignificantDigits: tokenB.decimals + 1,
            minLimit: 0.000001,
          })
        : "-";
      const depositTokenAAmount =
        index < 20
          ? "-"
          : index > 19 && `${currentBin.reserveTokenAMyAmount}` === "0"
          ? "<0.000001"
          : formatTokenExchangeRate(depositTokenAAmountStr.toString(), {
              maxSignificantDigits: tokenA.decimals + 1,
              minLimit: 0.000001,
            }) || "-";
      const depositTokenBAmount =
        index > 19
          ? "-"
          : index < 20 && `${currentBin.reserveTokenBMyAmount}` === "0"
          ? "<0.000001"
          : formatTokenExchangeRate(depositTokenBAmountStr.toString(), {
              maxSignificantDigits: tokenB.decimals + 1,
              minLimit: 0.000001,
            }) || "-";

      setTooltipInfo({
        tokenA,
        tokenB,
        tokenAAmount,
        tokenBAmount,
        depositTokenAAmount,
        depositTokenBAmount,
        tokenARange: tokenARange,
        tokenBRange: tokenBRange,
        tokenAPrice: tickOfPrices.tokenA[currentTick || 0],
        tokenBPrice: tickOfPrices.tokenB[currentTick || 0],
        disabled: disabledBin,
      });
      setPositionX(mouseX);
      setPositionY(mouseY);
    },
    [mouseover, tickOfPrices, reservedBins, binSpacing, currentTick],
  );

  function onMouseOutChartBin() {
    setPositionX(null);
    setPositionY(null);
  }

  useEffect(() => {
    if (bins.length > 0) {
      const formatDisplayPrice = (tick: number, baseToken: TokenModel, quoteToken: TokenModel) => {
        const displayPrice = makeDisplayPrice(tickToPrice(tick), baseToken, quoteToken);

        return formatTokenExchangeRate(displayPrice.toString(), {
          maxSignificantDigits: 7,
          minLimit: 0.000001,
        });
      };

      new Promise<{
        tokenA: { [key in number]: string };
        tokenB: { [key in number]: string };
      }>(resolve => {
        const tickOfPrices = bins
          .flatMap(bin => {
            const minTick = bin.minTick;
            const maxTick = bin.maxTick;
            return [minTick, maxTick];
          })
          .reduce<{
            tokenA: { [key in number]: string };
            tokenB: { [key in number]: string };
          }>((acc, current) => {
            if (!acc.tokenA[current]) {
              acc.tokenA[current] = formatDisplayPrice(current, tokenA, tokenB);
            }
            if (!acc.tokenB[current]) {
              acc.tokenB[current] = formatDisplayPrice(-current, tokenB, tokenA);
            }
            return acc;
          }, { tokenA: {}, tokenB: {} });
        resolve(tickOfPrices);
      }).then(setTickOfPrices);
    }
  }, [bins, tokenA, tokenB]);

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
          reservedBins={displayBins}
          maxTickPosition={maxTickPosition}
          minTickPosition={minTickPosition}
          isReversed={isReversed}
          disabled={disabled}
          themeKey={themeKey}
          binSpacing={binSpacing}
          scaleX={scaleX}
          scaleY={scaleY}
          zoomLevel={zoomLevel}
          currentTickRelative={currentTickRelative}
          d3Position={{
            minX,
            maxX,
            defaultMinX,
          }}
          onMouseMove={onMouseMoveChartBin}
          onMouseOut={onMouseOutChartBin}
          shiftIndex={shiftIndex}
          disableBlackBars={disableBlackBars}
        />
      </FloatingTooltip>
    </PoolGraphWrapper>
  );
};

export default React.memo(PoolGraph);
