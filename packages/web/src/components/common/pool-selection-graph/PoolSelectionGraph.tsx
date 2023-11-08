import React, { useEffect, useRef } from "react";
import { PoolSelectionGraphWrapper } from "./PoolSelectionGraph.styles";
import * as d3 from "d3";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { tickToPrice } from "@utils/swap-utils";
import BigNumber from "bignumber.js";

export interface PoolSelectionGraphProps {
  bins: PoolBinModel[];
  currentTick: number | null;
  zoomLevel: number;
  displayLabels?: number;
  minPrice: number | null;
  maxPrice: number | null;
  setMinPrice: (tick: number | null) => void;
  setMaxPrice: (tick: number | null) => void;
  selectedFullRange: boolean;
  setSelectedFullRange: (selected: boolean) => void;
  focusTick: number | null;
  width: number;
  height: number;
  margin?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  },
}

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
  const linePosition = right ? 0 : -12;
  const rateStr = `${Math.round(rate).toFixed(0)}%`;
  const lineElement = selectionElement.select(`#${type}`)
    .attr("x", x);

  lineElement.select("svg")
    .attr("x", linePosition);

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

const PoolSelectionGraph: React.FC<PoolSelectionGraphProps> = ({
  bins,
  currentTick = null,
  displayLabels = 8,
  width,
  height,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedFullRange,
  setSelectedFullRange,
  focusTick,
  zoomLevel,
  margin = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
}) => {
  const svgRef = useRef(null);
  const chartRef = useRef<SVGGElement | null>(null);
  const brushRef = useRef<SVGGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const labelHeight = displayLabels > 0 ? 20 : 0;

  const paddingHeight = 20;
  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom - labelHeight - paddingHeight;
  const tickAmount = 10000;

  const [, maxX] = d3.extent(bins.map(bin => bin.currentTick));
  const maxXTick = tickToPrice(maxX ?? 1) * 10000;
  const binRange = maxXTick / tickAmount;
  const currentPrice = tickToPrice(currentTick || 0);

  const resolvedBins = () => {
    const sortedBins = bins.sort((b1, b2) => b1.currentTick - b2.currentTick)
      .map(bin => ({ ...bin, currentPrice: tickToPrice(bin.currentTick) }));
    console.log(sortedBins);
    return Array.from(
      { length: tickAmount },
      (_, index) => {
        const startPrice = binRange * index;
        const endPrice = startPrice + binRange;
        return sortedBins.filter(
          bin =>
            bin.currentPrice < endPrice &&
            bin.currentPrice >= startPrice)
          .reduce((a, b) => a + b.totalSupply, 0);
      },
    );
  };

  /** D3 Variables */
  const defaultScaleX = d3
    .scaleLinear()
    .domain([-maxXTick, maxXTick])
    .range([margin.left, boundsWidth]);

  const scaleX = defaultScaleX.copy();
  const xAxis = d3
    .axisBottom(scaleX)
    .tickArguments([displayLabels]);
  const [, max] = d3.extent(resolvedBins());

  const scaleY = d3
    .scaleLinear()
    .domain([0, max || 0])
    .range([boundsHeight, 0]);

  const binData = () => {
    function fillByBin(num: number, index: number) {
      if (num === 0) {
        return "#4c4c4c";
      }
      if (currentTick && index * binRange < tickToPrice(currentTick)) {
        return "url(#gradient-bar-green)";
      }
      return "url(#gradient-bar-red)";
    }

    return resolvedBins().map((bin, index) => {
      const x = scaleX(index * binRange);
      const y = bin < 100 ? boundsHeight - 5 : scaleY(bin);
      const fill = fillByBin(bin, index);
      const width = scaleX(binRange) - scaleX(0) > 2 ? scaleX(binRange) - scaleX(0) - 2 : scaleX(binRange) - scaleX(0);
      const height = boundsHeight - y;

      return {
        x,
        y,
        fill,
        width,
        height
      };
    });
  };

  /** Brush */
  const brush = d3.brushX()
    .extent([
      [scaleX(0), 0],
      [boundsWidth, boundsHeight + paddingHeight]
    ])
    .on("start brush end", onBrush);

  function onBrush(event: d3.D3BrushEvent<unknown>) {
    if (event.selection !== null) {
      if (Array.isArray(event.selection)) {
        if (typeof event.selection[0] !== "number" || typeof event.selection[1] !== "number") {
          return;
        }

        if (!brushRef.current) {
          return;
        }

        if (event.selection[0] === event.selection[1]) {
          setMinPrice(null);
          setMaxPrice(null);
          const selectionElement = d3.select(brushRef.current);
          selectionElement.select("#start").remove();
          selectionElement.select("#end").remove();
          return;
        }

        const minPricePosition = event.selection[0];
        const minPrice = scaleX.invert(minPricePosition);
        const maxPricePosition = event.selection[1];
        const maxPrice = scaleX.invert(maxPricePosition);

        setSelectedFullRange(false);

        if (event.type === "drag" || event.type === "end") {
          setMinPrice(BigNumber(minPrice.toPrecision(12)).toNumber());
          setMaxPrice(BigNumber(maxPrice.toPrecision(12)).toNumber());
        }
        initBrushGradient(currentPrice, minPrice, maxPrice);
      }
    }
  }

  function initBrushGradient(currentPrice: number | null, minPrice: number | null, maxPrice: number | null) {
    if (!currentPrice || !minPrice || !maxPrice) {
      return;
    }

    function getCurrentTickOffset(currentPrice: number, minPrice: number, maxPrice: number) {
      const diffMinPrice = currentPrice - minPrice;
      const diffMaxPrice = maxPrice - currentPrice;
      if (diffMinPrice <= 0) {
        return "0%";
      }
      if (diffMaxPrice <= 0) {
        return "100%";
      }
      return `${(diffMinPrice / (diffMaxPrice + diffMinPrice)) * 100}%`;
    }

    const currentTickOffset = getCurrentTickOffset(currentPrice, minPrice, maxPrice);
    d3.select(svgRef.current)
      .select("defs")
      .select("#gradient-selection-current-position")
      .attr("offset", currentTickOffset);

    const selectionElement = d3.select(brushRef.current);

    /** Start Line */
    if (selectionElement.selectChild("#start").empty()) {
      const startLineElement = selectionElement.insert("svg")
        .attr("id", "start");
      startLineElement.insert("line")
        .attr("y1", 0)
        .attr("y2", boundsHeight + paddingHeight)
        .style("stroke", "#ff2e2e")
        .attr("stroke-width", 2);

      makeBadge(startLineElement);
    }

    /** End Line */
    if (selectionElement.selectChild("#end").empty()) {
      const endLineElement = selectionElement.insert("svg")
        .attr("id", "end");

      endLineElement.insert("line")
        .attr("y1", boundsHeight + paddingHeight)
        .attr("y2", 0)
        .style("stroke", "#2eff82")
        .attr("stroke-width", 2);

      makeBadge(endLineElement, true);
    }

    /** Draw Lines */
    const isRightStartLine = scaleX(minPrice) - 75 < 0;
    const minPriceRate = currentPrice === 0 ? 0 : (minPrice - currentPrice) / currentPrice * 100;
    changeLine(selectionElement, "start", scaleX(minPrice), minPriceRate, isRightStartLine);

    const isRightEndLine = scaleX(maxPrice) + 75 < boundsWidth;
    const maxPriceRate = currentPrice === 0 ? 0 : (maxPrice - currentPrice) / currentPrice * 100;
    changeLine(selectionElement, "end", scaleX(maxPrice), maxPriceRate, isRightEndLine);
  }

  /** Zoom */
  const zoom: d3.ZoomBehavior<any, unknown> = d3
    .zoom()
    .scaleExtent([-maxXTick, maxXTick])
    .translateExtent([
      [0, 0],
      [boundsWidth, boundsHeight]
    ])
    .extent([
      [0, 0],
      [boundsWidth, boundsHeight]
    ])
    .on("zoom", onZoom);

  function onZoom(event: d3.D3ZoomEvent<SVGElement, null>) {
    const blocks = ["brush", "click"];
    if (event?.sourceEvent && blocks.includes(event.sourceEvent.type)) return; // ignore zoom-by-brush
    const transform = event.transform;
    scaleX.domain(transform.rescaleX(defaultScaleX).domain());
  }

  function initZoom() {
    const svgElement = d3.select(svgRef.current);
    const scaleRate = BigNumber(2).pow(zoomLevel * 3).toNumber();
    zoom.scaleTo(svgElement, scaleRate, [scaleX(focusTick || 0), 0]);

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
    if (currentTick) {
      if (d3.select(svgRef.current).select("#current-price").empty()) {
        d3.select(svgRef.current)
          .append("line")
          .attr("id", "current-price");
      }
      d3.select(svgRef.current)
        .select("#current-price")
        .attr("x1", scaleX(tickToPrice(currentTick)))
        .attr("x2", scaleX(tickToPrice(currentTick)))
        .attr("y1", boundsHeight + paddingHeight)
        .attr("y2", 0)
        .attr("stroke-dasharray", 4)
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 1);
    }

  }

  function interactChart() {
    if (focusTick) {
      const svgElement = d3.select(svgRef.current);
      zoom.translateTo(
        svgElement,
        scaleX(focusTick),
        0
      );
    }
    initZoom();
    updateChart();

    if (brushRef.current && minPrice && maxPrice) {
      try {
        initBrushGradient(currentPrice, minPrice, maxPrice);
        brush.move(
          d3.select(brushRef.current),
          [scaleX(minPrice), scaleX(maxPrice)]
        );
      } catch { }
    }
  }

  useEffect(() => {
    interactChart();
  }, [zoomLevel, focusTick, minPrice, maxPrice, currentTick]);

  useEffect(() => {
    if (selectedFullRange && brushRef.current) {
      brush.move(
        d3.select(brushRef.current),
        [scaleX(0), maxXTick]
      );
    }
  }, [selectedFullRange]);

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
            <stop offset="0%" stopColor="#16C78AB2" />
            <stop offset="100%" stopColor="#16C78A24" />
          </linearGradient>
          <linearGradient id="gradient-bar-red" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#EA3943B2" />
            <stop offset="100%" stopColor="#EA394324" />
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