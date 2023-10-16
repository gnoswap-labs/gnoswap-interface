import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import BarGraph from "../bar-graph/BarGraph";
import { PoolGraphLabel, PoolGraphWrapper } from "./PoolGraph.styles";
import { PoolTick } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";

export interface PoolGraphData {
  value: string;
  time: string;
}

export interface PoolGraphProps {
  className?: string;
  ticks: PoolTick[];
  currentTick?: PoolTick;
  width?: number;
  height?: number;
  minTick?: PoolTick;
  maxTick?: PoolTick;
  onChangeMinTick?: (tick: PoolTick | undefined) => void;
  onChangeMaxTick?: (tick: PoolTick | undefined) => void;
}

const VIEWPORT_DEFAULT_WIDTH = 400;
const VIEWPORT_DEFAULT_HEIGHT = 200;

function getPositionByMouseEvent(
  event: React.MouseEvent<HTMLElement | SVGElement, MouseEvent>,
  width: number,
) {
  const { clientX, currentTarget } = event;
  const { left, width: clientWidth } = currentTarget.getBoundingClientRect();
  return BigNumber(clientX - left)
    .multipliedBy(width)
    .dividedBy(clientWidth)
    .toNumber();
}

const PoolGraph: React.FC<PoolGraphProps> = ({
  className = "",
  ticks,
  width = VIEWPORT_DEFAULT_WIDTH,
  height = VIEWPORT_DEFAULT_HEIGHT,
  currentTick,
  minTick,
  maxTick,
  onChangeMinTick,
  onChangeMaxTick,
}) => {
  const existTickRage = (!minTick || !maxTick) === false;
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDownStartLine, setMouseDownStartLine] = useState(false);
  const [mouseDownEndLine, setMouseDownEndLine] = useState(false);
  const [selectedStart, setSelectedStart] = useState(existTickRage);
  const [selectedEnd, setSelectedEnd] = useState(existTickRage);
  const [selectedStartPosition, setSelectedStartPosition] = useState(-1);
  const [selectedEndPosition, setSelectedEndPosition] = useState(-1);

  const tickValues = useMemo(() => {
    return ticks.map(tick => tick.value);
  }, [ticks]);

  const startPosition = useMemo(() => {
    return Math.min(selectedStartPosition, selectedEndPosition);
  }, [selectedEndPosition, selectedStartPosition]);

  const endPosition = useMemo(() => {
    return Math.max(selectedStartPosition, selectedEndPosition);
  }, [selectedEndPosition, selectedStartPosition]);

  const areaPoints = useMemo(() => {
    return `${startPosition},0 ${startPosition},${height} ${endPosition},${height} ${endPosition},0`;
  }, [height, startPosition, endPosition]);

  const barWidth = useMemo(() => {
    return width / ticks.length;
  }, [width, ticks]);

  const currentTickIndex = useMemo(() => {
    if (!currentTick?.tick) {
      return -1;
    }
    return ticks.findIndex(item => item.tick >= currentTick.tick);
  }, [ticks, currentTick]);

  const findTickByPosition = useCallback((position: number) => {
    return ticks.find((_, index) => (index + 1) * barWidth > position);
  }, [ticks, barWidth]);

  const minLabel = useMemo(() => {
    if (currentTickIndex < 0 || !selectedStart) {
      return null;
    }
    const currentTickPosition = currentTickIndex * barWidth;
    const range = BigNumber((startPosition - currentTickPosition) / (currentTickPosition) * 100).toFixed(0);
    return `${range}%`;
  }, [barWidth, currentTickIndex, selectedStart, startPosition]);

  const maxLabel = useMemo(() => {
    if (currentTickIndex < 0 || !selectedStart) {
      return null;
    }
    const currentTickPosition = currentTickIndex * barWidth;
    const range = BigNumber((endPosition - currentTickPosition) / (width - currentTickPosition) * 100).toFixed(0);
    return `${range}%`;
  }, [barWidth, currentTickIndex, endPosition, selectedStart, width]);

  useEffect(() => {
    if (minTick && !startPosition) {
      const tickValue = minTick.tick * barWidth;
      setSelectedStartPosition(tickValue);
    }
  }, [barWidth, minTick, startPosition]);

  useEffect(() => {
    if (maxTick && !endPosition) {
      const tickValue = maxTick.tick * barWidth;
      setSelectedEndPosition(tickValue);
    }
  }, [barWidth, endPosition, maxTick]);

  useEffect(() => {
    if (onChangeMinTick) {
      onChangeMinTick(findTickByPosition(startPosition));
    }
  }, [findTickByPosition, onChangeMinTick, startPosition]);

  useEffect(() => {
    if (onChangeMaxTick) {
      onChangeMaxTick(findTickByPosition(endPosition));
    }
  }, [findTickByPosition, onChangeMaxTick, endPosition]);

  const onMouseDownArea = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const positionX = getPositionByMouseEvent(event, width);

    if (selectedStart) {
      if (
        positionX < startPosition - 10 ||
        positionX > endPosition + 10
      ) {
        setSelectedStart(false);
        setSelectedEnd(false);
        setSelectedStartPosition(0);
        setSelectedEndPosition(0);
        return;
      } else {
        return;
      }
    }
    setSelectedStart(true);
    setMouseDown(true);
    setSelectedStartPosition(positionX);
    setSelectedEndPosition(positionX);
  };

  const onMouseUpArea = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    const isMouseDown = mouseDown || mouseDownStartLine || mouseDownEndLine;
    if (!isMouseDown) {
      return;
    }
    setMouseDownStartLine(false);
    setMouseDownEndLine(false);
    setMouseDown(false);
    if (selectedStart) {
      setSelectedEnd(true);
    }
  };

  const onMouseMoveArea = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const isMouseDown = mouseDown || mouseDownStartLine || mouseDownEndLine;
    if (!isMouseDown) {
      return;
    }
    const positionX = getPositionByMouseEvent(event, width);
    if (mouseDownStartLine) {
      moveLine("start", positionX);
      return;
    }
    if (mouseDownEndLine) {
      moveLine("end", positionX);
      return;
    }
    if (!selectedEnd) {
      setSelectedEndPosition(positionX);
    }
  };

  const onMouseDownLine = (
    event: React.MouseEvent<SVGGElement, MouseEvent>,
    lineType: "start" | "end",
  ) => {
    event.preventDefault();
    if (lineType === "start") {
      setMouseDownStartLine(true);
    } else {
      setMouseDownEndLine(true);
    }
  };

  const moveLine = (lineType: "start" | "end", positionX: number) => {
    if (lineType === "start") {
      setSelectedStartPosition(positionX);
    } else {
      setSelectedEndPosition(positionX);
    }
  };

  return (
    <PoolGraphWrapper
      className={className}
      width={width}
      height={height}
      onMouseDown={onMouseDownArea}
      onMouseUp={onMouseUpArea}
      onMouseLeave={onMouseUpArea}
      onMouseMove={onMouseMoveArea}
    >
      <BarGraph
        minGap={1}
        strokeWidth={100}
        color="#596782"
        hoverColor="#90A2C0"
        currentTick={currentTickIndex}
        datas={tickValues}
        width={width}
        height={height}
      />

      {selectedStart && (
        <svg className="selector" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id={"gradient-area"} gradientTransform="rotate(0)">
              <stop offset="0%" stopColor={"rgba(255, 2, 2, 0.2)"} />
              <stop offset="100%" stopColor={"rgba(0, 205, 46, 0.2)"} />
            </linearGradient>
          </defs>
          <g onMouseDown={event => onMouseDownLine(event, "start")}>
            <line
              className="start-line"
              stroke="rgb(255, 2, 2)"
              strokeWidth={2}
              x1={startPosition}
              y1={0}
              x2={startPosition}
              y2={height}
            />

            <svg x={startPosition - 12}>
              <rect width="11" height="32" rx="2" fill="#596782" />
              <rect x="3.5" y="2" width="1" height="28" fill="#90A2C0" />
              <rect x="6.5" y="2" width="1" height="28" fill="#90A2C0" />
            </svg>
          </g>
          <polygon
            className="area"
            fill={"url(#gradient-area)"}
            points={areaPoints}
          />
          <g className="endline-wrapper" onMouseDown={event => onMouseDownLine(event, "end")}>
            <line
              className="end-line"
              stroke="rgb(0, 205, 46)"
              strokeWidth={2}
              x1={endPosition}
              y1={0}
              x2={endPosition}
              y2={height}
            />

            <svg x={endPosition + 1}>
              <rect width="11" height="32" rx="2" fill="#596782" />
              <rect x="3.5" y="2" width="1" height="28" fill="#90A2C0" />
              <rect x="6.5" y="2" width="1" height="28" fill="#90A2C0" />
            </svg>
          </g>
        </svg>
      )}

      {minLabel && (
        <PoolGraphLabel
          className="min"
          x={startPosition}
          y={20}
        >
          {minLabel}
        </PoolGraphLabel>
      )}
      {maxLabel && (
        <PoolGraphLabel
          className="max"
          x={endPosition}
          y={20}
        >
          {maxLabel}
        </PoolGraphLabel>
      )}

    </PoolGraphWrapper>
  );
};

export default PoolGraph;
