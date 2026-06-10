import { useTheme } from "@emotion/react";
import BigNumber from "bignumber.js";
import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as uuid from "uuid";
import { EventBlocker, PoolSelectionGraphTooltipWrapper, PoolSelectionGraphWrapper } from "./PoolSelectionGraph.styles";

import { LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES } from "@constants/graph.constant";
import { SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { useColorGraph } from "@hooks/common/use-color-graph";
import { FloatingPosition } from "@hooks/common/use-floating-tooltip";
import { PoolLiquiditySegmentModel } from "@models/pool/pool-liquidity-model";
import { TokenModel } from "@models/token/token-model";
import { makeDisplayPrice } from "@utils/pool-utils";
import { convertToKMB, formatTokenExchangeRate } from "@utils/stake-position-utils";
import { displayTickNumber } from "@utils/string-utils";
import { priceToTick, tickToPrice } from "@utils/swap-utils";

import FloatingTooltip from "../tooltip/FloatingTooltip";
import { PoolSelectionGraphBinTooptip, TooltipInfo } from "./PoolSelectionGraphBinTooltip";
import {
  createPoolSelectionGraphBins,
  getPoolSelectionGraphEmptyTickWindow,
  getPoolSelectionGraphTooltipTick,
} from "./PoolSelectionGraph.utils";

const MIN_VISIBLE_BAR_HEIGHT = 5;

const getVisibleBarDimensions = (scaleYComputation: number, boundsHeight: number) => {
  const rawHeight = Math.max(0, boundsHeight - scaleYComputation);
  const visibleHeight = rawHeight > 0 ? Math.max(rawHeight, MIN_VISIBLE_BAR_HEIGHT) : 0;

  return {
    y: boundsHeight - visibleHeight,
    height: visibleHeight,
  };
};

interface SelectionColor {
  startPercent: string;
  endPercent: string;
  start: string;
  end: string;
  lineStart: string;
  lineEnd: string;
  badgeStart: string;
  badgeEnd: string;
}

interface ResolveBinModel {
  index: number;
  height: number;
  positionX: number;
  minTick: number;
  maxTick: number;
  reserveTokenA: number;
  reserveTokenB: number;
}

export interface PoolSelectionGraphProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  liquiditySegments: PoolLiquiditySegmentModel[];
  feeTier: SwapFeeTierType;
  tickSpacing: number;
  mouseover?: boolean;
  zoomLevel: number;
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
  position?: FloatingPosition;
  offset?: number;
  price: number;
  flip?: boolean;
  showBar?: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  fullRange: boolean;
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  onFinishMove?: () => void;
}

