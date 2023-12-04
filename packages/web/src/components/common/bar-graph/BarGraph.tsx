import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";
import { BarGraphTooltipWrapper, BarGraphWrapper, IncentivizeGraphTooltipWrapper } from "./BarGraph.styles";
import { useColorGraph } from "@hooks/common/use-color-graph";
import { Global, css } from "@emotion/react";
import FloatingTooltip from "../tooltip/FloatingTooltip";

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
  customData?: { height: number, marginTop: number};
  times?: string[];
  radiusBorder?: number;
}

interface Point {
  x: number;
  y: number;
}

const VIEWPORT_DEFAULT_WIDTH = 400;
const VIEWPORT_DEFAULT_HEIGHT = 200;

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
  customData = { height: 0, marginTop: 0},
  times = [],
  radiusBorder = 0,
}) => {
  const [activated, setActivated] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(-1);
  const { redColor, greenColor } = useColorGraph();
  const { height: customHeight = 0, marginTop: customMarginTop = 0 } = customData;

  const getStrokeWidth = useCallback(() => {
    const maxStorkeWidth = BigNumber(
      width - (datas.length - 1) * minGap,
    ).dividedBy(datas.length);

    return maxStorkeWidth.toNumber();
  }, [width, datas.length, minGap, strokeWidth]);

  const getGraphPoints = useCallback(() => {
    const strokeWidth = getStrokeWidth();
    const mappedDatas = datas.map((data, index) => ({
      value: new BigNumber(data).toNumber(),
      x: index + 1,
    }));

    const values = mappedDatas.map(data => data.value);
    const xValues = mappedDatas.map(data => data.x);

    const minValue = 0;
    const maxValue = Math.max(...values);
    const minXValue = Math.min(...xValues);
    const maxXValue = Math.max(...xValues);

    const optimizeValue = function (value: number, height: number) {
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
      return new BigNumber(x - minXValue)
        .multipliedBy(width - strokeWidth)
        .dividedBy(maxXValue - minXValue)
        .toNumber();
    };

    return mappedDatas.map<Point>(data => ({
      x: optimizeTime(data.x, width, strokeWidth),
      y: optimizeValue(data.value, height),
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

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!activated) {
      setCurrentPointIndex(-1);
      return;
    }
  const { clientX, currentTarget } = event;
    const { left } = currentTarget.getBoundingClientRect();
    const positionX = clientX - left;
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
      console.log(currentPoint);
      
    }
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
    >
      <FloatingTooltip className="chart-tooltip" isHiddenArrow position="top" 
        content={tooltipOption === "default" && currentPointIndex > -1 && activated ? 
        <BarGraphTooltipWrapper>
          <div className="tooltip-body">
            <span className="date">
              {parseTime(times[currentPointIndex]).date}
            </span>
          </div>
          <div className="tooltip-header">
            <span className="value">{`$${Number(BigNumber(
              datas[currentPointIndex],
            )).toLocaleString()}`}</span>
          </div>
        </BarGraphTooltipWrapper>: 
        tooltipOption === "incentivized" && currentPointIndex > -1 && activated ?
        <IncentivizeGraphTooltipWrapper>
          <div className="row">
            <div className="token">Token</div>
            <div className="amount">Amount</div>
            <div className="price">Price Range</div>
          </div>
          <div className="body">
            <div className="token">
              <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" alt="token logo" className="token-logo" />
              BTC
            </div>
            <div className="amount">-</div>
            <div className="price">19.30K - 21.45K ADN</div>
          </div>
          <div className="body">
            <div className="token">
              <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" alt="token logo" className="token-logo" />
              BTC
            </div>
            <div className="amount">Amount</div>
            <div className="price">0.000046 - 0.000051 BTC</div>
          </div>
        </IncentivizeGraphTooltipWrapper> : null
      }>
        <svg viewBox={`0 0 ${width} ${height + (customHeight || 0)}`} style={{ marginTop: customMarginTop ? customMarginTop : 0}}>
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
          {radiusBorder && getGraphPoints().map((point, index) => (
            <path
              key={index}
              d={`M${point.x} ${point.y + 10} h${getStrokeWidth()} v${height - (point.y + 10)} h-${getStrokeWidth()} v${-height + point.y + 10} Z`}
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
