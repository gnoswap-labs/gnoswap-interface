import React, { useEffect, useRef } from "react";
import { PoolSelectionGraphWrapper } from "./PoolSelectionGraph.styles";
import * as d3 from "d3";
import { displayTickNumber } from "@utils/string-utils";
import BigNumber from "bignumber.js";
import { useColorGraph } from "@hooks/common/use-color-graph";
import { priceToNearTick, tickToPrice } from "@utils/swap-utils";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";

function makeBadge(
  refer: d3.Selection<any, unknown, null, undefined>,
  right = false,
  reverse = false,
) {
  const badge = refer.append("svg")
    .attr("x", "0")
    .attr("y", "0")
    .attr("width", "11")
    .attr("height", "32")
    .style("fill", "none");
  badge.append("path")
    .attr("d", "M0 2C0 0.895431 0.895431 0 2 0H11V32H2C0.895431 32 0 31.1046 0 30V2Z")
    .style("fill", "#596782");
  badge.append("rect")
    .attr("x", "3.5")
    .attr("y", "2")
    .attr("width", "1")
    .attr("height", "28")
    .style("fill", "#90A2C0");
  badge.append("rect")
    .attr("x", "6.5")
    .attr("y", "2")
    .attr("width", "1")
    .attr("height", "28")
    .style("fill", "#90A2C0");

  makeLabel(refer, right, reverse);
  return badge;
}

function makeLabel(
  refer: d3.Selection<any, unknown, null, undefined>,
  right = false,
  reverse = false,
) {
  const id = right === false ? "start-price" : "end-price";
  const color = right === false ? "#EA3943B2" : "#16C78AB2";
  if (refer.select(`#${id}`)) {
    refer.append("g")
      .attr("id", id);
  }

  const margin = right === reverse ? -60 : 20;
  const labelWrapper = refer.select(`#${id}`);
  labelWrapper.append("rect")
    .attr("x", margin)
    .attr("y", "0")
    .attr("width", "50")
    .attr("height", "23")
    .attr("rx", 5)
    .style("fill", color);
  labelWrapper.append("text")
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
) {
  const rateStr = `${Math.round(rate).toFixed(0)}%`;
  const lineElement = selectionElement.select(`#${type}`)
    .attr("x", x);

  lineElement.select("svg")
    .attr("x", 0);

  const priceId = `${type}-price`;
  const color = type === "start" ? "#EA3943B2" : "#16C78AB2";

  const margin = right === false ? -70 : 20;
  const labelWrapper = lineElement.select(`#${priceId}`);
  labelWrapper.select("rect")
    .attr("x", margin)
    .attr("y", "0")
    .attr("width", "50")
    .attr("height", "23")
    .attr("rx", 5)
    .style("fill", color);
  labelWrapper.select("text")
    .attr("x", margin + 25)
    .attr("y", "0")
    .attr("dy", "15")
    .attr("text-anchor", "middle")
    .style("fill", "#FFF")
    .html(rateStr);
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
  setFullRange: (fullRange: boolean) => void;
  finishMove: () => void;
  focusPosition: number | null;
  width: number;
  height: number;
  margin?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  },
}

