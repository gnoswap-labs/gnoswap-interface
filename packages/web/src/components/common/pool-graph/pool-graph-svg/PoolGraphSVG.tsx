import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as d3 from "d3";

import { useColorGraph } from "@hooks/common/use-color-graph";
import { ThemeKeys } from "@styles/ThemeTypes";

import { ReservedBin } from "../PoolGraph.types";
import { PoolGraphSVGContainer } from "./PoolGraphSVG.styles";

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
    },
    forwardedRef,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    useImperativeHandle(forwardedRef, () => svgRef.current as SVGSVGElement);

    const chartRef = useRef(null);
    const { redColor, greenColor } = useColorGraph();

    const boundsWidth = width - margin.right - margin.left;
    const boundsHeight = height - margin.top - margin.bottom;

    // D3 - Dimension Definition
    const { defaultMinX, minX, maxX } = d3Position;
    const centerX = currentTick ?? (minX && maxX ? (minX + maxX) / 2 : 0);

    /** Update Chart by data */
    function updateChart() {
      const centerPosition = scaleX(centerX - defaultMinX) - binSpacing / 2;

      // Retrieves the colour of the chart bar at the current tick.
      function fillByBin(bin: ReservedBin) {
        let isBlackBar = !!(
          maxTickPosition &&
          minTickPosition &&
          (scaleX(bin.minTick) < minTickPosition - binSpacing ||
            scaleX(bin.minTick) > maxTickPosition)
        );

        if (isReversed) {
          isBlackBar = !!(
            maxTickPosition &&
            minTickPosition &&
            (scaleX(bin.minTick) <
              scaleX(maxX) - maxTickPosition - binSpacing ||
              scaleX(bin.minTick) > scaleX(maxX) - minTickPosition)
          );
        }
        if (isBlackBar) return themeKey === "dark" ? "#1C2230" : "#E0E8F4";
        if (currentTick && bin.minTick < Number(currentTick - defaultMinX)) {
          return `url(#gradient-bar-green-${graphId})`;
        }
        return `url(#gradient-bar-red-${graphId})`;
      }

      // Create a chart bar.
      const rects = d3.select(chartRef.current);
      rects.attr("clip-path", "url(#clip)");

      // D3 - Draw Current tick (middle line)
      rects.select("line").remove();
      if (currentTick && rects.select("line").empty()) {
        rects
          .append("line")
          .attr("x1", centerPosition + binSpacing / 2)
          .attr("x2", centerPosition + binSpacing / 2)
          .attr("y1", 0)
          .attr("y2", boundsHeight)
          .attr("stroke-dasharray", 3)
          .attr("stroke", `${themeKey === "dark" ? "#E0E8F4" : "#596782"}`)
          .attr("stroke-width", 1);
      }

      // D3 - Draw reservedBins as bars
      rects.selectAll("g").remove();
      if (!disabled && rects.selectAll("g").size() === 0) {
        rects
          .selectAll("rects")
          .data(reservedBins)
          .enter()
          .append("g")
          .attr("class", "bin-wrapper")
          .attr("id", bin => getBinId(bin.index))
          .each(function (bin) {
            d3.select(this)
              .append("rect")
              .style("fill", "transparent")
              .attr("class", "bin-inner")
              .style("stroke-width", "0")
              .attr("x", scaleX(bin.minTick))
              .attr("width", scaleX(bin.maxTick - bin.minTick))
              .attr("y", () => {
                const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
                return (
                  scaleYComputation -
                  (scaleYComputation > height - 3 &&
                  scaleYComputation !== height
                    ? 3
                    : 0)
                );
              })
              .attr("height", () => {
                const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
                return (
                  boundsHeight -
                  scaleYComputation +
                  (scaleYComputation > height - 3 &&
                  scaleYComputation !== height
                    ? 3
                    : 0)
                );
              });

            const heightPadding = 3;
            d3.select(this)
              .append("rect")
              .style("fill", fillByBin(bin))
              .attr("class", "bin-inner")
              .style("stroke-width", "0")
              .attr("x", scaleX(bin.minTick) + 1)
              .attr("width", scaleX(bin.maxTick - bin.minTick) - 0.5)
              .attr("y", () => {
                const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
                return (
                  scaleYComputation -
                  (scaleYComputation > height - 3 &&
                  scaleYComputation !== height
                    ? 3
                    : 0)
                );
              })
              .attr("height", () => {
                const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
                return (
                  boundsHeight -
                  scaleYComputation +
                  (scaleYComputation > height - heightPadding &&
                  scaleYComputation !== height
                    ? heightPadding
                    : 0)
                );
              });
          });
      }
    }

    const getBinId = useCallback(
      (index: number) => `pool-graph-bin-${graphId}-${index}`,
      [graphId],
    );

    useEffect(() => {
      //  D3 - Draw bin and define interaction
      if (!svgRef?.current) {
        return;
      }

      const svgElement = d3
        .select(svgRef?.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;")
        .on("mousemove", onMouseMove)
        .on("mouseout", onMouseOut);

      if (svgElement.select("defs").empty()) {
        svgElement.selectAll("defs").remove();
      }

      svgElement
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

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
    ]);

    return (
      <PoolGraphSVGContainer
        ref={svgRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
      >
        <defs>
          <linearGradient
            id={`gradient-bar-green-${graphId}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop offset="0%" stopColor={greenColor.start} />
            <stop offset="100%" stopColor={greenColor.end} />
          </linearGradient>
          <linearGradient
            id={`gradient-bar-red-${graphId}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
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
