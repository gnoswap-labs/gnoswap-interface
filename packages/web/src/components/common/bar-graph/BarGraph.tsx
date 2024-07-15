import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";
import {
  BarGraphTooltipWrapper,
  BarGraphWrapper,
  IncentivizeGraphTooltipWrapper,
} from "./BarGraph.styles";
import { useColorGraph } from "@hooks/common/use-color-graph";
import { Global, css } from "@emotion/react";
import FloatingTooltip from "../tooltip/FloatingTooltip";
import { toPriceFormatNotRounding } from "@utils/number-utils";

export interface BarGraphProps {
  className?: string;
  color?: string;
  currentTick?: number;
  hoverColor?: string;
  strokeWidth?: number;
  datas: string[];
  minGap?: number;
  width?: number;
  height?: number;
  tooltipOption?: string;
  svgColor?: string;
  currentIndex?: number;
  customData?: { height: number; locationTooltip: number };
  times?: string[];
  fees: string[];
  radiusBorder?: number;
}

interface Point {
  x: number;
  y: number;
}

const VIEWPORT_DEFAULT_WIDTH = 400;
const VIEWPORT_DEFAULT_HEIGHT = 200;
const TOP_MARGIN_BAR = 24;

function parseTime(time: string) {
  const dateObject = new Date(time);
  const month = dateObject.toLocaleString("en-US", { month: "short" });
  const day = dateObject.getDate();
  const year = dateObject.getFullYear();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const isPM = hours >= 12;
  const formattedHours = hours % 12 || 12;
  return {
    date: `${month} ${day}, ${year}`,
    time: `${formattedHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${isPM ? "PM" : "AM"}`,
  };
}

const ChartGlobalTooltip = () => {
  return (
    <Global
      styles={() => css`
        .chart-tooltip {
          > div {
            padding: 10px;
            box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.15);
          }
        }
      `}
    />
  );
};

