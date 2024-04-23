import React, { useEffect, useRef, useState } from "react";
import { GraphWrapper, PoolSelectionGraphWrapper } from "./PoolSelectionGraph.styles";
import * as d3 from "d3";
import { displayTickNumber } from "@utils/string-utils";
import BigNumber from "bignumber.js";
import { useColorGraph } from "@hooks/common/use-color-graph";
import { priceToNearTick, tickToPrice } from "@utils/swap-utils";
import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import FloatingTooltip from "../tooltip/FloatingTooltip";
import MissingLogo from "../missing-logo/MissingLogo";
BigNumber.config({ EXPONENTIAL_AT: 1e9 });
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
  selectionColor: any
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
  selectionColor: any
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
  selectionColor: any
) {
  // const id = right === false ? "start-price" : "end-price";
  const id = right === false ? `start-price-${Math.round(selectionColor.startPercent)}` : `end-price-${BigNumber(selectionColor.endPercent).toString()}`;
  
  // const color = right === false ? "#EA3943B2" : "#16C78AB2";
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
    .attr("width", "50")
    .attr("height", "23")
    .attr("rx", 5)
    .style("fill", color);
  labelWrapper
    .append("text")
    .attr("x", margin + 25)
    .attr("y", "0")
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
  const lineElement = selectionElement.select(`#${type}`).attr("x", x);
  lineElement.select("svg").attr("x", 0);


  const priceId = `${type}-price-${type === "start" ? selectionColor.startPercent : `${selectionColor.endPercent}`}`;
  const color = type === "start" ? selectionColor.badgeStart : selectionColor.badgeEnd;
  
  const margin = right === false ? (type === "end" ? -51 : -62) : (type === "end" ? 12 : 1);
  const labelWrapper = lineElement.select(`#${priceId}`);
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
    .html(rateStr);
  if (hidden) {
    labelWrapper.attr("display", "none");
  }
}

export interface PoolSelectionGraphProps {
  feeTier: SwapFeeTierType | null;
  scaleX: d3.ScaleLinear<number, number, never>;
  scaleY: d3.ScaleLinear<number, number, never>;
  liquidityOfTickPoints: [number, number][];
  currentPrice: number | null;
  zoomLevel: number;
  displayLabels?: number;
  minPrice: number | null;
  maxPrice: number | null;
  setMinPrice: (tick: number | null) => void;
  setMaxPrice: (tick: number | null) => void;
  selectedFullRange: boolean;
  finishMove: () => void;
  focusPosition: number | null;
  width: number;
  height: number;
  margin?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  setIsChangeMinMax: (value: boolean) => void;
}

