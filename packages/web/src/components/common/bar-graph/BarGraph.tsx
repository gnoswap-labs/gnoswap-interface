import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";
import { BarGraphTooltipWrapper, BarGraphWrapper, IncentivizeGraphTooltipWrapper } from "./BarGraph.styles";
import { useColorGraph } from "@hooks/common/use-color-graph";
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
}

interface Point {
  x: number;
  y: number;
}

const VIEWPORT_DEFAULT_WIDTH = 400;
const VIEWPORT_DEFAULT_HEIGHT = 200;

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
  currentIndex,
}) => {
  const [activated, setActivated] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<Point>();
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(-1);
  const { redColor, greenColor } = useColorGraph();

  const getStrokeWidth = useCallback(() => {
    const maxStorkeWidth = BigNumber(
      width - (datas.length - 1) * minGap,
    ).dividedBy(datas.length);
    return maxStorkeWidth.isLessThan(strokeWidth)
      ? maxStorkeWidth.toNumber()
      : strokeWidth;
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
    }

    if (currentPoint) {
      setCurrentPoint(currentPoint);
    }
  };

  const locationHovertooltip = useMemo(() => {
    const temp = currentPoint?.x || 0;
    if (typeof window !== "undefined" && window?.innerWidth <= 1440) {
      if (currentIndex !== undefined && currentIndex === 0 && temp < 120) {
        return 120;
      }
      if (currentIndex === 3 && temp > 120) {
        return 130;
      }
    } 
    return temp;
  }, [currentIndex, currentPoint]);
  
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
      <svg viewBox={`0 0 ${width} ${height}`}>
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
        {getGraphPoints().map((point, index) => (
          <rect
            key={index}
            x={point.x}
            width={getStrokeWidth()}
            y={point.y}
            height={height - point.y}
            fill={getStorkeColor(index)}
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
      {tooltipOption === "default" && currentPointIndex > -1 && activated && (
        <BarGraphTooltipWrapper
          x={
            currentPoint?.x && currentPoint?.x > width - 40
              ? currentPoint?.x - 40
              : currentPoint?.x || 0
          }
          y={currentPoint?.y || 0}
        >
          <div className="tooltip-header">
            <span className="value">$98,412,880</span>
          </div>
          <div className="tooltip-body">
            <span className="date">Aug 03, 2023 09:00 PM - 10:00 PM</span>
          </div>
        </BarGraphTooltipWrapper>
      )}
      {tooltipOption === "incentivized" && currentPointIndex > -1 && activated && (
        <IncentivizeGraphTooltipWrapper
          x={locationHovertooltip}
          y={currentPoint?.y || 0}
        >
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
        </IncentivizeGraphTooltipWrapper>
      )}
    </BarGraphWrapper>
  );
};

export default BarGraph;
