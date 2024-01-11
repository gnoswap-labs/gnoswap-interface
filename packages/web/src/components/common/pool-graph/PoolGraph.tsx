import React, { useEffect, useMemo, useRef, useState } from "react";
import { PoolGraphTooltipWrapper, PoolGraphWrapper } from "./PoolGraph.styles";
import * as d3 from "d3";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { TokenModel } from "@models/token/token-model";
import { toUnitFormat } from "@utils/number-utils";
import { useColorGraph } from "@hooks/common/use-color-graph";
import { tickToPriceStr } from "@utils/swap-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import FloatingTooltip from "../tooltip/FloatingTooltip";
import { FloatingPosition } from "@hooks/common/use-floating-tooltip";
import MissingLogo from "../missing-logo/MissingLogo";

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
  position?: FloatingPosition;
  offset?: number;
  maxTickPosition?: number | null;
  minTickPosition?: number | null;
}

interface TooltipInfo {
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: string | null;
  tokenBAmount: string | null;
  tokenARange: {
    min: string | null;
    max: string | null;
  };
  tokenBRange: {
    min: string | null;
    max: string | null;
  };
}

const PoolGraph: React.FC<PoolGraphProps> = ({
  tokenA,
  tokenB,
  bins,
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
  rectWidth,
  position,
  offset = 20,
  maxTickPosition = 0,
  minTickPosition = 0,
}) => {
  const defaultMinX = Math.min(...bins.map(bin => bin.minTick));
  const svgRef = useRef<SVGSVGElement>(null);
  const chartRef = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const { redColor, greenColor } = useColorGraph();

  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom;

  const minX = d3.min(bins, (bin) => bin.minTick - defaultMinX) || 0;
  const maxX = d3.max(bins, (bin) => bin.maxTick - defaultMinX) || 0;

  const resolvedBins = useMemo(() => {
    const maxHeight = d3.max(bins, (bin) => bin.liquidity) || 0;
    return bins.sort((b1, b2) => b1.minTick - b2.minTick).map(bin => ({
      ...bin,
      minTick: bin.minTick - defaultMinX,
      maxTick: bin.maxTick - defaultMinX,
      liquidity: bin.liquidity * boundsHeight / maxHeight
    }));
  }, [bins, boundsHeight, defaultMinX]);
  const maxHeight = d3.max(resolvedBins, (bin) => bin.liquidity) || 0;

  const [tickOfPrices, setTickOfPrices] = useState<{ [key in number]: string }>({});
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const [positionX, setPositionX] = useState<number | null>(null);
  const [positionY, setPositionY] = useState<number | null>(null);

  /** D3 Variables */
  const defaultScaleX = d3
    .scaleLinear()
    .domain([0, maxX - minX])
    .range([margin.left, boundsWidth]);

  const scaleX = defaultScaleX.copy();

  const scaleY = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, maxHeight || 0])
      .range([boundsHeight, 0]);
  }, [boundsHeight, maxHeight]);
  const centerX = currentTick ?? ((minX && maxX) ? (minX + maxX) / 2 : 0);

  function getTickSpacing() {
    if (resolvedBins.length < 1) {
      return 0;
    }
    if (resolvedBins.length === 2) {
      return 20;
    }
    const spacing = scaleX(resolvedBins[1].minTick) - scaleX(resolvedBins[0].minTick);
    if (spacing < 2) {
      return spacing;
    }
    return spacing;
  }

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

  /** Update Chart by data */
  function updateChart() {
    const tickSpacing = rectWidth ? rectWidth : getTickSpacing();
    const centerPosition = scaleX(centerX - defaultMinX) - tickSpacing;

    // Retrieves the colour of the chart bar at the current tick.
    function fillByBin(bin: PoolBinModel) {
      if (maxTickPosition && minTickPosition && (scaleX(bin.minTick) < minTickPosition - tickSpacing || scaleX(bin.minTick) > maxTickPosition)) 
        return "#1C2230";
      if (currentTick && (bin.minTick) < Number(currentTick - defaultMinX)) {
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
      .data(resolvedBins)
      .enter()
      .append("rect")
      .style("fill", bin => fillByBin(bin))
      .style("stroke-width", "1")
      .attr("class", "rects")
      .attr("x", bin => scaleX(bin.minTick))
      .attr("y", bin => scaleY(bin.liquidity))
      .attr("width", tickSpacing)
      .attr("height", bin => boundsHeight - scaleY(bin.liquidity));

    // Create a line of current tick.
    if (currentTick) {
      rects.append("line")
        .attr("x1", centerPosition + tickSpacing)
        .attr("x2", centerPosition + tickSpacing)
        .attr("y1", 0)
        .attr("y2", boundsHeight)
        .attr("stroke-dasharray", 4)
        .attr("stroke", `${themeKey === "dark" ? "#FFFFFF" : "#596782"}`)
        .attr("stroke-width", 0.5);
    }
  }

  function onMouseoverChartBin(event: MouseEvent) {
    if (!mouseover) {
      return;
    }
    
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    const bin = resolvedBins.find(bin => {
      const minX = scaleX(bin.minTick);
      const maxX = scaleX(bin.maxTick + 1);
      if (mouseY < 0.001 || mouseY >= height - 0.001) {
        return false;
      }
      if (bin.liquidity <= 0) {
        return false;
      }
      return mouseX >= minX && mouseX <= maxX;
    });
    if (!bin) {
      setPositionX(null);
      setPositionY(null);
      return;
    }
    if (Math.abs(height - mouseY - 0.62)> boundsHeight - scaleY(bin.liquidity)) {
      setPositionX(null);
      setPositionX(null);
      setTooltipInfo(null);
      return;
    }
    const minTick = bin.minTick + defaultMinX;
    const maxTick = bin.maxTick + defaultMinX;
    const tokenARange = {
      min: tickOfPrices[minTick] || null,
      max: tickOfPrices[maxTick] || null,
    };
    const tokenBRange = {
      min: tickOfPrices[-minTick] || null,
      max: tickOfPrices[-maxTick] || null,
    };
    const tokenAAmountStr = makeDisplayTokenAmount(tokenA, bin.reserveTokenA);
    const tokenBAmountStr = makeDisplayTokenAmount(tokenB, bin.reserveTokenB);
    
    setTooltipInfo({
      tokenA: tokenA,
      tokenB: tokenB,
      tokenAAmount: tokenAAmountStr ? toUnitFormat(tokenAAmountStr) : "-",
      tokenBAmount: tokenBAmountStr ? toUnitFormat(tokenBAmountStr) : "-",
      tokenARange: tokenARange,
      tokenBRange: tokenBRange,
    });
    setPositionX(mouseX);
    setPositionY(mouseY);
  }

  function onMouseoutChartBin() {
    setPositionX(null);
    setPositionY(null);
  }

  function onMouseoverClear(event: MouseEvent) {
    const { clientX, clientY } = event;
    if (!svgRef.current?.getClientRects()[0]) {
      setTooltipInfo(null);
      return;
    }
    const { left, right, top, bottom } = svgRef.current?.getClientRects()[0];
    if (
      (clientX < left || clientX > right) ||
      (clientY < top || clientY > bottom)
    ) {
      setTooltipInfo(null);
    }
  }
  useEffect(() => {
    if (bins.length > 0) {
      new Promise<{ [key in number]: string }>(resolve => {
        const tickOfPrices = bins.flatMap(bin => {
          const minTick = bin.minTick;
          const maxTick = bin.maxTick;
          return [minTick, maxTick, -minTick, -maxTick];
        })
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

  useEffect(() => {
    const svgElement = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
      .on("mousemove", onMouseoverChartBin)
      .on("mouseout", onMouseoutChartBin);

    svgElement.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    updateChart();
  }, [width, height, scaleX, scaleY]);

  useEffect(() => {
    if (tooltipInfo) {
      window.addEventListener("scroll", onMouseoutChartBin);
      return () => window.removeEventListener("scroll", onMouseoutChartBin);
    }
  }, [tooltipInfo]);

  useEffect(() => {
    if (tooltipInfo) {
      window.addEventListener("mousemove", onMouseoverClear);
      return () => window.removeEventListener("mousemove", onMouseoverClear);
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
          tooltipInfo && positionX && positionY ? (
            <PoolGraphTooltipWrapper ref={tooltipRef} className={`tooltip-container ${themeKey}-shadow}`}>
              <PoolGraphBinTooptip tooltipInfo={tooltipInfo} />
            </PoolGraphTooltipWrapper>
          ) : null
        }>
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
      </FloatingTooltip>
    </PoolGraphWrapper >
  );
};

export default PoolGraph;

interface PoolGraphBinTooptipProps {
  tooltipInfo: TooltipInfo | null;
}

const PoolGraphBinTooptip: React.FC<PoolGraphBinTooptipProps> = ({
  tooltipInfo,
}) => {

  const tokenAPriceRangeStr = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { tokenARange, tokenB } = tooltipInfo;
    if (tokenARange?.min === null || tokenARange?.max === null) {
      return "-";
    }
    return `${tokenARange.min} - ${tokenARange.max} ${tokenB.symbol}`;
  }, [tooltipInfo]);

  const tokenBPriceRangeStr = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { tokenBRange, tokenA } = tooltipInfo;
    if (tokenBRange?.min === null || tokenBRange?.max === null) {
      return "-";
    }
    return `${tokenBRange.min} - ${tokenBRange.max} ${tokenA.symbol}`;
  }, [tooltipInfo]);

  return tooltipInfo ? (
    <div className="tooltip-wrapper">
      <div className="header">
        <div className="row">
          <span className="token">Quote</span>
          <span className="price-range">Current Price</span>
        </div>
      </div>
      <div className="content">
        <div className="row">
          <span className="token">
            <MissingLogo symbol={tooltipInfo.tokenA.symbol} url={tooltipInfo.tokenA.logoURI} className="logo" width={20} mobileWidth={20} />
            <span>{tooltipInfo.tokenA.symbol} Price</span>
          </span>
          <span className="price-range">{tokenAPriceRangeStr}</span>
        </div>
        <div className="row">
          <span className="token">
            <MissingLogo symbol={tooltipInfo.tokenB.symbol} url={tooltipInfo.tokenB.logoURI} className="logo" width={20} mobileWidth={20} />
            <span>{tooltipInfo.tokenB.symbol} Price</span>
          </span>
          <span className="price-range">{tokenBPriceRangeStr}</span>
        </div>
      </div>
      <div className="header mt-8">
        <div className="row">
          <span className="token">Token</span>
          <span className="amount">Amount</span>
          <span className="price-range">Price Range</span>
        </div>
      </div>
      <div className="content">
        <div className="row">
          <span className="token">
            <MissingLogo symbol={tooltipInfo.tokenA.symbol} url={tooltipInfo.tokenA.logoURI} className="logo" width={20} mobileWidth={20} />
            <span>{tooltipInfo.tokenA.symbol}</span>
          </span>
          <span className="amount">
            <span className="hidden">{tooltipInfo.tokenAAmount || "0"}</span>
          </span>
          <span className="price-range">{tokenAPriceRangeStr}</span>
        </div>
        <div className="row">
          <span className="token">
            <MissingLogo symbol={tooltipInfo.tokenB.symbol} url={tooltipInfo.tokenB.logoURI} className="logo" width={20} mobileWidth={20} />
            <span>{tooltipInfo.tokenB.symbol}</span>
          </span>
          <span className="amount">
            <span className="hidden">{tooltipInfo.tokenBAmount || "0"}</span>
          </span>
          <span className="price-range">{tokenBPriceRangeStr}</span>
        </div>
      </div>
    </div>
  ) : <></>;
};