const BarGraph: React.FC<BarGraphProps> = ({
  className = "",
  color,
  hoverColor,
  currentTick,
  datas,
  strokeWidth = 12.5,
  minGap = 1,
  width = VIEWPORT_DEFAULT_WIDTH,
  height = VIEWPORT_DEFAULT_HEIGHT,
  tooltipOption = "default",
  svgColor = "default",
  customData = { height: 0, locationTooltip: 0 },
  times = [],
  radiusBorder = 0,
  fees,
}) => {
  const [activated, setActivated] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<Point>();
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(-1);
  const { redColor, greenColor } = useColorGraph();
  const { height: customHeight = 0, locationTooltip = 0 } = customData;
  const [chartPoint, setChartPoint] = useState<Point>();

  const hasOnlyOneData = useMemo(
    () => (datas?.length ?? 0) === 1,
    [datas?.length],
  );

  const getStrokeWidth = useCallback(() => {
    const maxStorkeWidth = BigNumber(
      width - (datas.length - 1) * minGap,
    ).dividedBy(datas.length);

    return maxStorkeWidth.toNumber();
  }, [width, datas.length, minGap, strokeWidth]);
  const getGraphPoints = useCallback(() => {
    const strokeWidth = getStrokeWidth();
    const mappedDatas = datas.map((data, index) => {
      return {
        value: new BigNumber(data).toNumber(),
        x: index + 1,
      };
    });

    const values = mappedDatas.map(data => data.value);
    const xValues = mappedDatas.map(data => data.x);

    const minValue = 0;
    const maxValue = Math.max(...values);
    const minXValue = Math.min(...xValues);
    const maxXValue = Math.max(...xValues);

    const optimizeValue = function (value: number, height: number) {
      if (hasOnlyOneData) {
        return 0;
      }

      return (
        height -
        new BigNumber(value - minValue)
          .multipliedBy(height)
          .dividedBy(maxValue - minValue)
          .toNumber()
      );
    };

    const optimizeTime = function (
      x: number,
      width: number,
      strokeWidth: number,
    ) {
      if (hasOnlyOneData) {
        return new BigNumber(1)
          .multipliedBy(width - strokeWidth)
          .dividedBy(1)
          .toNumber();
      }

      return new BigNumber(x - minXValue)
        .multipliedBy(width - strokeWidth)
        .dividedBy(maxXValue - minXValue)
        .toNumber();
    };

    return mappedDatas.map<Point>(data => ({
      x: optimizeTime(data.x, width, strokeWidth),
      y:
        Number(optimizeValue(data.value, height)) < 180 &&
        Number(optimizeValue(data.value, height)) > 177
          ? 177
          : optimizeValue(data.value, height),
    }));
  }, [datas, getStrokeWidth, height, width]);

  const getStorkeColor = useCallback(
    (index: number) => {
      if (!currentTick) {
        return color;
      }
      return currentTick > index
        ? "url(#gradient-bar-green)"
        : "url(#gradient-bar-red)";
    },
    [currentTick, color],
  );

  const currentPosition = useMemo(() => {
    if (!currentTick || getGraphPoints().length < currentTick) {
      return;
    }
    return getGraphPoints()[currentTick];
  }, [currentTick, getGraphPoints]);

  const onMouseMove = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const isTouch = event.type.startsWith("touch");
    const touch = isTouch
      ? (event as React.TouchEvent<HTMLDivElement>).touches[0]
      : null;
    const clientX = isTouch
      ? touch?.clientX
      : (event as React.MouseEvent<HTMLDivElement, MouseEvent>).clientX;
    const clientY = isTouch
      ? touch?.clientY
      : (event as React.MouseEvent<HTMLDivElement, MouseEvent>).clientY;
    if (!activated) {
      setCurrentPointIndex(-1);
      return;
    }
    const { currentTarget } = event;
    const { left, top } = currentTarget.getBoundingClientRect();
    if ((clientY || 0) - top > 205) {
      setCurrentPointIndex(-1);
      return;
    }
    const positionX = (clientX || 0) - left;
    const clientWidth = currentTarget.clientWidth;
    const xPosition = new BigNumber(positionX)
      .multipliedBy(width)
      .dividedBy(clientWidth)
      .toNumber();
    let currentPoint: Point | null = null;
    let minDistance = -1;

    let currentPointIndex = -1;
    for (const point of getGraphPoints()) {
      const distance = xPosition - point.x;
      currentPointIndex += 1;

      if (minDistance < 0 && distance >= 0) {
        minDistance = distance;
      }
      if (distance >= 0 && distance < minDistance + 1) {
        currentPoint = point;
        minDistance = distance;
        setCurrentPointIndex(currentPointIndex);
      }
      if ((clientY || 0) - top - TOP_MARGIN_BAR < Number(currentPoint?.y)) {
        setCurrentPointIndex(-1);
      }
      if (currentPoint) {
        setChartPoint({ x: positionX, y: (clientY || 0) - top });
        setCurrentPoint(currentPoint);
      }
    }
  };
  const locationTooltipPosition = useMemo(() => {
    if ((chartPoint?.y || 0) > customHeight + height - 25) {
      if (width < (currentPoint?.x || 0) + locationTooltip) {
        return "top-end";
      } else {
        return "top-start";
      }
    }
    if (width < (currentPoint?.x || 0) + locationTooltip) return "left";
    return "right";
  }, [currentPoint, width, locationTooltip, height, chartPoint, customHeight]);

  const onTouchMove = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => {
    onMouseMove(event);
  };

  const onTouchStart = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    onMouseMove(event);
  };

  return (
    <BarGraphWrapper
      className={className}
      color={color}
      hoverColor={hoverColor}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setActivated(true)}
      onMouseLeave={() => setActivated(false)}
      svgColor={svgColor}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
    >
      <FloatingTooltip
        className="chart-tooltip"
        isHiddenArrow
        position={locationTooltipPosition}
        content={
          tooltipOption === "default" && currentPointIndex > -1 ? (
            <BarGraphTooltipWrapper>
              <div className="tooltip-body">
                <span className="date">
                  {parseTime(times[currentPointIndex]).date}
                </span>
                <span className="date">
                  {parseTime(times[currentPointIndex]).time}
                </span>
              </div>
              <div className="tooltip-header">
                <span className="label">Trading Volume</span>
                <span className="value">
                  {toPriceFormatNotRounding(datas[currentPointIndex], {
                    usd: true,
                    isKMBFormat: false,
                    greaterThan1Decimals: 1,
                    lessThan1Significant: 1,
                  })}
                </span>
              </div>
              <div className="tooltip-header">
                <span className="label">Fees</span>
                <span className="value">
                  {toPriceFormatNotRounding(fees[currentPointIndex], {
                    usd: true,
                    isKMBFormat: false,
                    greaterThan1Decimals: 1,
                    lessThan1Significant: 1,
                    minLimit: 0.01,
                  })}
                </span>
              </div>
            </BarGraphTooltipWrapper>
          ) : tooltipOption === "incentivized" &&
            currentPointIndex > -1 &&
            activated ? (
            <IncentivizeGraphTooltipWrapper>
              <div className="row">
                <div className="token">Token</div>
                <div className="amount">Amount</div>
                <div className="price">Price Range</div>
              </div>
              <div className="body">
                <div className="token">
                  <img
                    src="https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg"
                    alt="token logo"
                    className="token-logo"
                  />
                  BTC
                </div>
                <div className="amount">-</div>
                <div className="price">19.30K - 21.45K ADN</div>
              </div>
              <div className="body">
                <div className="token">
                  <img
                    src="https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg"
                    alt="token logo"
                    className="token-logo"
                  />
                  BTC
                </div>
                <div className="amount">Amount</div>
                <div className="price">0.000046 - 0.000051 BTC</div>
              </div>
            </IncentivizeGraphTooltipWrapper>
          ) : null
        }
      >
        <svg viewBox={`0 0 ${width} ${height + (customHeight || 0)}`}>
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
          {radiusBorder &&
            getGraphPoints().map((point, index) => (
              <path
                key={index}
                d={`M${point.x} ${point.y + 1} h${getStrokeWidth()} v${
                  height - (point.y + 1)
                } h-${getStrokeWidth()} v${-height + point.y + 10} Z`}
                fill={getStorkeColor(index)}
              />
            ))}
          {getGraphPoints().map((point, index) => (
            <rect
              key={index}
              x={point.x}
              width={getStrokeWidth()}
              y={point.y}
              height={height - point.y}
              fill={getStorkeColor(index)}
              rx={radiusBorder}
            />
          ))}
          {currentPosition && (
            <line
              x1={currentPosition.x}
              x2={currentPosition.x}
              y1={height}
              y2={0}
              strokeDasharray={4}
              stroke={"#E0E8F4"}
              strokeWidth={0.5}
            />
          )}
        </svg>
      </FloatingTooltip>
      <ChartGlobalTooltip />
    </BarGraphWrapper>
  );
};

export default BarGraph;
