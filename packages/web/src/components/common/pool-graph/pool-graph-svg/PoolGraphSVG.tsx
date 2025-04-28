import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import * as d3 from "d3";

import { useColorGraph } from "@hooks/common/use-color-graph";
import { ThemeKeys } from "@styles/ThemeTypes";

import { ReservedBin } from "../PoolGraph.types";
import { PoolGraphSVGContainer } from "./PoolGraphSVG.styles";
import { useTheme } from "@emotion/react";

interface PoolGraphSVGProps {
  graphId: string;
  width: number;
  height: number;
  margin?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  currentTick?: number | null;
  reservedBins: ReservedBin[];
  maxTickPosition?: number | null;
  minTickPosition?: number | null;
  binSpacing: number;
  isReversed: boolean;
  disabled?: boolean;
  themeKey: ThemeKeys;
  scaleX: d3.ScaleLinear<number, number, never>;
  scaleY: d3.ScaleLinear<number, number, never>;
  d3Position: {
    defaultMinX: number;
    minX: number;
    maxX: number;
  };
  zoomLevel: number;
  currentTickRelative: number | null;
  shiftIndex: number;
  disableBlackBars?: boolean;
  onMouseEnter?: (event: React.MouseEvent | React.TouchEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onTouchStart?: (event: React.TouchEvent) => void;
  onMouseMove: (event: MouseEvent) => void;
  onMouseOut: () => void;
}

const PoolGraphSVG = forwardRef<SVGSVGElement, PoolGraphSVGProps>(
  (
    {
      graphId,
      width,
      height,
      margin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      currentTick,
      currentTickRelative,
      binSpacing,
      maxTickPosition = 0,
      minTickPosition = 0,
      reservedBins,
      themeKey,
      isReversed,
      disabled,
      scaleX,
      scaleY,
      d3Position,
      onMouseEnter,
      onMouseLeave,
      onTouchStart,
      onMouseMove,
      onMouseOut,
      zoomLevel,
      shiftIndex,
      disableBlackBars,
    },
    forwardedRef,
  ) => {
    const theme = useTheme();

    const svgRef = useRef<SVGSVGElement>(null);
    useImperativeHandle(forwardedRef, () => svgRef.current as SVGSVGElement);

    const chartRef = useRef(null);
    const { redColor, greenColor } = useColorGraph();

    const boundsWidth = width - margin.right - margin.left;
    const boundsHeight = height - margin.top - margin.bottom;

    // D3 - Dimension Definition
    const { maxX } = d3Position;

    const hasCurrentTick = useMemo(() => currentTick != null, [currentTick]);

    const currentTickPosition = useMemo(() => {
      // centred if reservedBins is empty or currentTickRelative is not present
      if (reservedBins.length === 0 || !currentTickRelative) {
        return boundsWidth / 2;
      }

      // Use calculated position in normal case
      return scaleX(currentTickRelative);
    }, [boundsWidth, currentTickRelative, scaleX, reservedBins.length]);

    /** Update Chart by data */
    function updateChart() {
      // Retrieves the colour of the chart bar at the current tick.
      function fillByBin(bin: ReservedBin) {
        if (disableBlackBars) {
          if (hasCurrentTick && currentTickRelative !== null) {
            if (bin.minTick < currentTickRelative) {
              return `url(#gradient-bar-green-${graphId})`;
            }
            return `url(#gradient-bar-red-${graphId})`;
          }
          return `url(#gradient-bar-red-${graphId})`;
        }

        let isBlackBar = !!(
          maxTickPosition !== null &&
          minTickPosition !== null &&
          (scaleX(bin.minTick) < minTickPosition - binSpacing || scaleX(bin.minTick) > maxTickPosition)
        );

        if (isReversed) {
          isBlackBar = !!(
            maxTickPosition !== null &&
            minTickPosition !== null &&
            (scaleX(bin.minTick) < scaleX(maxX) - maxTickPosition - binSpacing ||
              scaleX(bin.minTick) > scaleX(maxX) - minTickPosition)
          );
        }
        if (isBlackBar) return themeKey === "dark" ? "#1C2230" : "#E0E8F4";

        if (hasCurrentTick && currentTickRelative !== null) {
          if (bin.minTick < currentTickRelative) {
            return `url(#gradient-bar-green-${graphId})`;
          }
          return `url(#gradient-bar-red-${graphId})`;
        }
        return `url(#gradient-bar-red-${graphId})`;
      }

      // Create a chart bar.
      const rects = d3.select(chartRef.current);
      rects.attr("clip-path", "url(#clip)");

      // D3 - Draw Current tick (middle line)
      rects.select("line").remove();
      if (hasCurrentTick && rects.select("line").empty()) {
        rects
          .append("line")
          .attr("x1", currentTickPosition)
          .attr("x2", currentTickPosition)
          .attr("y1", 0)
          .attr("y2", boundsHeight)
          .attr("stroke-dasharray", 3)
          .attr("stroke", `${themeKey === "dark" ? "#E0E8F4" : "#596782"}`)
          .attr("stroke-width", 1);
      }

      // D3 - Draw reservedBins as bars
      rects.selectAll("g").remove();
      if (!disabled && rects.selectAll("g").size() === 0 && reservedBins.length > 0) {
        rects
          .selectAll("rects")
          .data(reservedBins)
          .enter()
          .append("g")
          .attr("class", "bin-wrapper")
          .attr("id", bin => `pool-graph-bin-${graphId}-${bin.index}`)
          .each(function (bin) {
            const binX = scaleX(bin.minTick);
            const binWidth = Math.max(0.5, scaleX(bin.maxTick) - binX);

            d3.select(this)
              .append("rect")
              .style("fill", "transparent")
              .attr("class", "bin-inner")
              .style("stroke-width", "0")
              .attr("x", binX)
              .attr("width", binWidth)
              .attr("y", () => {
                const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
                return scaleYComputation - (scaleYComputation > height - 3 && scaleYComputation !== height ? 3 : 0);
              })
              .attr("height", () => {
                const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
                return (
                  boundsHeight -
                  scaleYComputation +
                  (scaleYComputation > height - 3 && scaleYComputation !== height ? 3 : 0)
                );
              });

            const heightPadding = 3;
            d3.select(this)
              .append("rect")
              .style("fill", fillByBin(bin))
              .attr("class", "bin-inner")
              .style("stroke-width", "0")
              .attr("x", binX + 1)
              .attr("width", Math.max(0, binWidth - 0.5))
              .attr("y", () => {
                const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
                return scaleYComputation - (scaleYComputation > height - 3 && scaleYComputation !== height ? 3 : 0);
              })
              .attr("height", () => {
                const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
                return (
                  boundsHeight -
                  scaleYComputation +
                  (scaleYComputation > height - heightPadding && scaleYComputation !== height ? heightPadding : 0)
                );
              });
          });
      }
    }

    useEffect(() => {
      //  D3 - Draw bin and define interaction
      if (!svgRef?.current) return;

      const svgElement = d3
        .select(svgRef?.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;")
        .on("mousemove", onMouseMove)
        .on("mouseout", onMouseOut);

      svgElement.selectAll("defs.clip-def").remove();

      const defs = svgElement.append("defs").attr("class", "clip-def");

      defs
        .append("clipPath")
        .attr("id", `clip-${graphId}`)
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", margin.left)
        .attr("y", margin.top);

      const rects = d3.select(chartRef.current);
      rects.attr("clip-path", `url(#clip-${graphId})`);

      if (!!width && !!height && !!chartRef.current) {
        updateChart();
      }
    }, [
      width,
      height,
      reservedBins,
      svgRef?.current,
      chartRef?.current,
      onMouseMove,
      theme,
      zoomLevel,
      scaleX,
      scaleY,
      shiftIndex,
      currentTickPosition,
      disableBlackBars,
    ]);

    return (
      <PoolGraphSVGContainer
        ref={svgRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
      >
        <defs>
          <linearGradient id={`gradient-bar-green-${graphId}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={greenColor.start} />
            <stop offset="100%" stopColor={greenColor.end} />
          </linearGradient>
          <linearGradient id={`gradient-bar-red-${graphId}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={redColor.start} />
            <stop offset="100%" stopColor={redColor.end} />
          </linearGradient>
        </defs>

        <g
          ref={chartRef}
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[margin.left, margin.top].join(",")})`}
        />
      </PoolGraphSVGContainer>
    );
  },
);

PoolGraphSVG.displayName = "PoolGraphSVG";
export default PoolGraphSVG;
