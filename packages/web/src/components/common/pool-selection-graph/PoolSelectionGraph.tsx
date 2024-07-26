import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  EventBlocker,
  PoolSelectionGraphTooltipWrapper,
  PoolSelectionGraphWrapper,
} from "./PoolSelectionGraph.styles";
import * as d3 from "d3";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { TokenModel } from "@models/token/token-model";
import { useColorGraph } from "@hooks/common/use-color-graph";
import { priceToTick, tickToPrice, tickToPriceStr } from "@utils/swap-utils";
import FloatingTooltip from "../tooltip/FloatingTooltip";
import { FloatingPosition } from "@hooks/common/use-floating-tooltip";
import { convertToKMB } from "@utils/stake-position-utils";
import {
  PoolSelectionGraphBinTooptip,
  TooltipInfo,
} from "./PoolSelectionGraphBinTooltip";
import { useTheme } from "@emotion/react";
import BigNumber from "bignumber.js";
import { displayTickNumber } from "@utils/string-utils";
import {
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType,
} from "@constants/option.constant";

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
  bins: PoolBinModel[];
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
  displayBinCount?: number;
  shiftIndex?: number;
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
  bins = [],
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
  displayBinCount = 40,
  shiftIndex = 0,
  fullRange,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  onFinishMove,
}) => {
  const { themeKey } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const chartRef = useRef(null);
  const brushRef = useRef<SVGGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [priceOfTick, setPriceOfTick] = useState<{ [key in number]: string }>(
    {},
  );
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const [positionX, setPositionX] = useState<number | null>(null);
  const [positionY, setPositionY] = useState<number | null>(null);
  const [hoverBarIndex, setHoverBarIndex] = useState<number | null>(null);

  const { redColor, greenColor } = useColorGraph();

  const [selectionColor, setSelectionColor] = useState(
    getSelectionColor("0", "0"),
  );

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

  const adjustBins = useMemo(() => {
    return flip
      ? bins
          .map(bin => ({
            ...bin,
            maxTick: -1 * bin.minTick,
            minTick: -1 * bin.maxTick,
            reserveTokenA: bin.reserveTokenB,
            reserveTokenB: bin.reserveTokenA,
            height: BigNumber(bin.reserveTokenB)
              .multipliedBy(price)
              .plus(bin.reserveTokenA)
              .toNumber(),
          }))
          .reverse()
      : bins.map(bin => ({
          ...bin,
          height: BigNumber(bin.reserveTokenA)
            .multipliedBy(price)
            .plus(bin.reserveTokenB)
            .toNumber(),
        }));
  }, [bins, price, flip]);

  // Display bins is bins slice data.
  const displayBins = useMemo(() => {
    const centerIndex = adjustBins.length / 2;
    const displaySideBinCount = displayBinCount / 2;

    const sliceStartIndex =
      centerIndex - displaySideBinCount + shiftIndex >= 0
        ? centerIndex - displaySideBinCount + shiftIndex
        : 0;

    const sliceEndIndex =
      centerIndex + displaySideBinCount + shiftIndex < adjustBins.length
        ? centerIndex + displaySideBinCount + shiftIndex
        : adjustBins.length;

    return adjustBins.slice(sliceStartIndex, sliceEndIndex);
  }, [adjustBins, displayBinCount, shiftIndex]);

  const graphMinTick = useMemo(() => {
    return Math.min(...displayBins.map(bin => bin.minTick));
  }, [displayBins]);

  // D3 - Dimension Definition
  const minX = useMemo(
    () => Math.min(...displayBins.map(bin => bin.minTick)),
    [displayBins],
  );
  const maxX = useMemo(
    () => Math.max(...displayBins.map(bin => bin.maxTick)),
    [displayBins],
  );

  const maxLiquidity = Math.max(...adjustBins.map(bin => bin.height));

  // D3 - Scale Definition
  const defaultScaleX = d3
    .scaleLinear()
    .domain([0, maxX - minX])
    .range([0, boundsWidth]);

  const scaleX = defaultScaleX.copy();

  const xAxis = d3
    .axisBottom(scaleX)
    .tickSize(4)
    .tickPadding(4)
    .tickFormat(tick =>
      displayTickNumber(
        [getInvertX(0) + graphMinTick, getInvertX(width) + graphMinTick],
        Number(tick) + graphMinTick,
      ),
    )
    .tickArguments([displayLabels]);

  const scaleY = d3
    .scaleLinear()
    .domain([0, maxLiquidity])
    .range([boundsHeight, 0]);

  const resolvedDisplayBins: ResolveBinModel[] = useMemo(() => {
    return displayBins.map((bin, index) => {
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
  }, [displayBins, graphMinTick]);

  const tickWidth = useMemo(() => {
    return boundsWidth / displayBins.length;
  }, [boundsWidth, displayBins.length]);

  const currentTick = useMemo(() => {
    if (Number.isNaN(currentPrice)) {
      return 0;
    }
    return priceToTick(currentPrice);
  }, [currentPrice]);

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
  const random = Math.random().toString();

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

    const startPrice = tickToPrice(
      Math.round(scaleX.invert(startPosition) + graphMinTick),
    );
    const endPrice = tickToPrice(
      Math.round(scaleX.invert(endPosition) + graphMinTick),
    );

    const startRate = currentPrice
      ? ((Number(startPrice) - currentPrice) / currentPrice) * 100
      : 0;
    const endRate = currentPrice
      ? ((Number(endPrice) - currentPrice) / currentPrice) * 100
      : 0;

    const selectionColor = getSelectionColor(
      startRate >= 0 ? "1" : "-1",
      endRate >= 0 ? "1" : "-1",
    );

    const brushElement = d3.select(brushRef.current);
    if (event.type === "start") {
      /** Start Line */
      brushElement.select("#start").selectChildren().remove();
      const startLineElement = brushElement.select("#start").insert("svg");
      startLineElement
        .append("line")
        .attr("y1", 0)
        .attr("y2", boundsHeight)
        .style("stroke", selectionColor.lineStart)
        .attr("stroke-width", 2);
      makeLeftBadge(startLineElement, false, selectionColor);

      /** End Line */
      brushElement.select("#end").selectChildren().remove();
      const endLineElement = brushElement.select("#end").insert("svg");
      endLineElement
        .append("line")
        .attr("y1", boundsHeight)
        .attr("y2", 0)
        .style("stroke", selectionColor.lineEnd)
        .attr("stroke-width", 2);

      makeRightBadge(endLineElement, fullRange, selectionColor);
    }

    brushElement
      .selectAll(".resize")
      .attr("x", data => (data === "w" ? startPosition : endPosition));

    const isRightStartLine = startPosition - 75 < 0;
    const isRightEndLine = endPosition + 75 < boundsWidth;

    setSelectionColor(selectionColor);
    changeLine(
      brushElement,
      "start",
      startPosition as number,
      startRate,
      isRightStartLine,
      fullRange,
      selectionColor,
    );
    changeLine(
      brushElement,
      "end",
      endPosition as number,
      endRate,
      isRightEndLine,
      fullRange, //selectedFullRange,
      selectionColor,
    );
  }

  function onBrushEnd(this: SVGGElement, event: d3.D3BrushEvent<any>) {
    if (!brushRef.current || event.mode === undefined) {
      return;
    }

    onFinishMove && onFinishMove();
    if (fullRange) {
      setMinPrice(null);
      setMaxPrice(null);
      return;
    }

    if (!event.selection) {
      d3.select(brushRef.current)
        .selectAll(".resize")
        .selectChildren()
        .remove();
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

        const tick =
          Math.round((tickWithOffset + graphMinTick) / tickSpacing) *
          tickSpacing;
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

      setSelectionColor(selectionColor);
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
        return `url(#gradient-bar-green-${random})`;
      }
      return `url(#gradient-bar-red-${random})`;
    }

    // Clean child elements.
    d3.select(chartRef.current).selectChildren().remove();

    // Create a chart bar.
    const rects = d3.select(chartRef.current);

    rects.attr("clip-path", "url(#clip)");

    // D3 - Draw Current tick (middle line)
    if (currentTick !== null && displayBins.length === displayBinCount) {
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
              return (
                scaleYComputation -
                (scaleYComputation > height - 5 && scaleYComputation !== height
                  ? 5
                  : 0)
              );
            })
            .attr("width", tickWidth)
            .attr("height", () => {
              const scaleYComputation = scaleY(bin.height) ?? 0;
              return (
                boundsHeight -
                scaleYComputation +
                (scaleYComputation > height - 5 && scaleYComputation !== height
                  ? 5
                  : 0)
              );
            });
          d3.select(this)
            .append("rect")
            .style("stroke-width", "0")
            .style("fill", () => fillByBin(bin))
            .attr("x", () => scaleX(bin.positionX) + 0.5)
            .attr("y", () => {
              const scaleYComputation = scaleY(bin.height) ?? 0;
              return (
                scaleYComputation -
                (scaleYComputation > height - 5 && scaleYComputation !== height
                  ? 5
                  : 0)
              );
            })
            .attr("width", tickWidth - 0.5)
            .attr("height", () => {
              const scaleYComputation = scaleY(bin.height) ?? 0;
              return (
                boundsHeight -
                scaleYComputation +
                (scaleYComputation > height - 5 && scaleYComputation !== height
                  ? 5
                  : 0)
              );
            });
        });
    }

    if (displayLabels > 0) {
      rects
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${boundsHeight})`)
        .call(xAxis);
    }
  }

  // mouse over event
  function onMouseoverChartBin(event: MouseEvent) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    const mouseXTick = scaleX.invert(event.offsetX) + graphMinTick;

    if (minPrice && maxPrice) {
      if (
        priceToTick(minPrice) < mouseXTick &&
        priceToTick(maxPrice) > mouseXTick
      ) {
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

      return (
        (mouseXTick >= bin.minTick && mouseXTick <= bin.maxTick) ||
        Math.abs(bin.maxTick - mouseXTick) <= 0.5
      );
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

    const minTick = bin.minTick;
    const maxTick = bin.maxTick;

    const tokenARange = {
      min: priceOfTick[minTick] || null,
      max: priceOfTick[maxTick] || null,
    };
    const tokenBRange = {
      min: priceOfTick[-minTick] || null,
      max: priceOfTick[-maxTick] || null,
    };

    const tokenAAmountStr = bin.reserveTokenA;
    const tokenBAmountStr = bin.reserveTokenB;

    setTooltipInfo({
      tokenA: tokenA,
      tokenB: tokenB,
      tokenAAmount: tokenAAmountStr
        ? convertToKMB(tokenAAmountStr.toString())
        : "-",
      tokenBAmount: tokenBAmountStr
        ? convertToKMB(tokenBAmountStr.toString())
        : "-",
      tokenARange: tokenARange,
      tokenBRange: tokenBRange,
      tokenAPrice: priceOfTick[currentTick] || "0",
      tokenBPrice: priceOfTick[-currentTick] || "0",
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
    if (
      clientX < left ||
      clientX > right ||
      clientY < top ||
      clientY > bottom
    ) {
      setTooltipInfo(null);
      setHoverBarIndex(null);
    }
  }

  // Lazy initialize currentPrice of tick
  useEffect(() => {
    if (resolvedDisplayBins.length > 0) {
      new Promise<{ [key in number]: string }>(resolve => {
        const priceOfTick = resolvedDisplayBins
          .flatMap(bin => {
            const minTick = bin.minTick;
            const maxTick = bin.maxTick;
            return [minTick, maxTick, -minTick, -maxTick];
          })
          .reduce<{ [key in number]: string }>((acc, current) => {
            if (!acc[current]) {
              acc[current] = tickToPriceStr(current, {
                decimals: 40,
              }).toString();
            }
            return acc;
          }, {});
        priceOfTick[currentTick] = tickToPriceStr(Math.round(currentTick), {
          decimals: 40,
        }).toString();
        priceOfTick[-currentTick] = tickToPriceStr(-Math.round(currentTick), {
          decimals: 40,
        }).toString();
        resolve(priceOfTick);
      }).then(setPriceOfTick);
    }
  }, [resolvedDisplayBins]);

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

    svgElement
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    const defElement = svgElement.select("defs");
    const existClipPath = defElement.select("clipPath").empty();

    if (existClipPath) {
      defElement
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    }

    if (!!width && !!height && !!scaleX && !!scaleY) {
      updateChart();
    }
  }, [width, height, scaleX, scaleY]);

  // Brush settings, on currentPrice change, zoom, move ...
  useEffect(() => {
    if (
      minPrice === null ||
      maxPrice === null ||
      displayBins.length !== displayBinCount
    ) {
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
  }, [minPrice, maxPrice, zoomLevel, shiftIndex, fullRange, displayBins]);

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
            <PoolSelectionGraphTooltipWrapper
              ref={tooltipRef}
              className={`tooltip-container ${themeKey}-shadow}`}
            >
              <PoolSelectionGraphBinTooptip tooltipInfo={tooltipInfo} />
            </PoolSelectionGraphTooltipWrapper>
          ) : null
        }
      >
        <svg ref={svgRef}>
          <defs>
            <linearGradient
              id={`gradient-bar-green-${random}`}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor={greenColor.start} />
              <stop offset="100%" stopColor={greenColor.end} />
            </linearGradient>
            <linearGradient
              id={`gradient-bar-red-${random}`}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor={redColor.start} />
              <stop offset="100%" stopColor={redColor.end} />
            </linearGradient>
            <linearGradient
              id="gradient-selection-area"
              gradientTransform="rotate(0)"
            >
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

function makeLeftBadge(
  refer: d3.Selection<any, unknown, null, undefined>,
  reverse = false,
  selectionColor: any,
) {
  const badge = refer
    .append("svg")
    .attr("x", "-12")
    .attr("y", "0")
    .attr("width", "11")
    .attr("height", "32")
    .style("fill", "none");
  badge
    .append("path")
    .attr(
      "d",
      "M0 2C0 0.895431 0.895431 0 2 0H11V32H2C0.895431 32 0 31.1046 0 30V2Z",
    )
    .style("fill", "#596782");
  badge
    .append("rect")
    .attr("x", "3.5")
    .attr("y", "2")
    .attr("width", "1")
    .attr("height", "28")
    .style("fill", "#90A2C0");
  badge
    .append("rect")
    .attr("x", "6.5")
    .attr("y", "2")
    .attr("width", "1")
    .attr("height", "28")
    .style("fill", "#90A2C0");

  makeLabel(refer, false, reverse, selectionColor);
  return badge;
}

function makeRightBadge(
  refer: d3.Selection<any, unknown, null, undefined>,
  reverse = false,
  selectionColor: any,
) {
  const badge = refer
    .append("svg")
    .attr("x", "1")
    .attr("y", "0")
    .attr("width", "11")
    .attr("height", "32")
    .style("fill", "none");
  badge
    .append("path")
    .attr(
      "d",
      "M0 0H9C10.1046 0 11 0.895431 11 2V30C11 31.1046 10.1046 32 9 32H0V0Z",
    )
    .style("fill", "#596782");
  badge
    .append("rect")
    .attr("x", "3.5")
    .attr("y", "2")
    .attr("width", "1")
    .attr("height", "28")
    .style("fill", "#90A2C0");
  badge
    .append("rect")
    .attr("x", "6.5")
    .attr("y", "2")
    .attr("width", "1")
    .attr("height", "28")
    .style("fill", "#90A2C0");

  makeLabel(refer, true, reverse, selectionColor);
  return badge;
}

function makeLabel(
  refer: d3.Selection<any, unknown, null, undefined>,
  right = false,
  reverse = false,
  selectionColor: any,
) {
  const id = right === false ? "start-price" : "end-price";
  const color =
    right === false ? selectionColor.badgeStart : selectionColor.badgeEnd;
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

function changeLine(
  selectionElement: d3.Selection<any, unknown, null, undefined>,
  type: "start" | "end",
  x: number,
  rate: number,
  right = false,
  selectedFullRange = false,
  selectionColor: any,
) {
  const hidden = type === "end" && selectedFullRange === true;
  const rateStr = `${rate > 0 ? "+" : ""}${Math.round(rate).toFixed(0)}%`;
  const lineColor =
    type === "start" ? selectionColor.lineStart : selectionColor.lineEnd;
  const lineElement = selectionElement.select(`#${type}`).attr("x", x);
  lineElement.select("svg").attr("x", 0);
  lineElement.select("svg").select("line").style("stroke", lineColor);

  const priceID = `${type}-price`;
  const color =
    type === "start" ? selectionColor.badgeStart : selectionColor.badgeEnd;

  const margin =
    right === false ? (type === "end" ? -51 : -62) : type === "end" ? 12 : 1;
  const labelWrapper = lineElement.select(`#${priceID}`);

  const labelText = !selectedFullRange
    ? rateStr
    : type === "start"
    ? "-100%"
    : "∞";

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
    .html(labelText);
  if (hidden) {
    labelWrapper.attr("display", "none");
  }
}
