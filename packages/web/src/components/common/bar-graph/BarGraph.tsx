import BigNumber from "bignumber.js";
import React, { useCallback } from "react";
import { BarGraphWrapper } from "./BarGraph.styles";

export interface BarGraphProps {
  className?: string;
  color?: string;
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
      x: optimizeTime(data.x, width, strokeWidth) + strokeWidth / 2,
      y: optimizeValue(data.value, height),
    }));
  }, [datas, getStrokeWidth, height, width]);

  return (
    <BarGraphWrapper className={className} color={color} hoverColor={hoverColor}>
      <svg viewBox={`0 0 ${width} ${height}`} >
        {getGraphPoints().map((point, index) => (
          <line
            key={index}
            x1={point.x}
            x2={point.x}
            y1={height}
            y2={point.y}
            stroke={color}
            strokeWidth={getStrokeWidth()}
          />
        ))}
      </svg>
    </BarGraphWrapper>
  );
};

export default BarGraph;