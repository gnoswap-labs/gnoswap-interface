import React, { useEffect, useMemo, useRef, useState } from "react";
import { PoolGraphWrapper } from "./PoolGraph.styles";
import * as d3 from "d3";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { MAX_TICK, MIN_TICK } from "@constants/swap.constant";
import { renderToStaticMarkup } from "react-dom/server";
import { TokenModel } from "@models/token/token-model";
import { toMillionFormat } from "@utils/number-utils";
import { useColorGraph } from "@hooks/common/use-color-graph";
import { tickToPriceStr } from "@utils/swap-utils";

export interface PoolGraphProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  bins: PoolBinModel[];
  currentTick: number | null;
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
  },
  themeKey: "dark" | "light";
  rectWidth?: number;
}

const PoolGraph: React.FC<PoolGraphProps> = ({
  tokenA,
  tokenB,
  bins,
  currentTick = null,
  mouseover,
  zoomable,
  visibleLabel,
  width,
  height,
  margin = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  themeKey,
  rectWidth,
}) => {
  const [tickOfPrices, setTickOfPrices] = useState<{ [key in number]: string }>({});

  useEffect(() => {
    if (bins.length > 0) {
      new Promise<{ [key in number]: string }>(resolve => {
        const tickOfPrices = bins.flatMap(bin => [bin.minTick, bin.maxTick, -bin.minTick, -bin.maxTick])
          .reduce<{ [key in number]: string }>((acc, current) => {
            if (!acc[current]) {
              acc[current] = tickToPriceStr(current).toString();
            }
            return acc;
          }, {});
        resolve(tickOfPrices);
      }).then(setTickOfPrices);
    }
  }, [bins]);

  const svgRef = useRef(null);
  const chartRef = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const { redColor, greenColor } = useColorGraph();

  const tickFullRange = MAX_TICK - MIN_TICK;
  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom;

  /** D3 Variables */
  const defaultScaleX = d3
    .scaleLinear()
    .domain([MIN_TICK, MAX_TICK])
    .range([margin.left, boundsWidth]);

  const scaleX = defaultScaleX.copy();
  const xAxis = d3
    .axisBottom(scaleX)
    .tickSize(0)
    .tickFormat(v => v.toString());
  const [minX, maxX] = d3.extent(bins, (bin) => bin.minTick);
  const [, max] = d3.extent(bins, (bin) => bin.liquidity);

  const scaleY = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [boundsHeight, max]);
  const centerX = currentTick ?? ((minX && maxX) ? (minX + maxX) / 2 : 0);

  /** Zoom */
  const zoom: d3.ZoomBehavior<any, unknown> = d3
    .zoom()
    .scaleExtent([0, tickFullRange])
    .translateExtent([
      [0, 0],
      [boundsWidth, boundsHeight]
    ])
    .extent([
      [0, 0],
      [boundsWidth, boundsHeight]
    ])
    .on("zoom", onZoom);

  function initZoom() {
    const svgElement = d3.select(svgRef.current);
    const minXTick = minX || 0;
    const maxXTick = maxX || 0;
    const tick = currentTick || 0;
    const distance = Math.abs(tick - minXTick) > Math.abs(tick - maxXTick)
      ? Math.abs(tick - minXTick)
      : Math.abs(tick - maxXTick);
    const scaleRate = (MAX_TICK / distance);
    zoom.scaleTo(svgElement, scaleRate, [scaleX(centerX), 0]);
  }

  function onZoom(event: d3.D3ZoomEvent<SVGElement, null>) {
    if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    const transform = event.transform;
    scaleX.domain(transform.rescaleX(defaultScaleX).domain());

    updateChart();
  }

  function getTickSpacing() {
    if (bins.length < 1) {
      return 0;
    }
    if (bins.length === 2) {
      return 20;
    }
    const spacing = scaleX(bins[0].maxTick) - scaleX(bins[0].minTick);
    if (spacing < 2) {
      return spacing;
    }
    return spacing - 1;
  }

  /** Update Chart by data */
  function updateChart() {
    const tickSpacing = rectWidth ? rectWidth : getTickSpacing();
    const centerPosition = scaleX(centerX) - tickSpacing / 2;

    // Retrieves the colour of the chart bar at the current tick.
    function fillByBin(bin: PoolBinModel) {
      if (currentTick && (bin.minTick) < currentTick) {
        return "url(#gradient-bar-green)";
      }
      return "url(#gradient-bar-red)";
    }

    // Clean child elements.
    d3.select(chartRef.current).selectChildren().remove();

    // Create a chart bar.
    const rects = d3.select(chartRef.current);
    rects.attr("clip-path", "url(#clip)");
    rects.selectAll("rects")
      .data(bins)
      .enter()
      .append("rect")
      .style("fill", bin => fillByBin(bin))
      .attr("class", "rects")
      .attr("x", bin => scaleX(bin.minTick))
      .attr("y", bin => scaleY(bin.liquidity))
      .attr("width", tickSpacing)
      .attr("height", bin => boundsHeight - scaleY(bin.liquidity))
      .on("mouseover", onMouseoverChartBin)
      .on("mousemove", onMouseoverChartBin)
      .on("mouseout", onMouseoutChartBin);

    // Create a line of current tick.
    if (currentTick) {
      rects.append("line")
        .attr("x1", centerPosition + tickSpacing / 2)
        .attr("x2", centerPosition + tickSpacing / 2)
        .attr("y1", 0)
        .attr("y2", boundsHeight)
        .attr("stroke-dasharray", 4)
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 0.5);
    }

    // Create x axis labels.
    if (visibleLabel) {
      rects.append("g")
        .attr("transform", `translate(0,${boundsHeight})`)
        .call(xAxis);
    }
  }

  function onMouseoverChartBin(event: MouseEvent, bin: PoolBinModel) {
    if (mouseover && tooltipRef.current) {
      if (tooltipRef.current.getAttribute("bin-id") !== `${bin.minTick}`) {
        const tokenARange = {
          min: tickOfPrices[bin?.minTick] || null,
          max: tickOfPrices[bin?.maxTick] || null,
        };
        const tokenBRange = {
          min: tickOfPrices[-bin?.maxTick] || null,
          max: tickOfPrices[-bin?.minTick] || null,
        };
        const content = renderToStaticMarkup(
          <PoolGraphBinTooptip
            tokenA={tokenA}
            tokenB={tokenB}
            tokenAAmount={bin.reserveTokenA}
            tokenBAmount={bin.reserveTokenB}
            tokenARange={tokenARange}
            tokenBRange={tokenBRange}
          />
        );
        tooltipRef.current.innerHTML = content;
        tooltipRef.current.setAttribute("bin-id", `${bin.minTick}`);
      }
      const tooltipPositionX = `${event.offsetX - 195}px`;
      const tooltipPositionY = `${event.offsetY - 130 - 30}px`;
      tooltipRef.current.setAttribute("style", `left:${tooltipPositionX}; top:${tooltipPositionY};`);
    }
  }

  function onMouseoutChartBin() {
    if (mouseover && tooltipRef.current) {
      tooltipRef.current.innerHTML = "";
    }
  }

  useEffect(() => {
    const svgElement = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    if (zoomable) {
      svgElement.call(zoom);
    }

    svgElement.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    initZoom();

    updateChart();
  }, [scaleX, scaleY]);

  return (
    <PoolGraphWrapper>
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
        </defs>
        <g
          ref={chartRef}
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[margin.left, margin.top].join(",")})`}
        >
        </g>
      </svg>
      <div ref={tooltipRef} className={`tooltip-container ${themeKey}-shadow`}>
      </div>
    </PoolGraphWrapper>
  );
};

export default PoolGraph;

interface PoolGraphBinTooptipProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: number;
  tokenBAmount: number;
  tokenARange: {
    min: string | null;
    max: string | null;
  };
  tokenBRange: {
    min: string | null;
    max: string | null;
  };
}

const PoolGraphBinTooptip: React.FC<PoolGraphBinTooptipProps> = ({
  tokenA,
  tokenB,
  tokenAAmount,
  tokenBAmount,
  tokenARange,
  tokenBRange,
}) => {

  const tokenAPriceRangeStr = useMemo(() => {
    if (tokenARange?.min === null || tokenARange?.max === null) {
      return "-";
    }
    return `${tokenARange.min} - ${tokenARange.max} ${tokenB.symbol}`;
  }, [tokenARange.max, tokenARange.min, tokenB.symbol]);

  const tokenBPriceRangeStr = useMemo(() => {
    if (tokenBRange?.min === null || tokenBRange?.max === null) {
      return "-";
    }
    return `${tokenBRange.min} - ${tokenBRange.max} ${tokenA.symbol}`;
  }, [tokenA.symbol, tokenBRange.max, tokenBRange.min]);

  return (
    <div className="tooltip-wrapper">
      <div className="header">
        <div className="row">
          <span className="token">Token</span>
          <span className="amount">Amount</span>
          <span className="price-range">Price Range</span>
        </div>
      </div>
      <div className="content">
        <div className="row">
          <span className="token">
            <img className="logo" src={tokenA.logoURI} alt="logo" />
            <span>{tokenA.symbol}</span>
          </span>
          <span className="amount">
            <span className="hidden">{toMillionFormat(tokenAAmount)}</span>
          </span>
          <span className="price-range">{tokenAPriceRangeStr}</span>
        </div>
        <div className="row">
          <span className="token">
            <img className="logo" src={tokenB.logoURI} alt="logo" />
            <span>{tokenB.symbol}</span>
          </span>
          <span className="amount">
            <span className="hidden">{toMillionFormat(tokenBAmount)}</span>
          </span>
          <span className="price-range">{tokenBPriceRangeStr}</span>
        </div>
      </div>
    </div>
  );
};