const PoolSelectionGraph: React.FC<PoolSelectionGraphProps> = ({
  tokenA,
  tokenB,
  liquiditySegments = [],
  feeTier,
  tickSpacing,
  width,
  height,
  zoomLevel,
  margin = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  position,
  price,
  flip,
  fullRange,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  onFinishMove,
}) => {
  const { themeKey } = useTheme();
  const graphIdRef = useRef(uuid.v4());
  const graphId = graphIdRef.current.toString();
  const svgRef = useRef<SVGSVGElement>(null);
  const chartRef = useRef(null);
  const brushRef = useRef<SVGGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [priceOfTick, setPriceOfTick] = useState<{
    tokenA: { [key in number]: string };
    tokenB: { [key in number]: string };
  }>({ tokenA: {}, tokenB: {} });
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const [positionX, setPositionX] = useState<number | null>(null);
  const [positionY, setPositionY] = useState<number | null>(null);
  const [hoverBarIndex, setHoverBarIndex] = useState<number | null>(null);

  const { redColor, greenColor } = useColorGraph();

  const displayTokenA = useMemo(() => (flip ? tokenB : tokenA), [flip, tokenA, tokenB]);
  const displayTokenB = useMemo(() => (flip ? tokenA : tokenB), [flip, tokenA, tokenB]);

  const [selectionColor, setSelectionColor] = useState<SelectionColor>(getSelectionColor("0", "0"));

  const displayLabels = 8;
  const labelHeight = displayLabels > 0 ? 20 : 0;

  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom - labelHeight;

  const swapFeeTierMaxPriceRange = useMemo(() => {
    return SwapFeeTierMaxPriceRangeMap[feeTier];
  }, [feeTier]);

  const currentPrice = useMemo(() => {
    return price;
  }, [price]);

  const graphBins = useMemo(() => createPoolSelectionGraphBins(liquiditySegments, flip), [liquiditySegments, flip]);

  const currentTick = useMemo(() => {
    if (Number.isNaN(currentPrice)) {
      return 0;
    }
    return priceToTick(currentPrice);
  }, [currentPrice]);

  const emptyTickWindow = useMemo(
    () =>
      getPoolSelectionGraphEmptyTickWindow({
        currentTick,
        visibleTickRange: LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[zoomLevel] ?? LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[0],
        minTick: swapFeeTierMaxPriceRange.minTick,
        maxTick: swapFeeTierMaxPriceRange.maxTick,
      }),
    [currentTick, swapFeeTierMaxPriceRange.maxTick, swapFeeTierMaxPriceRange.minTick, zoomLevel],
  );

  const graphMinTick = useMemo(() => {
    if (graphBins.length === 0) {
      return emptyTickWindow.minTick;
    }
    return Math.min(...graphBins.map(bin => bin.minTick));
  }, [emptyTickWindow.minTick, graphBins]);

  // D3 - Dimension Definition
  const maxX = useMemo(() => {
    if (graphBins.length === 0) {
      return emptyTickWindow.maxTick;
    }

    const maxTick = Math.max(...graphBins.map(bin => bin.maxTick));
    return maxTick === graphMinTick ? graphMinTick + tickSpacing : maxTick;
  }, [emptyTickWindow.maxTick, graphBins, graphMinTick, tickSpacing]);

  const maxLiquidity = useMemo(() => {
    if (graphBins.length === 0) {
      return 0;
    }
    return Math.max(...graphBins.map(bin => bin.height));
  }, [graphBins]);

  // D3 - Scale Definition
  const defaultScaleX = d3
    .scaleLinear()
    .domain([0, maxX - graphMinTick])
    .range([0, boundsWidth]);

  const scaleX = defaultScaleX.copy();

  const xAxis = d3
    .axisBottom(scaleX)
    .tickSize(4)
    .tickPadding(4)
    .tickFormat(tick =>
      displayTickNumber([getInvertX(0) + graphMinTick, getInvertX(width) + graphMinTick], Number(tick) + graphMinTick),
    )
    .tickArguments([displayLabels]);

  const scaleY = d3
    .scaleLinear()
    .domain([0, maxLiquidity > 0 ? maxLiquidity : 1])
    .range([boundsHeight, 0]);

  const resolvedDisplayBins: ResolveBinModel[] = useMemo(() => {
    return graphBins.map((bin, index) => {
      return {
        index,
        height: bin.height,
        positionX: bin.minTick - graphMinTick,
        minTick: bin.minTick,
        maxTick: bin.maxTick,
        reserveTokenA: bin.reserveTokenA || 0,
        reserveTokenB: bin.reserveTokenB || 0,
      };
    });
  }, [graphBins, graphMinTick]);

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

  const minBrushX =
    scaleX(swapFeeTierMaxPriceRange.minTick - graphMinTick) >= -20
      ? scaleX(swapFeeTierMaxPriceRange.minTick - graphMinTick)
      : 0;
  const maxBrushX =
    scaleX(swapFeeTierMaxPriceRange.maxTick - graphMinTick) <= boundsWidth
      ? scaleX(swapFeeTierMaxPriceRange.maxTick - graphMinTick)
      : boundsWidth;

  const brush = d3
    .brushX()
    .extent([
      [minBrushX, 0],
      [maxBrushX, boundsHeight],
    ])
    .on("start brush", onBrushMove)
    .on("end", onBrushEnd);

  function getInvertX(x: number) {
    return Number(BigNumber(scaleX.invert(x)).toFixed(16));
  }

  function onBrushMove(this: SVGGElement, event: d3.D3BrushEvent<null>) {
    if (!brushRef.current) {
      return;
    }
    const selection = event.selection ? event.selection : [0, 0];
    const startPosition = selection[0] as number;
    const endPosition = selection[1] as number;

    const startPrice = tickToPrice(Math.round(scaleX.invert(startPosition) + graphMinTick));
    const endPrice = tickToPrice(Math.round(scaleX.invert(endPosition) + graphMinTick));

    const startRate = currentPrice ? ((Number(startPrice) - currentPrice) / currentPrice) * 100 : 0;
    const endRate = currentPrice ? ((Number(endPrice) - currentPrice) / currentPrice) * 100 : 0;

    const selectionColor = getSelectionColor(startRate >= 0 ? "1" : "-1", endRate >= 0 ? "1" : "-1");

    const brushElement = d3.select(brushRef.current);

    const startLine = brushElement.select("#start");
    if (event.type === "start") {
      if (startLine.select("svg").empty()) {
        const startSvg = startLine.append("svg");
        startSvg.append("line").attr("y1", 0).attr("y2", boundsHeight).attr("stroke-width", 2);
        makeLeftBadge(startSvg, false, selectionColor);
      }
    }

    const endLine = brushElement.select("#end");
    if (event.type === "start") {
      if (endLine.select("svg").empty()) {
        const endSvg = endLine.append("svg");
        endSvg.append("line").attr("y1", boundsHeight).attr("y2", 0).attr("stroke-width", 2);
        makeRightBadge(endSvg, fullRange, selectionColor);
      }
    }

    brushElement.selectAll(".resize").attr("x", data => (data === "w" ? startPosition : endPosition));

    const isRightStartLine = startPosition - 75 < 0;
    const isRightEndLine = endPosition + 75 < boundsWidth;

    setSelectionColor(current => (isSameSelectionColor(current, selectionColor) ? current : selectionColor));

    updateLine(brushElement, "start", startPosition, startRate, isRightStartLine, fullRange, selectionColor);
    updateLine(brushElement, "end", endPosition, endRate, isRightEndLine, fullRange, selectionColor);
  }

  function updateLine(
    selectionElement: d3.Selection<SVGGElement, unknown, null, undefined>,
    type: "start" | "end",
    x: number,
    rate: number,
    right = false,
    selectedFullRange = false,
    selectionColor: SelectionColor,
  ) {
    const hidden = type === "end" && selectedFullRange === true;
    const rateStr = `${rate > 0 ? "+" : ""}${Math.round(rate).toFixed(0)}%`;
    const lineColor = type === "start" ? selectionColor.lineStart : selectionColor.lineEnd;

    const lineElement = selectionElement.select(`#${type}`).attr("x", x);

    lineElement.select("svg").attr("x", 0).select("line").style("stroke", lineColor);

    const priceID = `${type}-price`;
    const color = type === "start" ? selectionColor.badgeStart : selectionColor.badgeEnd;
    const margin = right === false ? (type === "end" ? -51 : -62) : type === "end" ? 12 : 1;

    const labelWrapper = lineElement.select(`#${priceID}`);
    const labelText = !selectedFullRange ? rateStr : type === "start" ? "-100%" : "∞";

    labelWrapper
      .select("rect")
      .attr("x", margin)
      .attr("y", "0")
      .attr("width", "50")
      .attr("height", "23")
      .attr("rx", 5)
      .style("fill", color);

    labelWrapper
      .select("text")
      .attr("x", margin + 25)
      .attr("y", "0")
      .attr("dy", "15")
      .attr("text-anchor", "middle")
      .style("fill", "#FFF")
      .text(labelText);

    if (hidden) {
      labelWrapper.attr("display", "none");
    } else {
      labelWrapper.attr("display", null);
    }
  }

  function onBrushEnd(this: SVGGElement, event: d3.D3BrushEvent<unknown>) {
    if (!brushRef.current || event.mode === undefined) {
      return;
    }

    if (!!onFinishMove) {
      onFinishMove();
    }
    if (fullRange) {
      setMinPrice(null);
      setMaxPrice(null);
      return;
    }

    if (!event.selection) {
      d3.select(brushRef.current).selectAll(".resize").selectChildren().remove();
      setMinPrice(null);
      setMaxPrice(null);
    } else {
      const selection = event.selection ? event.selection : [0, 0];
      const startPosition = selection[0] as number;
      const endPosition = selection[1] as number;

      const currentPricePosition = scaleX(currentTick - graphMinTick);
      const selectionColor = getSelectionColor(
        startPosition >= currentPricePosition ? "1" : "-1",
        endPosition >= currentPricePosition ? "1" : "-1",
      );

      function getPriceBy(position: number) {
        const tickWithOffset = scaleX.invert(position);
        if (BigNumber(tickWithOffset).isNaN()) {
          return 0;
        }

        const tick = Math.round((tickWithOffset + graphMinTick) / tickSpacing) * tickSpacing;
        if (tick <= swapFeeTierMaxPriceRange.minTick) {
          return 0;
        }

        if (tick >= swapFeeTierMaxPriceRange.maxTick) {
          return swapFeeTierMaxPriceRange.maxPrice;
        }

        return tickToPrice(tick);
      }

      const minPrice = getPriceBy(startPosition);
      const maxPrice = getPriceBy(endPosition);

      setSelectionColor(current => (isSameSelectionColor(current, selectionColor) ? current : selectionColor));
      setMinPrice(minPrice);
      setMaxPrice(maxPrice);
    }
  }

  useEffect(() => {
    if (!brushRef.current) {
      return;
    }
    const brushElement = d3.select(brushRef.current).call(brush);
    brushElement
      .selectAll(".resize")
      .data([{ type: "w" }, { type: "e" }])
      .enter()
      .append("svg")
      .attr("id", d => (d.type === "w" ? "start" : "end"))
      .attr("width", "10")
      .attr("height", boundsHeight)
      .attr("cursor", "ew-resize")
      .attr("class", d => "resize handle--custom handle--" + d.type);
  }, [boundsHeight, brush, brushRef]);

  /** Update Chart by data */
  function updateChart() {
    const currentLinePosition = scaleX(currentTick - graphMinTick) - 0.5;

    // Retrieves the colour of the chart bar at the current tick.
    function fillByBin(bin: ResolveBinModel) {
      if (bin.height === 0) {
        return themeKey === "dark" ? "#1C2230" : "#E0E8F4";
      }
      if (Number(bin.maxTick) - 5 < currentTick) {
        return `url(#gradient-bar-green-${graphId})`;
      }
      return `url(#gradient-bar-red-${graphId})`;
    }

    // Clean child elements.
    d3.select(chartRef.current).selectChildren().remove();

    // Create a chart bar.
    const rects = d3.select(chartRef.current);

    rects.attr("clip-path", "url(#clip)");

    // D3 - Draw Current tick (middle line)
    if (currentTick !== null && currentLinePosition >= 0 && currentLinePosition <= boundsWidth) {
      rects
        .append("line")
        .attr("x1", currentLinePosition)
        .attr("x2", currentLinePosition)
        .attr("y1", 0)
        .attr("y2", boundsHeight)
        .attr("stroke-dasharray", 3)
        .attr("stroke", `${themeKey === "dark" ? "#E0E8F4" : "#596782"}`)
        .attr("stroke-width", 1);
    }

    if (maxLiquidity > 0) {
      rects
        .selectAll("rects")
        .data(resolvedDisplayBins)
        .enter()
        .append("g")
        .style("fill", bin => fillByBin(bin))
        .style("stroke-width", "0")
        .style("opacity", bin => (bin.index === hoverBarIndex ? "0.4" : "1"))
        .each(function (bin) {
          d3.select(this)
            .append("rect")
            .style("stroke-width", "0")
            .style("fill", "transparent")
            .attr("x", () => scaleX(bin.positionX))
            .attr("y", () => {
              const scaleYComputation = scaleY(bin.height) ?? 0;
              return getVisibleBarDimensions(scaleYComputation, boundsHeight).y;
            })
            .attr("width", () => Math.max(scaleX(bin.maxTick - graphMinTick) - scaleX(bin.positionX), 0))
            .attr("height", () => {
              const scaleYComputation = scaleY(bin.height) ?? 0;
              return getVisibleBarDimensions(scaleYComputation, boundsHeight).height;
            });
          d3.select(this)
            .append("rect")
            .style("stroke-width", "0")
            .style("fill", () => fillByBin(bin))
            .attr("x", () => scaleX(bin.positionX) + 0.5)
            .attr("y", () => {
              const scaleYComputation = scaleY(bin.height) ?? 0;
              return getVisibleBarDimensions(scaleYComputation, boundsHeight).y;
            })
            .attr("width", () => Math.max(scaleX(bin.maxTick - graphMinTick) - scaleX(bin.positionX) - 0.5, 0))
            .attr("height", () => {
              const scaleYComputation = scaleY(bin.height) ?? 0;
              return getVisibleBarDimensions(scaleYComputation, boundsHeight).height;
            });
        });
    }

    if (displayLabels > 0) {
      rects.append("g").attr("class", "x-axis").attr("transform", `translate(0,${boundsHeight})`).call(xAxis);
    }
  }

  // mouse over event
  function onMouseoverChartBin(event: MouseEvent) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    const mouseXTick = scaleX.invert(event.offsetX) + graphMinTick;

    if (minPrice && maxPrice) {
      if (priceToTick(minPrice) < mouseXTick && priceToTick(maxPrice) > mouseXTick) {
        setTooltipInfo(null);
        setHoverBarIndex(null);
        return;
      }
    }

    const bin = resolvedDisplayBins.find(bin => {
      if (mouseY < 0.000001 || boundsHeight < mouseY) {
        return false;
      }
      if (bin.height < 0 || !bin.height) {
        return false;
      }

      return (mouseXTick >= bin.minTick && mouseXTick <= bin.maxTick) || Math.abs(bin.maxTick - mouseXTick) <= 0.5;
    });

    if (!bin) {
      setPositionX(null);
      setPositionY(null);
      setTooltipInfo(null);
      setHoverBarIndex(null);
      return;
    }

    // To reduce the computation of scaleY, the Y-axis condition check is done separately.
    if (mouseY < scaleY(bin.height)) {
      setPositionX(null);
      setPositionX(null);
      setTooltipInfo(null);
      setHoverBarIndex(null);
      return;
    }

    setHoverBarIndex(bin.index);

    const tooltipTick = getPoolSelectionGraphTooltipTick(bin);

    const tokenAAmountStr = bin.reserveTokenA;
    const tokenBAmountStr = bin.reserveTokenB;

    setTooltipInfo({
      tokenA: displayTokenA,
      tokenB: displayTokenB,
      tokenAAmount: tokenAAmountStr ? convertToKMB(tokenAAmountStr.toString()) : "-",
      tokenBAmount: tokenBAmountStr ? convertToKMB(tokenBAmountStr.toString()) : "-",
      tokenAVisible: tokenAAmountStr > 0,
      tokenBVisible: tokenBAmountStr > 0,
      price: priceOfTick.tokenA[tooltipTick] || "0",
    });
    setPositionX(mouseX);
    setPositionY(mouseY);
  }

  function onMouseoutChartBin() {
    setPositionX(null);
    setPositionY(null);
    setHoverBarIndex(null);
  }

  function onMouseoverClear(event: MouseEvent) {
    const { clientX, clientY } = event;
    if (!svgRef.current?.getClientRects()[0]) {
      setTooltipInfo(null);
      setHoverBarIndex(null);
      return;
    }
    const { left, right, top, bottom } = svgRef.current?.getClientRects()[0];
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      setTooltipInfo(null);
      setHoverBarIndex(null);
    }
  }

  // Lazy initialize currentPrice of tick
  useEffect(() => {
    if (resolvedDisplayBins.length > 0) {
      const formatDisplayPrice = (tick: number, baseToken: TokenModel, quoteToken: TokenModel) => {
        const displayPrice = makeDisplayPrice(tickToPrice(tick), baseToken, quoteToken);

        return formatTokenExchangeRate(displayPrice.toString(), {
          maxSignificantDigits: 5,
          isIgnoreKMBFormat: true,
          minLimit: 0.000001,
        });
      };

      new Promise<{
        tokenA: { [key in number]: string };
        tokenB: { [key in number]: string };
      }>(resolve => {
        const priceOfTick = resolvedDisplayBins
          .flatMap(bin => {
            const tooltipTick = getPoolSelectionGraphTooltipTick(bin);
            return [bin.minTick, tooltipTick];
          })
          .reduce<{
            tokenA: { [key in number]: string };
            tokenB: { [key in number]: string };
          }>(
            (acc, current) => {
              if (!acc.tokenA[current]) {
                acc.tokenA[current] = formatDisplayPrice(current, displayTokenA, displayTokenB);
              }
              if (!acc.tokenB[current]) {
                acc.tokenB[current] = formatDisplayPrice(-current, displayTokenB, displayTokenA);
              }
              return acc;
            },
            { tokenA: {}, tokenB: {} },
          );
        resolve(priceOfTick);
      }).then(setPriceOfTick);
    }
  }, [resolvedDisplayBins, displayTokenA, displayTokenB]);

  useEffect(() => {
    //  D3 - Draw bin and define interaction
    const svgElement = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
      .on("mousemove", onMouseoverChartBin)
      .on("mouseout", onMouseoutChartBin);

    const defElement = svgElement.select("defs");
    const existClipPath = defElement.select("clipPath").empty();

    if (existClipPath) {
      defElement.append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
    }

    if (!!width && !!height && !!scaleX && !!scaleY) {
      updateChart();
    }
  }, [minPrice, maxPrice, width, height, svgRef?.current, chartRef?.current, resolvedDisplayBins, hoverBarIndex]);

  // Brush settings, on currentPrice change, zoom, move ...
  useEffect(() => {
    if (minPrice === null || maxPrice === null) {
      return;
    }
    if (!brushRef?.current) {
      return;
    }
    const brushElement = d3.select(brushRef.current);

    if (fullRange) {
      brush.move(brushElement, [0, boundsWidth]);
    } else {
      brush.move(brushElement, [
        scaleX(priceToTick(minPrice) - graphMinTick),
        scaleX(priceToTick(maxPrice) - graphMinTick),
      ]);
    }
  }, [minPrice, maxPrice, zoomLevel, fullRange, graphBins, graphMinTick, boundsWidth, scaleX]);

  useEffect(() => {
    if (!brushRef.current) {
      return;
    }

    const brushElement = d3.select(brushRef.current).call(brush);
    brushElement
      .selectAll(".resize")
      .data([{ type: "w" }, { type: "e" }])
      .enter()
      .append("svg")
      .attr("id", d => (d.type === "w" ? "start" : "end"))
      .attr("width", "10")
      .attr("height", boundsHeight)
      .attr("cursor", "ew-resize")
      .attr("class", d => "resize handle--custom handle--" + d.type);

    const selectionElement = brushElement.select(".selection");
    selectionElement.style("fill", "url(#gradient-selection-area)");
  }, [boundsHeight, brush, brushRef, scaleX]);

  // On scroll, remove tooltip
  useEffect(() => {
    if (tooltipInfo) {
      window.addEventListener("scroll", onMouseoutChartBin);
      return () => window.removeEventListener("scroll", onMouseoutChartBin);
    }
  }, [tooltipInfo]);

  // On mouse move, clear
  useEffect(() => {
    if (tooltipInfo) {
      window.addEventListener("mousemove", onMouseoverClear);
      return () => window.removeEventListener("mousemove", onMouseoverClear);
    }
  }, [tooltipInfo]);

  return (
    <PoolSelectionGraphWrapper>
      <FloatingTooltip
        className="chart-tooltip"
        isHiddenArrow
        position={tooltipPosition}
        offset={40}
        content={
          tooltipInfo ? (
            <PoolSelectionGraphTooltipWrapper ref={tooltipRef} className={`tooltip-container ${themeKey}-shadow}`}>
              <PoolSelectionGraphBinTooptip tooltipInfo={tooltipInfo} />
            </PoolSelectionGraphTooltipWrapper>
          ) : null
        }
      >
        <svg ref={svgRef}>
          <defs>
            <linearGradient id={`gradient-bar-green-${graphId}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={greenColor.start} />
              <stop offset="100%" stopColor={greenColor.end} />
            </linearGradient>
            <linearGradient id={`gradient-bar-red-${graphId}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={redColor.start} />
              <stop offset="100%" stopColor={redColor.end} />
            </linearGradient>
            <linearGradient id="gradient-selection-area" gradientTransform="rotate(0)">
              <stop offset="0%" stopColor={selectionColor.start} />
              <stop offset="100%" stopColor={selectionColor.end} />
            </linearGradient>
          </defs>
          <g
            ref={chartRef}
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${[margin.left, margin.top].join(",")})`}
          />
          <g
            ref={brushRef}
            className={"brush"}
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${[margin.left, margin.top].join(",")})`}
          />
        </svg>
      </FloatingTooltip>
      {fullRange && <EventBlocker />}
    </PoolSelectionGraphWrapper>
  );
};