const PoolSelectionGraph: React.FC<PoolSelectionGraphProps> = (props) => {
  const {
    feeTier,
    scaleX,
    scaleY,
    liquidityOfTickPoints,
    currentPrice = null,
    displayLabels = 8,
    width,
    height,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    selectedFullRange,
    focusPosition,
    zoomLevel,
    margin = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    setIsChangeMinMax,
  } = props;
  const [selectionColor, setSelectionColor] = useState(getSelectionColor("0", "0"));
  const svgRef = useRef(null);
  const chartRef = useRef<SVGGElement | null>(null);
  const brushRef = useRef<SVGGElement | null>(null);
  const labelHeight = displayLabels > 0 ? 20 : 0;
  const themeKey = useAtomValue(ThemeState.themeKey);
  const paddingHeight = 0;
  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight =
    height - margin.top - margin.bottom - labelHeight - paddingHeight;

  const getRange = () => {
    return scaleX.domain();
  };

  const getBinWidth = () => {
    return width / 40;
  };

  const { redColor, greenColor } = useColorGraph();

  function getInvertX(x: number) {
    return Number(BigNumber(scaleX.invert(x)).toFixed(16));
  }

  const resolvedBins = () => {
    const binWidth = getBinWidth();
    const startXPosition = (getInvertX(0) % binWidth) * -1;

    return Array.from({ length: 40 }, (_, index) => {
      const x: number = startXPosition + binWidth * index;
      const y: number =
        liquidityOfTickPoints.find((point, pIndex) => {
          const pointPosition = scaleX(point[0]);
          if (liquidityOfTickPoints.length <= pIndex + 1) {
            return x >= pointPosition;
          }
          const nextPointPosition = scaleX(
            liquidityOfTickPoints[pIndex + 1][0],
          );
          if (nextPointPosition > x && x >= pointPosition) {
            return true;
          }
          return false;
        })?.[1] || 0;

      return {
        x,
        y,
        width: binWidth,
      };
    });
  };

  /** D3 Variables */
  const defaultScaleX = scaleX.copy();

  const xAxis = d3
    .axisBottom(scaleX)
    .tickSize(0)

    .tickPadding(4)
    .tickFormat(tick =>
      displayTickNumber([getInvertX(0), getInvertX(width)], Number(tick)),
    )
    .tickArguments([displayLabels]);

  const binData = () => {
    const currentPricePosition = currentPrice ? scaleX(currentPrice) : null;
    function fillByBin(bin: { x: number; y: number; width: number }) {
      if (bin.y === 0) {
        return "#4c4c4c";
      }
      const centerX = bin.x + bin.width / 2;
      if (currentPricePosition && centerX < currentPricePosition) {
        return "url(#gradient-bar-green)";
      }
      return "url(#gradient-bar-red)";
    }

    return resolvedBins().map(bin => {
      const x = bin.x + 1;
      const y = bin.y > 0 ? scaleY(bin.y) : 0;
      const fill = fillByBin(bin);
      const width = bin.width - 1;
      const height = bin.y > 0 ? boundsHeight - y : 0;

      return {
        x,
        y,
        fill,
        width: width > 0 ? width : 0,
        height: height > 0 ? height : 0,
      };
    });
  };

  const brush = d3
    .brushX()
    .extent([
      [scaleX(0), 0],
      [boundsWidth, boundsHeight + paddingHeight],
    ])
    .on("start brush", onBrushMove)
    .on("end", onBrushEnd);

  function onBrushMove(this: SVGGElement, event: d3.D3BrushEvent<null>) {
    if (!brushRef.current) {
      return;
    }
    const brushElement = d3.select(brushRef.current);
    if (event.type === "start") {
      /** Start Line */
      brushElement.select("#start").selectChildren().remove();
      const startLineElement = brushElement.select("#start").insert("svg");
      startLineElement
        .append("line")
        .attr("y1", 0)
        .attr("y2", boundsHeight + paddingHeight)
        .style("stroke", selectionColor.lineStart)
        .attr("stroke-width", 2);
      makeLeftBadge(startLineElement, false, selectionColor);

      /** End Line */
      brushElement.select("#end").selectChildren().remove();
      const endLineElement = brushElement.select("#end").insert("svg");
      endLineElement
        .append("line")
        .attr("y1", boundsHeight + paddingHeight)
        .attr("y2", 0)
        .style("stroke", selectionColor.lineEnd)
        .attr("stroke-width", 2);

      makeRightBadge(endLineElement, false, selectionColor);
    }

    const selection = event.selection ? event.selection : [0, 0];
    const startPosition = selection[0] as number;
    const endPosition = selection[1] as number;
    brushElement
      .selectAll(".resize")
      .attr("x", data => (data === "w" ? startPosition : endPosition));

    const startRate = currentPrice
      ? ((scaleX.invert(startPosition) - currentPrice) / currentPrice) * 100
      : 0;
    const endRate = currentPrice
      ? ((scaleX.invert(endPosition) - currentPrice) / currentPrice) * 100
      : 0;

    const isRightStartLine = startPosition - 75 < 0;
    const isRightEndLine = endPosition + 75 < boundsWidth;
    changeLine(
      brushElement,
      "start",
      startPosition as number,
      startRate,
      isRightStartLine,
      false,
      selectionColor,
    );
    changeLine(
      brushElement,
      "end",
      endPosition as number,
      endRate,
      isRightEndLine,
      selectedFullRange,
      selectionColor,
    );
  
  }

  function onBrushEnd(this: SVGGElement, event: d3.D3BrushEvent<any>) {
    if (!brushRef.current || event.mode === undefined) {
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
      const startRate = currentPrice
      ? ((scaleX.invert(startPosition) - currentPrice) / currentPrice) * 100
      : 0;
    const endRate = currentPrice
      ? ((scaleX.invert(endPosition) - currentPrice) / currentPrice) * 100
      : 0;
      setSelectionColor(getSelectionColor(BigNumber(startRate).toFixed(0).toString(), BigNumber(endRate).toFixed(0).toString()));
      const minPrice = !BigNumber(scaleX.invert(startPosition)).isNaN()
        ? tickToPrice(
            priceToNearTick(
              scaleX.invert(startPosition),
              feeTier ? SwapFeeTierInfoMap[feeTier].tickSpacing : 2,
            ),
          )
        : 0;
      const maxPrice = !BigNumber(scaleX.invert(endPosition)).isNaN()
        ? tickToPrice(
            priceToNearTick(
              scaleX.invert(endPosition),
              feeTier ? SwapFeeTierInfoMap[feeTier].tickSpacing : 2,
            ),
          )
        : 0;
      setMinPrice(minPrice);
      setMaxPrice(maxPrice);
      setIsChangeMinMax(true);
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

  /** Zoom */
  const zoom: d3.ZoomBehavior<any, unknown> = d3
    .zoom()
    .scaleExtent([0.01, 2 ** 20])
    .on("zoom", onZoom);

  function onZoom(event: d3.D3ZoomEvent<SVGElement, null>) {
    const blocks = ["brush", "click"];
    if (event?.sourceEvent && blocks.includes(event.sourceEvent.type)) return; // ignore zoom-by-brush
    const transform = event.transform;
    scaleX.domain(transform.rescaleX(defaultScaleX).domain());
  }

  function initZoom() {
    const svgElement = d3.select(svgRef.current);
    const scaleRate = 2 ** (zoomLevel - 10);
    zoom.scaleTo(svgElement, scaleRate, [0, 0]);
    const [x1, x2] = getRange();
    zoom.translateTo(svgElement, scaleX((x1 + x2) / 2), 0);

    brush.extent([
      [scaleX(0), 0],
      [boundsWidth, boundsHeight + paddingHeight],
    ]);
  }

  function updateChart() {
    d3.select(chartRef.current).selectChildren().remove();

    const rects = d3.select(chartRef.current);
    rects.attr("clip-path", "url(#clip)");
    rects
      .selectAll("rects")
      .data(binData())
      .enter()
      .append("rect")
      .style("fill", bin => bin.fill)
      .attr("class", "rects")
      .attr("x", bin => bin.x)
      .attr("y", bin => bin.y)
      .attr("width", bin => bin.width)
      .attr("height", bin => bin.height);

    if (displayLabels > 0) {
      rects
        .append("g")
        .attr("transform", `translate(0,${boundsHeight})`)
        .call(xAxis);
    }

    // Create a line of current tick.
    const currentPricePosition = currentPrice ? scaleX(currentPrice) : null;
    if (currentPricePosition) {
      if (d3.select(svgRef.current).select("#current-price").empty()) {
        d3.select(svgRef.current).append("line").attr("id", "current-price");
      }
      d3.select(svgRef.current)
        .select("#current-price")
        .attr("x1", currentPricePosition)
        .attr("x2", currentPricePosition)
        .attr("y1", boundsHeight + paddingHeight)
        .attr("y2", 0)
        .attr("stroke-dasharray", 4)
        .attr("stroke", `${themeKey === "dark" ? "#E0E8F4" : "#596782"}`)
        .attr("stroke-width", 1);
    }
  }

  function interactChart() {
    if (brushRef.current) {
      try {
        const zeroPosition = Number(BigNumber(scaleX(0)).toFixed(10));
        if (selectedFullRange) {
          brush?.move(d3.select(brushRef.current), [zeroPosition, width]);
        }
      } catch {}
    }
  }

  useEffect(() => {
    initZoom();
    interactChart();
    updateChart();
  }, [zoomLevel, focusPosition, selectedFullRange]);

  useEffect(() => {
    initZoom();
    if (!brushRef.current || minPrice === null || maxPrice === null) {
      return;
    }
    const zeroPosition = scaleX(0);
    const brushElement = d3.select(brushRef.current);
    const minPricePosition = selectedFullRange
      ? zeroPosition
      : scaleX(minPrice);
    brush.move(brushElement, [
      minPricePosition > zeroPosition ? minPricePosition : zeroPosition,
      scaleX(maxPrice),
    ]);
    updateChart();
  }, [minPrice, maxPrice, scaleX, selectedFullRange, brush, currentPrice]);

  useEffect(() => {
    const svgElement = d3
      .select(svgRef.current)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "height: 160px;");

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

    if (brushRef.current) {
      const brushElement = d3.select(brushRef.current);
      brushElement.call(brush);
      const selectionElement = brushElement.select(".selection");
      selectionElement.style("fill", "url(#gradient-selection-area)");
    }
  }, [scaleX, scaleY]);

  return (
    <PoolSelectionGraphWrapper>
      <FloatingTooltip
        className="chart-tooltip"
        isHiddenArrow
        position={"top"}
        offset={20}
        content={<TooltipContent />}
      >
        <svg ref={svgRef}>
          <defs>
            <linearGradient id="gradient-bar-green" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={greenColor.start} />
              <stop offset="100%" stopColor={greenColor.end} />
            </linearGradient>
            <linearGradient id="gradient-bar-red" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={redColor.start} />
              <stop offset="100%" stopColor={redColor.end} />
            </linearGradient>
            <linearGradient
              id="gradient-selection-area"
              gradientTransform="rotate(0)"
            >
              <stop offset="0%" stopColor={selectionColor.start} />
              {/* <stop
                id="gradient-selection-current-position"
                offset="50%"
                stopColor={"#697A1C33"}
              /> */}
              <stop offset="100%" stopColor={selectionColor.end} />
            </linearGradient>
          </defs>
          <g
            ref={chartRef}
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${[
              margin.left,
              margin.top + paddingHeight,
            ].join(",")})`}
          />
          <g
            ref={brushRef}
            className={"brush"}
            width={boundsWidth}
            height={boundsHeight + paddingHeight}
            transform={`translate(${[margin.left, margin.top].join(",")})`}
          />
        </svg>
      </FloatingTooltip>
    </PoolSelectionGraphWrapper>
  );
};

export default PoolSelectionGraph;

const TooltipContent = () => {
  return <GraphWrapper>
    <div className="header">
      <div className="token">Token</div>
      <div className="amount">Amount</div>
      <div className="price">Price Range</div>
    </div>
    <div className="content">
      <div className="item">
        <div className="logo"><MissingLogo symbol="GNS" url="" width={20}/> GNS</div>
        <div className="amount">4.84K</div>
        <div className="price">1.441522 - 1.741584 USDC</div>
      </div>
      <div className="item">
        <div className="logo"><MissingLogo symbol="GNS" url="" width={20}/> GNS</div>
        <div className="amount">4.84K</div>
        <div className="price">1.441522 - 1.741584 USDC</div>
      </div>
    </div>
  </GraphWrapper>;
};