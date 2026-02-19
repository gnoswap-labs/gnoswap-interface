import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { LineGraphTooltipWrapper, LineGraphWrapper } from "./LineGraph.styles";
import FloatingTooltip from "../tooltip/FloatingTooltip";
import { Global, css, useTheme } from "@emotion/react";
import { subscriptFormat } from "@utils/number-utils";
import { getLocalizeTime } from "@utils/chart";
import { convertToKMB } from "@utils/stake-position-utils";
import { formatPrice } from "@utils/new-number-utils";
import dayjs from "dayjs";
import { FloatingPosition } from "@hooks/common/use-floating-tooltip";

interface DataItem {
  value: number;
  time: string | number;
}

interface DataContext {
  current: DataItem;
  prev2: DataItem | null;
  prev1: DataItem | null;
  next1: DataItem | null;
  next2: DataItem | null;
}

function getDataItem(data: DataItem[], index: number): DataItem | null {
  return index >= 0 && index < data.length ? data[index] : null;
}

function createItemContext(data: DataItem[], currentIndex: number): DataContext {
  return {
    current: data[currentIndex],
    prev2: getDataItem(data, currentIndex - 2),
    prev1: getDataItem(data, currentIndex - 1),
    next1: getDataItem(data, currentIndex + 1),
    next2: getDataItem(data, currentIndex + 2),
  };
}

function calculateSmoothing(pointA: Point, pointB: Point) {
  const lengthX = pointB.x - pointA.x;
  const lengthY = pointB.y - pointA.y;
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  };
}