const PoolSelectionGraph: React.FC<PoolSelectionGraphProps> = ({
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
}) => {
  const svgRef = useRef(null);
  const chartRef = useRef<SVGGElement | null>(null);
  const brushRef = useRef<SVGGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const labelHeight = displayLabels > 0 ? 20 : 0;

  const paddingHeight = 0;
  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom - labelHeight - paddingHeight;

  const getRange = () => {
    return scaleX.domain();
  };

  const getBinWidth = () => {
    return width / 20;
  };

  const { redColor, greenColor } = useColorGraph();

  function getInvertX(x: number) {
    return Number(BigNumber(scaleX.invert(x)).toFixed(16));
  }

  const resolvedBins = () => {
    const binWidth = getBinWidth();
    const startXPosition = (getInvertX(0) % binWidth) * -1;

    return Array.from({ length: 22 }, (_, index) => {
      const x: number = startXPosition + (binWidth * index);
      const y: number = liquidityOfTickPoints.find((point, pIndex) => {
        const pointPosition = scaleX(point[0]);
        if (liquidityOfTickPoints.length <= pIndex + 1) {
          return x >= pointPosition;
        }
        const nextPointPosition = scaleX(liquidityOfTickPoints[pIndex + 1][0]);
        if (nextPointPosition > x && x >= pointPosition) {
          return true;
        }
        return false;
      })?.[1] || 0;

      return {
        x,
        y,
        width: binWidth
      };
    });
  };

  /** D3 Variables */
  const defaultScaleX = scaleX.copy();

  const xAxis = d3
    .axisBottom(scaleX)
    .tickFormat(tick => displayTickNumber([getInvertX(0), getInvertX(width)], Number(tick)))
    .tickArguments([displayLabels]);

  const binData = () => {
    const currentPricePosition = currentPrice ? scaleX(currentPrice) : null;
    function fillByBin(bin: { x: number, y: number, width: number }) {
      if (bin.y === 0) {
        return "#4c4c4c";
      }
      const centerX = bin.x + (bin.width / 2);
      if (currentPricePosition && centerX < currentPricePosition) {
        return "url(#gradient-bar-green)";
      }
      return "url(#gradient-bar-red)";
    }

    return resolvedBins().map((bin) => {
      const x = bin.x + 1;
      const y = scaleY(bin.y);
      const fill = fillByBin(bin);
      const width = bin.width - 1;
      const height = boundsHeight - y;

      return {
        x,
        y,
        fill,
        width: width > 0 ? width : 0,
        height: height > 0 ? height : 0
      };
    });
  };

  const brush = d3.brushX()
    .extent([
      [scaleX(0), 0],
      [boundsWidth, boundsHeight + paddingHeight]
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
      const startLineElement = brushElement.select("#start")
        .append("g");
      startLineElement.insert("line")
        .attr("y1", 0)
        .attr("y2", boundsHeight + paddingHeight)
        .style("stroke", "#ff2e2e")
        .attr("stroke-width", 2);
      makeBadge(startLineElement);

      /** End Line */
      brushElement.select("#end").selectChildren().remove();
      const endLineElement = brushElement.select("#end").insert("svg");
      endLineElement.append("line")
        .attr("y1", boundsHeight + paddingHeight)
        .attr("y2", 0)
        .style("stroke", "#2eff82")
        .attr("stroke-width", 2);

      makeBadge(endLineElement, true);
    }

    const selection = event.selection ? event.selection : [0, 0];
    const startPosition = selection[0] as number;
    const endPosition = selection[1] as number;
    brushElement
      .selectAll(".resize")
      .attr("x", data => data === "w" ? startPosition : endPosition);

    const startRate = currentPrice ? (((scaleX.invert(startPosition) - currentPrice) / currentPrice) * 100) : 0;
    const endRate = currentPrice ? (((scaleX.invert(endPosition) - currentPrice) / currentPrice) * 100) : 0;

    const isRightStartLine = startPosition - 75 < 0;
    const isRightEndLine = endPosition + 75 < boundsWidth;
    changeLine(brushElement, "start", startPosition as number, startRate, isRightStartLine);
    changeLine(brushElement, "end", endPosition as number, endRate, isRightEndLine);
  }

  function onBrushEnd(this: SVGGElement, event: d3.D3BrushEvent<any>) {
    if (!brushRef.current) {
      return;
    }

    if (!event.selection) {
      d3.select(brushRef.current)
        .selectAll(".resize")
        .selectChildren()
        .remove();
      setMinPrice(null);
      setMinPrice(null);
    } else {
      const selection = event.selection ? event.selection : [0, 0];
      const startPosition = selection[0] as number;
      const endPosition = selection[1] as number;
      const minPrice = !Number.isNaN(scaleX.invert(startPosition)) ? tickToPrice(priceToNearTick(scaleX.invert(startPosition), feeTier ? SwapFeeTierInfoMap[feeTier].tickSpacing : 2)) : 0;
      const maxPrice = !Number.isNaN(scaleX.invert(endPosition)) ? tickToPrice(priceToNearTick(scaleX.invert(endPosition), feeTier ? SwapFeeTierInfoMap[feeTier].tickSpacing : 2)) : 0;
      setMinPrice(minPrice);
      setMaxPrice(maxPrice);
    }
  }

  useEffect(() => {
    if (!brushRef.current) {
      return;
    }
    const brushElement = d3.select(brushRef.current).call(brush);
    brushElement.selectAll(".resize")
      .data([{ type: "w" }, { type: "e" }])
      .enter()
      .append("svg")
      .attr("id", d => d.type === "w" ? "start" : "end")
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
    zoom.translateTo(
      svgElement,
      scaleX((x1 + x2) / 2),
      0
    );

    brush.extent([
      [scaleX(0), 0],
      [boundsWidth, boundsHeight + paddingHeight]
    ]);
  }

  function updateChart() {
    d3.select(chartRef.current)
      .selectChildren()
      .remove();

    const rects = d3.select(chartRef.current);
    rects.attr("clip-path", "url(#clip)");
    rects.selectAll("rects")
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
      rects.append("g")
        .attr("transform", `translate(0,${boundsHeight})`)
        .call(xAxis);
    }

    // Create a line of current tick.
    const currentPricePosition = currentPrice ? scaleX(currentPrice) : null;
    if (currentPricePosition) {
      if (d3.select(svgRef.current).select("#current-price").empty()) {
        d3.select(svgRef.current)
          .append("line")
          .attr("id", "current-price");
      }
      d3.select(svgRef.current)
        .select("#current-price")
        .attr("x1", currentPricePosition)
        .attr("x2", currentPricePosition)
        .attr("y1", boundsHeight + paddingHeight)
        .attr("y2", 0)
        .attr("stroke-dasharray", 4)
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 1);
    }

  }

  function interactChart() {
    if (brushRef.current) {
      try {
        const zeroPosition = Number(BigNumber(scaleX(0)).toFixed(10));
        if (selectedFullRange) {
          brush?.move(
            d3.select(brushRef.current),
            [zeroPosition, width]
          );
        }
      } catch { }
    }
  }

  useEffect(() => {
    initZoom();
    interactChart();
    updateChart();
  }, [zoomLevel, focusPosition, selectedFullRange]);

  useEffect(() => {
    initZoom();
    if (!brushRef.current || !minPrice || !maxPrice) {
      return;
    }
    const zeroPosition = scaleX(0);
    const brushElement = d3.select(brushRef.current);
    const minPricePosition = selectedFullRange ? zeroPosition : scaleX(minPrice);
    brush.move(
      brushElement,
      [minPricePosition > zeroPosition ? minPricePosition : zeroPosition, scaleX(maxPrice)]
    );
  }, [minPrice, maxPrice, scaleX, selectedFullRange, brush]);

  useEffect(() => {
    const svgElement = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const defElement = svgElement.select("defs");
    const existClipPath = defElement.select("clipPath")
      .empty();

    if (existClipPath) {
      defElement.append("clipPath")
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
          <linearGradient id="gradient-selection-area" gradientTransform="rotate(0)">
            <stop offset="0%" stopColor={"#FF020233"} />
            <stop id="gradient-selection-current-position" offset="50%" stopColor={"rgba(0, 0, 0, 0)"} />
            <stop offset="100%" stopColor={"#00CD2E33"} />
          </linearGradient>
        </defs>
        <g
          ref={chartRef}
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[margin.left, margin.top + paddingHeight].join(",")})`}
        />
        <g
          ref={brushRef}
          className={"brush"}
          width={boundsWidth}
          height={boundsHeight + paddingHeight}
          transform={`translate(${[margin.left, margin.top].join(",")})`}
        />
      </svg>
      <div ref={tooltipRef} className="tooltip-container">
      </div>
    </PoolSelectionGraphWrapper>
  );
};

export default PoolSelectionGraph;