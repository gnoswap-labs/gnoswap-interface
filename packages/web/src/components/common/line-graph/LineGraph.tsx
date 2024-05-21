import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { LineGraphTooltipWrapper, LineGraphWrapper } from "./LineGraph.styles";
import FloatingTooltip from "../tooltip/FloatingTooltip";
import { Global, css, useTheme } from "@emotion/react";
import {
  subscriptFormat,
  toPriceFormat,
} from "@utils/number-utils";
import { getLocalizeTime } from "@utils/chart";
import { convertToKMB } from "@utils/stake-position-utils";

function calculateSmoothing(pointA: Point, pointB: Point) {
  const lengthX = pointB.x - pointA.x;
  const lengthY = pointB.y - pointA.y;
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  };
}

function controlPoint(
  current: Point,
  previous?: Point,
  next?: Point,
  reverse?: boolean,
) {
  const smoothing = 0.15;
  const prePoint = previous || current;
  const nextPoint = next || current;
  const calculated = calculateSmoothing(prePoint, nextPoint);
  const angle = calculated.angle + (reverse ? Math.PI : 0);
  const length = calculated.length * smoothing;
  const x = current.x + Math.cos(angle) * length;
  const y = current.y + Math.sin(angle) * length;

  return [x, y];
}

function bezierCommand(point: Point, index: number, points: Point[]) {
  const [cpsX, cpsY] = controlPoint(
    points[index - 1],
    points[index - 2],
    point,
  );
  const [cpeX, cpeY] = controlPoint(
    point,
    points[index - 1],
    points[index + 1],
    true,
  );
  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
}

export interface LineGraphData {
  value: string;
  time: string;
}

export interface LineGraphProps {
  className?: string;
  color: string;
  gradientStartColor?: string;
  gradientEndColor?: string;
  strokeWidth?: number;
  datas: LineGraphData[];
  cursor?: boolean;
  smooth?: boolean;
  width?: number;
  height?: number;
  point?: boolean;
  firstPointColor?: string;
  typeOfChart?: string;
  customData?: { height: number; locationTooltip: number };
  centerLineColor?: string;
  showBaseLine?: boolean;
  showBaseLineLabels?: boolean;
  renderBottom?: (baseLineNumberWidth: number) => React.ReactElement;
  isShowTooltip?: boolean;
  onMouseMove?: (LineGraphData?: LineGraphData) => void;
  onMouseOut?: ((active: boolean) => void);
  baseLineMap?: [boolean, boolean, boolean, boolean];
  baseLineLabelsPosition?: "left" | "right";
  baseLineLabelsTransform?: (value: string) => string;
  graphBorder?: [boolean, boolean, boolean, boolean];
  baseLineLabelsStyle?: React.CSSProperties;
}

export interface LineGraphRef {
  getBaseLineNumberWidth: () => number;
}

interface Point {
  x: number;
  y: number;
}

