import BigNumber from "bignumber.js";
import React, { useCallback, useMemo } from "react";
import { BarGraphWrapper } from "./BarGraph.styles";

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
}) => {

  const getStrokeWidth = useCallback(() => {
    const maxStorkeWidth = BigNumber(width - (datas.length - 1) * minGap).dividedBy(datas.length);
    return maxStorkeWidth.isLessThan(strokeWidth) ? maxStorkeWidth.toNumber() : strokeWidth;
  }, [width, datas.length, minGap, strokeWidth]);

  const getGraphPoints = useCallback(() => {
    const strokeWidth = getStrokeWidth();
    const mappedDatas = datas.map((data, index) => ({
      value: new BigNumber(data).toNumber(),
      x: index + 1
    }));

    const values = mappedDatas.map(data => data.value);
    const xValues = mappedDatas.map(data => data.x);

    const minValue = 0;
    const maxValue = Math.max(...values);
    const minXValue = Math.min(...xValues);
    const maxXValue = Math.max(...xValues);

    const optimizeValue = function (value: number, height: number) {
      return height - new BigNumber(value - minValue).multipliedBy(height).dividedBy(maxValue - minValue).toNumber();
    };

    const optimizeTime = function (x: number, width: number, strokeWidth: number) {
      return new BigNumber(x - minXValue).multipliedBy(width - strokeWidth).dividedBy(maxXValue - minXValue).toNumber();
    };

    return mappedDatas.map<Point>(data => ({
      x: optimizeTime(data.x, width, strokeWidth),
      y: optimizeValue(data.value, height),
    }));
  }, [datas, getStrokeWidth, height, width]);

  const getStorkeColor = useCallback((index: number) => {
    if (!currentTick) {
      return color;
    }
    return currentTick > index ? "url(#gradient-bar-green)" : "url(#gradient-bar-red)";
  }, [currentTick, color]);

  const currentPosition = useMemo(() => {
    if (!currentTick || getGraphPoints().length < currentTick) {
      return;
    }
    return getGraphPoints()[currentTick];
  }, [currentTick, getGraphPoints]);

  return (
    <BarGraphWrapper className={className} color={color} hoverColor={hoverColor}>
      <svg viewBox={`0 0 ${width} ${height}`} >
        <defs>
          <linearGradient id="gradient-bar-green" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2eff8266" />
            <stop offset="100%" stopColor="rgba(75, 255, 46, 0.00)" />
          </linearGradient>
          <linearGradient id="gradient-bar-red" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff2e2e66" />
            <stop offset="100%" stopColor="rgba(255, 46, 46, 0.00)" />
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
        {
          currentPosition && (
            <line
              x1={currentPosition.x - 0.5}
              x2={currentPosition.x}
              y1={height}
              y2={0}
              strokeDasharray={4}
              stroke={"#FFFFFF"}
              strokeWidth={0.5}
            />
          )
        }
      </svg>
    </BarGraphWrapper>
  );
};

export default BarGraph;