export default React.memo(PoolSelectionGraph);

const getSelectionColor = (start: string, end: string) => {
  const startPercent = Number(start);
  const endPercent = Number(end);
  if (startPercent > 0 && endPercent > 0) {
    return {
      startPercent: BigNumber(start).toString(),
      endPercent: BigNumber(end).toString(),
      start: "#60E66A33",
      end: "#60E66A33",
      lineStart: "#16C78A", //red EA3943
      lineEnd: "#16C78A", //green 16C78A
      badgeStart: "#16C78AB2",
      badgeEnd: "#16C78AB2",
    };
  }

  if (startPercent < 0 && endPercent < 0) {
    return {
      startPercent: BigNumber(start).toString(),
      endPercent: BigNumber(end).toString(),
      start: "#FF020233",
      end: "#FF020233",
      lineStart: "#EA3943",
      lineEnd: "#EA3943",
      badgeStart: "#EA3943B2",
      badgeEnd: "#EA3943B2",
    };
  }

  if (startPercent <= 0 && endPercent >= 0) {
    return {
      startPercent: BigNumber(start).toString(),
      endPercent: BigNumber(end).toString(),
      start: "#FF020233",
      end: "#00CD2E33",
      lineStart: "#EA3943",
      lineEnd: "#16C78A",
      badgeStart: "#EA3943B2",
      badgeEnd: "#16C78AB2",
    };
  }

  return {
    startPercent: BigNumber(start).toString(),
    endPercent: BigNumber(end).toString(),
    start: "#00CD2E33",
    end: "#FF020233",
    lineStart: "#16C78A",
    lineEnd: "#EA3943",
    badgeStart: "#16C78AB2",
    badgeEnd: "#EA3943B2",
  };
};