function controlPoint(current: Point, previous?: Point, next?: Point, reverse?: boolean) {
  const smoothing = 0.1;
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
  const [cpsX, cpsY] = controlPoint(points[index - 1], points[index - 2], point);

  const [cpeX, cpeY] = controlPoint(point, points[index - 1], points[index + 1], true);

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
  forcedHeight?: number;
  forcedPosition?: FloatingPosition;
  point?: boolean;
  firstPointColor?: string;
  typeOfChart?: string;
  customData?: { height: number; locationTooltip: number };
  centerLineColor?: string;
  showBaseLine?: boolean;
  showBaseLineLabels?: boolean;
  showPriceRangeLine?: boolean;
  renderBottom?: (baseLineNumberWidth: number) => React.ReactElement;
  isShowTooltip?: boolean;
  onMouseMove?: (LineGraphData?: LineGraphData, dateDisplay?: { date: string; time: string; value?: string }) => void;
  onMouseOut?: (active: boolean) => void;
  baseLineMap?: [boolean, boolean, boolean, boolean];
  baseLineLabelsPosition?: "left" | "right";
  baseLineLabelsTransform?: (value: string) => string;
  graphBorder?: [boolean, boolean, boolean, boolean];
  baseLineLabelsStyle?: React.CSSProperties;
  displayLastDayAsNow?: boolean;
  popupYValueFormatter?: (value: string) => string;
  hasNoLabel?: boolean;
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
const MIN_POINTS_FOR_DISTANCE_CHECK = 2;
const HOVER_MAX_DISTANCE_MULTIPLIER = 1.5;

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
  const dateObject = dayjs(time);
  return {
    date: dateObject.format("MMM DD, YYYY"),
    time: dateObject.format("hh:mm A"),
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
  forcedHeight,
  forcedPosition,
  point,
  customData = { height: 0, locationTooltip: 0 },
  showBaseLine = false,
  renderBottom,
  isShowTooltip = true,
  onMouseMove: onLineGraphMouseMove,
  onMouseOut: onLineGraphMouseOut,
  showBaseLineLabels = false,
  showPriceRangeLine = true,
  baseLineMap = [true, true, true, true],
  baseLineLabelsPosition = "left",
  baseLineLabelsTransform,
  baseLineLabelsStyle,
  firstPointColor,
  displayLastDayAsNow = false,
  popupYValueFormatter,
  hasNoLabel = false,
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

  const updatePoints = (datas: LineGraphData[], width: number, height: number) => {
    let minValue: number;
    let maxValue: number;
    let minTime: number;
    let maxTime: number;

    const mappedDatas = (() => {
      const newDatas = datas.map(item => ({
        value: new BigNumber(item.value).toNumber(),
        time: new Date(item.time).getTime(),
      }));

      const values = newDatas.map(data => data.value);
      const times = newDatas.map(data => data.time);

      minValue = Math.min(...values);
      maxValue = Math.max(...values);
      minTime = Math.min(...times);
      maxTime = Math.max(...times);

      if (smooth) {
        return newDatas.map((item, index) => {
          const context = createItemContext(newDatas, index);

          if (context.prev1 && context.next1 && context.next2) {
            if (
              Math.abs(context.next1.value - context.next2.value) < 0.001 &&
              Math.abs(context.current.value - context.next1.value) < 0.001 &&
              Math.abs(context.current.value - context.prev1.value) >= 0.001
            ) {
              const fakeItemValue = new BigNumber(context.current.value)
                .minus(BigNumber(context.current.value).minus(BigNumber(context.prev1.value)).dividedBy(15))
                .toNumber();

              return {
                value: fakeItemValue,
                time: new Date(item.time).getTime(),
              };
            }
          }
          if (context.prev2 && context.prev1 && context.next1)
            if (
              Math.abs(context.prev2.value - context.prev1.value) < 0.001 &&
              Math.abs(context.prev1.value - context.current.value) < 0.001
            ) {
              if (context.current.value - context.next1.value >= 0.01) {
                const fakeItemValue = new BigNumber(context.current.value)
                  .plus(BigNumber(context.next1.value).minus(BigNumber(context.current.value)).dividedBy(15))
                  .toNumber();

                return {
                  value: fakeItemValue,
                  time: new Date(item.time).getTime(),
                };
              }

              if (context.next1.value - context.current.value >= 0.01) {
                const fakeItemValue = new BigNumber(context.current.value)
                  .plus(BigNumber(context.next1.value).minus(BigNumber(context.current.value)).dividedBy(15))
                  .toNumber();

                return {
                  value: fakeItemValue,
                  time: new Date(item.time).getTime(),
                };
              }
            }
          return item;
        });
      }

      return newDatas;
    })();
    const gapRatio = 0.1;

    const minValueBigNumber = BigNumber(minValue);
    const maxValueBigNumber = BigNumber(maxValue);

    let baseLineNumberWidthComputation = 0;

    const everyPointEqual = maxValueBigNumber.minus(minValueBigNumber).isZero();
    const everyPointZero = everyPointEqual && minValue === 0 && maxValue === 0;

    const minMaxGap = (() => {
      if (everyPointZero) {
        return BigNumber(1);
      }

      if (everyPointEqual) {
        return maxValueBigNumber.multipliedBy(gapRatio);
      }

      if (minValueBigNumber.isLessThan(0) || hasOnlyOnePoint) return maxValueBigNumber;

      return maxValueBigNumber.minus(minValueBigNumber);
    })();

    const baseLineData = new Array(baseLineCount).fill("").map((value, index) => {
      // Gap from lowest value or highest value  to baseline
      const additionalGap = (() => {
        if (everyPointEqual) return minMaxGap.dividedBy(2);

        return minMaxGap.multipliedBy(gapRatio / 2);
      })();

      // Gap between bottom and top base line
      const baseLineGap = (() => {
        if (everyPointEqual) return minMaxGap;

        if (minValueBigNumber.isLessThanOrEqualTo(0)) return maxValueBigNumber;

        return minMaxGap.multipliedBy(1 + gapRatio);
      })();

      // Lowest baseline value
      const tempBottomBaseLineValue = minValueBigNumber.minus(additionalGap);
      const bottomBaseLineValue = tempBottomBaseLineValue.isLessThanOrEqualTo(0)
        ? BigNumber(0)
        : tempBottomBaseLineValue;

      const currentBaseLineValue = bottomBaseLineValue.plus(baseLineGap.multipliedBy(index / (baseLineCount - 1)));

      if (currentBaseLineValue.isLessThan(-1)) {
        return (
          "-" +
          convertToKMB(currentBaseLineValue.absoluteValue().toFixed(), {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })
        );
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
          if (minValueBigNumber.isEqualTo(0)) {
            return height * (1 / 1.05);
          }

          return height * (1 / 1.1);
        }

        return height;
      })();

      // Subtract 5% from the top baseline
      const topFrontierHeight = showBaseLine ? height * (1.05 / 1.1) : height;

      const result = (() => {
        if (everyPointZero) {
          return topFrontierHeight - graphHeight / 2;
        }

        if (minMaxGap.isZero()) {
          return 0;
        }

        if (minValue === 0 && maxValue > 0) {
          return (
            topFrontierHeight + graphHeight * (0.05 / 1.05) - ((value - minValue) * graphHeight) / minMaxGap.toNumber()
          );
        }

        if (everyPointEqual) {
          return topFrontierHeight - (value * 0.05 * graphHeight) / minMaxGap.toNumber();
        }

        return topFrontierHeight - ((value - minValue) * graphHeight) / minMaxGap.toNumber();
      })();

      return result;
    };

    const optimizeTime = function (time: number, width: number) {
      if (maxTime === minTime) {
        return 0;
      }

      return new BigNumber(time - minTime)
        .multipliedBy(width - baseLineNumberWidthComputation)
        .dividedBy(maxTime - minTime)
        .toNumber();
    };

    if (hasOnlyOnePoint) {
      const onlySingleData = mappedDatas[0];

      setPoints([
        {
          x: (width + baseLineNumberWidthComputation) / 2,
          y: optimizeValue(onlySingleData.value, height),
        },
      ]);
      return;
    }

    const points = mappedDatas.map<Point>(data => ({
      x: optimizeTime(data.time, width) + baseLineNumberWidthComputation,
      y: optimizeValue(data.value, height),
    }));

    setPoints(points);
  };

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const isTouch = event.type.startsWith("touch");
    const touch = isTouch ? (event as React.TouchEvent<HTMLDivElement>).touches[0] : null;
    const clientX = isTouch ? touch?.clientX : (event as React.MouseEvent<HTMLDivElement, MouseEvent>).clientX;
    const clientY = isTouch ? touch?.clientY : (event as React.MouseEvent<HTMLDivElement, MouseEvent>).clientY;
    if (!isFocus) {
      setCurrentPointIndex(-1);
      return;
    }

    const { currentTarget } = event;
    const { left, top } = currentTarget.getBoundingClientRect();
    const positionX = (clientX || 0) - left;
    const clientWidth = currentTarget.clientWidth;
    const xPosition = new BigNumber(positionX).multipliedBy(width).dividedBy(clientWidth).toNumber();
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

    const isTooFarFromData = (() => {
      if (points.length < MIN_POINTS_FOR_DISTANCE_CHECK) return false;
      const dataSpan = points[points.length - 1].x - points[0].x;
      const averageGap = dataSpan / (points.length - 1);
      return minDistance > averageGap * HOVER_MAX_DISTANCE_MULTIPLIER;
    })();

    if (isTooFarFromData) {
      setCurrentPointIndex(-1);
      return;
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

        return smooth ? bezierCommand(point, index, points) : `L ${point.x},${point.y}`;
      }
      return points.map((point, index) => mappedPoint(point, index, points)).join(" ");
    },
    [points],
  );

  const firstPoint = useMemo(() => {
    if (points.length === 0) {
      return { x: 0, y: 0 };
    }
    return points[0];
  }, [points]);

  const locationTooltipPosition = useMemo(() => {
    if (forcedPosition) return forcedPosition;

    if ((chartPoint?.y || 0) > customHeight + height - 25) {
      if (width < (currentPoint?.x || 0) + locationTooltip) {
        return "top-end";
      } else {
        return "top-start";
      }
    }
    if (width < (currentPoint?.x || 0) + locationTooltip) return "left";
    return "right";
  }, [currentPoint, width, locationTooltip, height, chartPoint, customHeight, forcedPosition]);

  const onTouchMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    onMouseMove(event);
  };

  const onTouchStart = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    setActivated(true);
    onMouseMove(event);
  };

  const areaPath = useMemo(() => {
    if (!points || points.length === 0 || points.some(point => point === undefined)) {
      return undefined;
    }

    // Start at the first point's x coordinate at firstPoint.y level
    let path = `M ${points[0].x},${firstPoint.y}`;

    // Draw the main line chart path
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      // Plots the actual curve only when the current point is above firstPoint.y
      if (point.y <= firstPoint.y) {
        let pathSegment: string;
        if (i === 0) {
          pathSegment = ` L ${point.x},${point.y}`;
        } else {
          pathSegment = smooth ? bezierCommand(point, i, points) : ` L ${point.x},${point.y}`;
        }
        path += pathSegment;
      } else {
        // Move at the level of firstPoint.y if it is below firstPoint.y
        path += ` L ${point.x},${firstPoint.y}`;
      }
    }

    // Close the path by drawing back to firstPoint.y level
    path += ` L ${points[points.length - 1].x},${firstPoint.y}`;
    path += " Z";

    return path;
  }, [points, smooth, firstPoint.y]);

  const isLightTheme = theme.themeKey === "light";

  const hasTooltipContent = useMemo(() => {
    return datas[currentPointIndex]?.time && datas[currentPointIndex]?.value != null;
  }, [currentPointIndex, datas]);

  const hasOnlyOnePoint = useMemo(() => datas.length === 1, [datas.length]);

  const dateDisplay = useMemo(() => {
    if (displayLastDayAsNow && datas.length - 1 === currentPointIndex) {
      return parseTimeTVL(getLocalizeTime(new Date().toString()));
    }

    return parseTimeTVL(datas[currentPointIndex]?.time);
  }, [currentPointIndex, datas, displayLastDayAsNow]);

  useEffect(() => {
    if (currentPointIndex < 0) {
      onLineGraphMouseMove?.(undefined, undefined);
      return;
    }

    const currentDate =
      displayLastDayAsNow && datas.length - 1 === currentPointIndex
        ? parseTimeTVL(getLocalizeTime(new Date().toString()))
        : parseTimeTVL(datas[currentPointIndex]?.time);

    const formattedValue = popupYValueFormatter
      ? popupYValueFormatter(datas[currentPointIndex]?.value)
      : formatPrice(datas[currentPointIndex]?.value);

    onLineGraphMouseMove?.(datas[currentPointIndex], {
      ...currentDate,
      value: formattedValue,
    });
  }, [currentPointIndex, datas, displayLastDayAsNow, popupYValueFormatter]);

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
      forcedHeight={forcedHeight}
    >
      <FloatingTooltip
        className="chart-tooltip"
        isHiddenArrow
        position={locationTooltipPosition}
        content={
          hasTooltipContent && isShowTooltip && currentPointIndex > -1 ? (
            <LineGraphTooltipWrapper>
              <div className="tooltip-body">
                <span className="date">{dateDisplay.date}</span>
                <span className="time">{dateDisplay.time}</span>
              </div>
              <div className="tooltip-header">
                <span className="value">
                  {popupYValueFormatter
                    ? popupYValueFormatter(datas[currentPointIndex]?.value)
                    : formatPrice(datas[currentPointIndex]?.value)}
                </span>
              </div>
            </LineGraphTooltipWrapper>
          ) : null
        }
      >
        <svg viewBox={`0 0 ${width} ${height + (customHeight || 0)}`}>
          <defs>
            <linearGradient id={"gradient" + COMPONENT_ID} gradientTransform="rotate(90)">
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
                  const currentHeight = height - (height * index) / (baseLineCount - 1);
                  const baseWidth =
                    width - (showBaseLineLabels && baseLineLabelsPosition === "left" ? 0 : baseLineNumberWidth);

                  return (
                    <React.Fragment key={index}>
                      {showBaseLine && (
                        <line
                          x1={showBaseLineLabels && baseLineLabelsPosition === "left" ? baseLineNumberWidth : 0}
                          x2={
                            width - (showBaseLineLabels && baseLineLabelsPosition === "left" ? 0 : baseLineNumberWidth)
                          }
                          y1={currentHeight}
                          y2={currentHeight}
                          stroke="grey"
                          strokeWidth="1"
                          strokeDasharray={3}
                          opacity={0.2}
                        />
                      )}
                      {showBaseLine && showBaseLineLabels && (
                        <text
                          alignmentBaseline="central"
                          className="y-axis-number"
                          x={showBaseLineLabels && baseLineLabelsPosition === "left" ? 0 : baseWidth + 5}
                          y={currentHeight}
                          fill={theme.color.text04}
                          style={baseLineLabelsStyle}
                        >
                          {baseLineLabelsTransform ? baseLineLabelsTransform(value) : value}
                        </text>
                      )}
                    </React.Fragment>
                  );
                })}
              </>
            )}
            {hasOnlyOnePoint && (
              <circle cx={points?.[0]?.x || 0} cy={points?.[0]?.y || 0} r={1} stroke={color} fill={color} />
            )}
            {!isSameData && <path fill={`url(#gradient${COMPONENT_ID})`} stroke={color} strokeWidth={0} d={areaPath} />}
            <path fill="none" stroke={color} strokeWidth={strokeWidth} d={getGraphLine(smooth)} />
            {point &&
              points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={1} stroke={color} />)}
          </g>
          {
            <g>
              {firstPointColor && (
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
              )}
              {isFocus() && currentPoint && showPriceRangeLine && (
                <line
                  stroke={color}
                  strokeWidth={1}
                  x1={currentPoint.x}
                  y1={0}
                  x2={currentPoint.x}
                  y2={height + (customHeight ? customHeight : 0)}
                  strokeDasharray={3}
                />
              )}
              {isFocus() && currentPoint && (
                <circle
                  cx={currentPoint.x}
                  cy={hasNoLabel ? currentPoint.y : currentPoint.y + 24}
                  r={3}
                  stroke={color}
                  fill={color}
                />
              )}
            </g>
          }
        </svg>
      </FloatingTooltip>
      <ChartGlobalTooltip />
      {renderBottom && renderBottom(baseLineNumberWidth)}
    </LineGraphWrapper>
  );
};

export default React.memo(LineGraph);