const VIEWPORT_DEFAULT_WIDTH = 400;
const VIEWPORT_DEFAULT_HEIGHT = 200;

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
function parseTimeTVL(time: string) {
  const dateObject = new Date(time);
  const month = dateObject.toLocaleString("en-US", {
    month: "short",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const day = dateObject.getDate();
  const year = dateObject.getFullYear();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const isPM = hours >= 12;
  const formattedHours = hours % 12 || 12;
  if (!month || !day || !year)
    return {
      date: "",
      time: "",
    };
  return {
    date: `${month} ${day}, ${year}`,
    time: `${formattedHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${isPM ? "PM" : "AM"}`,
  };
}

const LineGraph: React.FC<LineGraphProps> = ({
  className = "",
  cursor,
  color,
  datas,
  strokeWidth = 2,
  gradientStartColor = `${color}66`,
  gradientEndColor = "transparent",
  smooth,
  width = VIEWPORT_DEFAULT_WIDTH,
  height = VIEWPORT_DEFAULT_HEIGHT,
  point,
  customData = { height: 0, locationTooltip: 0 },
  showBaseLine = false,
  renderBottom,
  isShowTooltip = true,
  onMouseMove: onLineGraphMouseMove,
  onMouseOut: onLineGraphMouseOut,
  showBaseLineLabels = false,
  baseLineMap = [true, true, true, true],
  baseLineLabelsPosition = "left",
  baseLineLabelsTransform,
  baseLineLabelsStyle,
}: LineGraphProps) => {
  const COMPONENT_ID = (Math.random() * 100000).toString();
  const [activated, setActivated] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<Point>();
  const [chartPoint, setChartPoint] = useState<Point>();
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(-1);
  const [points, setPoints] = useState<Point[]>([]);
  const [baseLineYAxis, setBaseLineYAxis] = useState<string[]>([]);
  const [baseLineNumberWidth, setBaseLineNumberWidth] = useState<number>(0);
  const { height: customHeight = 0, locationTooltip } = customData;
  const baseLineCount = useMemo(() => 4, []);
  const theme = useTheme();

  const isFocus = useCallback(() => {
    return activated && cursor;
  }, [activated, cursor]);

  useEffect(() => {
    updatePoints(datas, width, height);
  }, [datas, width, height, baseLineNumberWidth]);

  useEffect(() => {
    onLineGraphMouseMove?.(datas[currentPointIndex]);
  }, [currentPointIndex, datas]);

  useEffect(() => {
    onLineGraphMouseOut?.(activated);
  }, [activated]);

  const isSameData = useMemo(() => {
    return datas.length > 0 && datas.every(item => item.value === datas[0].value);
  }, [datas]);

  const updatePoints = (
    datas: LineGraphData[],
    width: number,
    height: number,
  ) => {
    const mappedDatas = datas.map(data => ({
      value: new BigNumber(data.value).toNumber(),
      time: new Date(data.time).getTime(),
    }));
    const gapRatio = 0.1;

    const values = mappedDatas.map(data => data.value);
    const times = mappedDatas.map(data => data.time);

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);


    const minValueBigNumber = BigNumber(minValue);
    const maxValueBigNumber = BigNumber(maxValue);

    let baseLineNumberWidthComputation = 0;


    //   maxValue - minValue !== 0 ? maxValue - minValue : maxValue * gapRatio;

    const minMaxGap = !maxValueBigNumber.minus(minValueBigNumber).isEqualTo(0)
      ? maxValueBigNumber.minus(minValueBigNumber) : maxValueBigNumber.multipliedBy(gapRatio);

    const baseLineData = new Array(baseLineCount)
      .fill("")
      .map((value, index) => {
        // Gap from lowest value or highest value  to baseline
        const additionalGap =
          !maxValueBigNumber.minus(minValueBigNumber).isEqualTo(0)
            ? minMaxGap.multipliedBy(gapRatio / 2)
            : minMaxGap.dividedBy(2);
        // Gap between bottom and top base line
        const baseLineGap =
          !maxValueBigNumber.minus(minValueBigNumber).isEqualTo(0) ? minMaxGap.multipliedBy(1 + gapRatio) : minMaxGap;
        // Lowest baseline value
        const bottomBaseLineValue = minValueBigNumber.minus(additionalGap);

        const currentBaseLineValue = bottomBaseLineValue.plus(baseLineGap.multipliedBy(index / (baseLineCount - 1)));
        // const currentBaseLineValue =
        //   bottomBaseLineValue + (index / (baseLineCount - 1)) * baseLineGap;

        if (currentBaseLineValue.isLessThan(-1)) {
          return "-" + convertToKMB(currentBaseLineValue.absoluteValue().toFixed(), {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          });
        }

        if (currentBaseLineValue.isGreaterThan(-1) && currentBaseLineValue.isLessThan(0)) {
          return "-" + subscriptFormat(currentBaseLineValue.abs().toFixed());
        }


        if (currentBaseLineValue.isLessThan(1)) {
          return subscriptFormat(currentBaseLineValue.toString(), {
            significantDigits: 3,
            subscriptOffset: 3,
          });
        }

        if (currentBaseLineValue.isGreaterThanOrEqualTo(1) && currentBaseLineValue.isLessThan(100)) {
          return convertToKMB(currentBaseLineValue.toString(), {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          });
        }

        const result = Math.round(currentBaseLineValue.toNumber()).toString();

        if (currentBaseLineValue.isLessThan(1)) return subscriptFormat(currentBaseLineValue.toFixed());

        return convertToKMB(result, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
      });

    setBaseLineYAxis([...baseLineData]);

    const maxLength = 7;

    baseLineNumberWidthComputation = (() => {
      if (!showBaseLineLabels) return 0;

      const longestNumber = baseLineData.reduce((prev, current) => {
        if (current.length > prev.length) {
          return current;
        }
        return prev;
      });
      const transformedLongestNumber = baseLineLabelsTransform ? baseLineLabelsTransform(longestNumber) : longestNumber;

      return (transformedLongestNumber.length / maxLength) * 52;
    })();

    setBaseLineNumberWidth(baseLineNumberWidthComputation);

    const optimizeValue = function (value: number, height: number) {
      // The base line wrapper will > top and bottom of graph 10 % so the height will be 110% of graph height
      const graphHeight = (() => {
        if (showBaseLine) {
          return height * (1 / 1.1);
        }

        return height;
      })();

      // Subtract 5% from the top baseline
      const topFrontierHeight = showBaseLine ? height * (1.05 / 1.1) : height;

      const result = (() => {
        if (maxValue - minValue === 0) {
          return (
            topFrontierHeight -
            ((value - value * 0.95) * graphHeight) / minMaxGap.toNumber()
          );
        }

        return (
          topFrontierHeight - ((value - minValue) * graphHeight) / minMaxGap.toNumber()
        );
      })();

      return result;
    };

    const optimizeTime = function (time: number, width: number) {
      return new BigNumber(time - minTime)
        .multipliedBy(width - baseLineNumberWidthComputation)
        .dividedBy(maxTime - minTime)
        .toNumber();
    };

    const points = mappedDatas.map<Point>(data => ({
      x: optimizeTime(data.time, width) + baseLineNumberWidthComputation,
      y: optimizeValue(data.value, height),
    }));
    setPoints(points);
  };

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
    if (!isFocus) {
      setCurrentPointIndex(-1);
      return;
    }

    const { currentTarget } = event;
    const { left, top } = currentTarget.getBoundingClientRect();
    const positionX = (clientX || 0) - left;
    const clientWidth = currentTarget.clientWidth;
    const xPosition = new BigNumber(positionX)
      .multipliedBy(width)
      .dividedBy(clientWidth)
      .toNumber();
    let currentPoint: Point | null = null;
    let minDistance = -1;

    let currentPointIndex = -1;

    for (const point of points) {
      const distance = Math.abs(xPosition - point.x);
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
      setChartPoint({ x: positionX, y: (clientY || 0) - top });
      setCurrentPoint(currentPoint);
    }
  };

  const getGraphLine = useCallback(
    (smooth?: boolean, fill?: boolean) => {
      function mappedPoint(point: Point, index: number, points: Point[]) {
        if (index === 0) {
          return `${fill ? "L" : "M"} ${point.x},${point.y}`;
        }
        return smooth
          ? bezierCommand(point, index, points)
          : `L ${point.x},${point.y}`;
      }
      return points
        .map((point, index) => mappedPoint(point, index, points))
        .join(" ");
    },
    [points],
  );

  // const getFillGraphLine = useCallback(
  //   (smooth?: boolean) => {
  //     return `M 0,${height} ${getGraphLine(
  //       smooth,
  //       true,
  //     )} L ${width},${height}Z`;
  //   },
  //   [getGraphLine, height, width],
  // );

  // const firstPoint = useMemo(() => {
  //   if (points.length === 0) {
  //     return { x: 0, y: 0 };
  //   }
  //   return points[0];
  // }, [points]);
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

  const areaPath = useMemo(() => {
    if (
      !points ||
      points.length === 0 ||
      points.some(
        point =>
          point === undefined || point.x === undefined || point.y === undefined,
      )
    ) {
      return undefined; // Or render some fallback UI
    }
    // Start at the first point of the line chart
    let path = `M ${points[0].x},${points[0].y}`;

    // Draw the line chart path
    for (let i = 1; i < points.length; i++) {
      path += smooth
        ? bezierCommand(points[i], i, points)
        : ` L ${points[i].x},${points[i].y}`;
    }

    // Draw a line straight down to the bottom of the chart
    path += ` L ${points[points.length - 1].x},${height}`;

    // Draw a line straight across to the bottom left corner
    path += ` L ${points[0].x},${height}`;

    // Close the path by connecting back to the start point
    path += "Z";

    return path;
  }, [height, points, smooth]);

  const isLightTheme = theme.themeKey === "light";

  return (
    <LineGraphWrapper
      className={className}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setActivated(true)}
      onMouseLeave={() => {
        setActivated(false);
      }}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
    >
      <FloatingTooltip
        className="chart-tooltip"
        isHiddenArrow
        position={locationTooltipPosition}
        content={
          (isShowTooltip && currentPointIndex > -1) ? (
            <LineGraphTooltipWrapper>
              <div className="tooltip-body">
                <span className="date">
                  {parseTimeTVL(datas[currentPointIndex]?.time)?.date || "0"}
                </span>
                {location.pathname !== "/dashboard" && (
                  <span className="time">
                    {currentPointIndex === datas.length - 1
                      ? parseTimeTVL(getLocalizeTime(new Date().toString()))
                        .time
                      : parseTimeTVL(datas[currentPointIndex]?.time)?.time ||
                      "0"}
                  </span>
                )}
              </div>
              <div className="tooltip-header">
                <span className="value">{`$${toPriceFormat(BigNumber(datas[currentPointIndex]?.value).toFormat())}`}</span>
              </div>
            </LineGraphTooltipWrapper>
          ) : null
        }
      >
        <svg viewBox={`0 0 ${width} ${height + (customHeight || 0)}`}>
          <defs>
            <linearGradient
              id={"gradient" + COMPONENT_ID}
              gradientTransform="rotate(90)"
            >
              <stop offset="0%" stopColor={gradientStartColor} />
              {isLightTheme ? (
                <stop offset="100%" stopColor={"white"} stopOpacity={0} />
              ) : (
                <stop offset="100%" stopColor={gradientEndColor} />
              )}
            </linearGradient>
          </defs>
          <g width={width} className="line-chart-g">
            {showBaseLine && (
              <>
                {baseLineYAxis.map((value, index) => {
                  const showBaseLine = baseLineMap[index];
                  const currentHeight =
                    height - (height * index) / (baseLineCount - 1);
                  const baseWidth = width - ((showBaseLineLabels && baseLineLabelsPosition === "left") ? 0 : baseLineNumberWidth);

                  return (
                    <React.Fragment key={index}>
                      {showBaseLine && <line
                        x1={(showBaseLineLabels && baseLineLabelsPosition === "left") ? baseLineNumberWidth : 0}
                        x2={width - ((showBaseLineLabels && baseLineLabelsPosition === "left") ? 0 : baseLineNumberWidth)}
                        y1={currentHeight}
                        y2={currentHeight}
                        stroke="grey"
                        stroke-width="1"
                        strokeDasharray={3}
                        opacity={0.2}
                      />}
                      {showBaseLine && showBaseLineLabels && <text
                        alignmentBaseline="central"
                        className="y-axis-number"
                        x={(showBaseLineLabels && baseLineLabelsPosition === "left") ? 0 : baseWidth + 5}
                        y={currentHeight}
                        fill={theme.color.text04}
                        style={baseLineLabelsStyle}
                      >
                        {baseLineLabelsTransform ? baseLineLabelsTransform(value) : value}
                      </text>}
                    </React.Fragment>
                  );
                })}
              </>
            )}
            {!isSameData && <path
              fill={`url(#gradient${COMPONENT_ID})`}
              stroke={color}
              strokeWidth={0}
              d={areaPath}
            />}
            <path
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              d={getGraphLine(smooth)}
            />
            {
              point &&
              points.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={1}
                  stroke={color}
                />
              ))
            }
          </g >
          {
            <g>
              {/* {
                firstPointColor && (
                  <line
                    stroke={firstPointColor ? firstPointColor : color}
                    strokeWidth={1}
                    x1={0}
                    y1={firstPoint.y}
                    x2={width}
                    y2={firstPoint.y}
                    strokeDasharray={3}
                    className="first-line"
                  />
                )
              } */}
              {/* {
                centerLineColor && (
                  <line
                    stroke={centerLineColor}
                    strokeWidth={1}
                    x1={0}
                    y1={firstPoint.y}
                    x2={width}
                    y2={firstPoint.y}
                    strokeDasharray={0}
                    className="center-line"
                  />
                )
              } */}
              {
                isFocus() && currentPoint && (
                  <line
                    stroke={color}
                    strokeWidth={1}
                    x1={currentPoint.x}
                    y1={0}
                    x2={currentPoint.x}
                    y2={height + (customHeight ? customHeight : 0)}
                    strokeDasharray={3}
                  />
                )
              }
              {
                isFocus() && currentPoint && (
                  <circle
                    cx={currentPoint.x}
                    cy={currentPoint.y + 24}
                    r={3}
                    stroke={color}
                    fill={color}
                  />
                )
              }
            </g >
          }
        </svg >
      </FloatingTooltip >
      <ChartGlobalTooltip />
      {renderBottom && renderBottom(baseLineNumberWidth)}
    </LineGraphWrapper >
  );
};

export default React.memo(LineGraph);