function isSameSelectionColor(left: SelectionColor, right: SelectionColor): boolean {
  return (
    left.startPercent === right.startPercent &&
    left.endPercent === right.endPercent &&
    left.start === right.start &&
    left.end === right.end &&
    left.lineStart === right.lineStart &&
    left.lineEnd === right.lineEnd &&
    left.badgeStart === right.badgeStart &&
    left.badgeEnd === right.badgeEnd
  );
}

function makeLeftBadge(
  refer: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  reverse = false,
  selectionColor: SelectionColor,
) {
  refer
    .append("rect")
    .attr("x", "-12")
    .attr("y", "0")
    .attr("width", "30")
    .attr("height", "100%")
    .style("fill", "transparent")
    .style("cursor", "ew-resize");

  const badge = refer
    .append("svg")
    .attr("x", "-12")
    .attr("y", "0")
    .attr("width", "11")
    .attr("height", "32")
    .style("fill", "none");
  badge
    .append("path")
    .attr("d", "M0 2C0 0.895431 0.895431 0 2 0H11V32H2C0.895431 32 0 31.1046 0 30V2Z")
    .style("fill", "#596782");
  badge.append("rect").attr("x", "3.5").attr("y", "2").attr("width", "1").attr("height", "28").style("fill", "#90A2C0");
  badge.append("rect").attr("x", "6.5").attr("y", "2").attr("width", "1").attr("height", "28").style("fill", "#90A2C0");

  makeLabel(refer, false, reverse, selectionColor);
  return badge;
}

