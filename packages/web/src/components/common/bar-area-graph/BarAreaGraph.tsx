import BigNumber from "bignumber.js";
import React, { useCallback, useState } from "react";
import BarGraph from "../bar-graph/BarGraph";
import { BarAreaGraphLabel, BarAreaGraphWrapper } from "./BarAreaGraph.styles";

export interface BarAreaGraphData {
  value: string;
  time: string;
}

export interface BarAreaGraphProps {
  className?: string;
  strokeWidth?: number;
  datas: string[];
  currentTick?: number;
  minGap?: number;
  width?: number;
  height?: number;
  minLabel?: string;
  maxLabel?: string;
  minTick?: number;
  maxTick?: number;
  editable?: boolean;
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

const BarAreaGraph: React.FC<BarAreaGraphProps> = ({
  className = "",
  datas,
  width = VIEWPORT_DEFAULT_WIDTH,
  height = VIEWPORT_DEFAULT_HEIGHT,
  currentTick,
  minLabel,
  maxLabel,
  minTick,
  maxTick,
  editable,
}) => {
  const existTickRage = (!minTick || !maxTick) === false;
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDownStartLine, setMouseDownStartLine] = useState(false);
  const [mouseDownEndLine, setMouseDownEndLine] = useState(false);
  const [selectedStart, setSelectedStart] = useState(existTickRage);
  const [selectedEnd, setSelectedEnd] = useState(existTickRage);
  const [selectedStartPosition, setSelectedStartPosition] = useState(minTick || 0);
  const [selectedEndPosition, setSelectedEndPosition] = useState(maxTick || 0);

  const getStartPosition = useCallback(() => {
    return selectedStartPosition > selectedEndPosition
      ? selectedEndPosition
      : selectedStartPosition;
  }, [selectedEndPosition, selectedStartPosition]);

  const getEndPosition = useCallback(() => {
    return selectedStartPosition > selectedEndPosition
      ? selectedStartPosition
      : selectedEndPosition;
  }, [selectedEndPosition, selectedStartPosition]);

  const getSelectorPoints = useCallback(() => {
    return `${getStartPosition()},0 ${getStartPosition()},${height} ${getEndPosition()},${height} ${getEndPosition()},0`;
  }, [height, getStartPosition, getEndPosition]);

  const onMouseDownArea = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (!editable) {
      return;
    }
    event.preventDefault();
    const positionX = getPositionByMouseEvent(event, width);

    if (selectedStart) {
      if (
        positionX < getStartPosition() - 10 ||
        positionX > getEndPosition() + 10
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
    if (!editable) {
      return;
    }
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
    <BarAreaGraphWrapper
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
        currentTick={currentTick}
        datas={datas}
        width={width}
        height={height}
        tooltipOption="incentivized"
        svgColor="incentivized"
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
              x1={getStartPosition()}
              y1={0}
              x2={getStartPosition()}
              y2={height}
            />
            {editable && (
              <svg x={getStartPosition() - 12}>
                <rect width="11" height="32" rx="2" fill="#596782" />
                <rect x="3.5" y="2" width="1" height="28" fill="#90A2C0" />
                <rect x="6.5" y="2" width="1" height="28" fill="#90A2C0" />
              </svg>
            )}
          </g>
          <polygon
            className="area"
            fill={"url(#gradient-area)"}
            points={getSelectorPoints()}
          />
          <g className="endline-wrapper" onMouseDown={event => onMouseDownLine(event, "end")}>
            <line
              className="end-line"
              stroke="rgb(0, 205, 46)"
              strokeWidth={2}
              x1={getEndPosition()}
              y1={0}
              x2={getEndPosition()}
              y2={height}
            />
            {editable && (
              <svg x={getEndPosition() + 1}>
                <rect width="11" height="32" rx="2" fill="#596782" />
                <rect x="3.5" y="2" width="1" height="28" fill="#90A2C0" />
                <rect x="6.5" y="2" width="1" height="28" fill="#90A2C0" />
              </svg>
            )}
          </g>
        </svg>
      )}

      {minLabel && (
        <BarAreaGraphLabel
          className="min"
          x={getStartPosition()}
          y={20}
        >
          {minLabel}
        </BarAreaGraphLabel>
      )}
      {maxLabel && (
        <BarAreaGraphLabel
          className="max"
          x={getEndPosition()}
          y={20}
        >
          {maxLabel}
        </BarAreaGraphLabel>
      )}

    </BarAreaGraphWrapper>
  );
};

export default BarAreaGraph;