function makeRightBadge(
  refer: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  reverse = false,
  selectionColor: SelectionColor,
) {
  refer
    .append("rect")
    .attr("x", "-12")
    .attr("y", "0")
    .attr("width", "30")
    .attr("height", "100%")
    .style("fill", "transparent")
    .style("cursor", "ew-resize");

  const badge = refer
    .append("svg")
    .attr("x", "1")
    .attr("y", "0")
    .attr("width", "11")
    .attr("height", "32")
    .style("fill", "none");
  badge
    .append("path")
    .attr("d", "M0 0H9C10.1046 0 11 0.895431 11 2V30C11 31.1046 10.1046 32 9 32H0V0Z")
    .style("fill", "#596782");
  badge.append("rect").attr("x", "3.5").attr("y", "2").attr("width", "1").attr("height", "28").style("fill", "#90A2C0");
  badge.append("rect").attr("x", "6.5").attr("y", "2").attr("width", "1").attr("height", "28").style("fill", "#90A2C0");

  makeLabel(refer, true, reverse, selectionColor);
  return badge;
}

function makeLabel(
  refer: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  right = false,
  reverse = false,
  selectionColor: SelectionColor,
) {
  const id = right === false ? "start-price" : "end-price";
  const color = right === false ? selectionColor.badgeStart : selectionColor.badgeEnd;
  if (refer.select(`#${id}`)) {
    refer.append("g").attr("id", id);
  }

  const margin = right === reverse ? -60 : 20;

  const labelWrapper = refer.select(`#${id}`);
  labelWrapper
    .append("rect")
    .attr("x", margin)
    .attr("y", "0")
    .attr("width", "70")
    .attr("height", "23")
    .attr("rx", 5)
    .style("fill", color);
  labelWrapper
    .append("text")
    .attr("x", margin + 30)
    .attr("y", "2")
    .attr("dy", "15")
    .attr("text-anchor", "middle")
    .style("fill", "#FFF");
}
