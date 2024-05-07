import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import React, { useCallback, useMemo } from "react";
import { TvlChartGraphWrapper } from "./TvlChartGraph.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";

export interface TvlChartGraphProps {
  datas: {
    amount: {
      value: string;
      denom: string;
    };
    time: string;
  }[];
  xAxisLabels: string[];
  yAxisLabels?: string[];
}

const calculateMiddleIndices = (totalLabels = 0, countXAxis = 0) => {
  const indices = new Set<number>();
  // Helper function to add indices
  const addIndices = (start: number, end: number) => {
    const mid = Math.floor((start + end) / 2);
    if (!indices.has(mid)) {
      indices.add(mid);
      if (indices.size < countXAxis) {
        // Add midpoint of the left subarray
        addIndices(start, mid - 1);
        // Add midpoint of the right subarray
        addIndices(mid + 1, end);
      }
    }
  };

  // Always include the first and last labels
  indices.add(0);
  indices.add(totalLabels - 1);

  // Begin by adding the middle of the entire array
  addIndices(0, totalLabels - 1);

  // Convert to array and sort to ensure the correct order
  return Array.from(indices).sort((a, b) => b - a);
};

const TvlChartGraph: React.FC<TvlChartGraphProps> = ({
  datas,
  xAxisLabels,
}) => {
  const theme = useTheme();
  const [componentRef, size] = useComponentSize();
  const { breakpoint } = useWindowSize();

  const getDatas = useCallback(() => {
    return datas.map(data => ({
      value: data.amount.value,
      time: data.time,
    }));
  }, [datas]);

  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor(((size.width || 0) + 20 - 25) / 100);
    return Math.floor(((size.width || 0) + 20 - 8) / 80);
  }, [size.width, breakpoint]);

  const labelIndicesToShow = useMemo(() => {
    return calculateMiddleIndices(xAxisLabels.length, Math.min(countXAxis, 4));
  }, [countXAxis, xAxisLabels.length]);

  return (
    <TvlChartGraphWrapper>
      <div className="data-wrapper">
        <div className="graph-wrap" ref={componentRef}>
          <LineGraph
            cursor
            className="graph"
            width={size.width}
            height={size.height}
            color={theme.color.background04Hover}
            strokeWidth={1}
            datas={getDatas()}
            typeOfChart="tvl"
            customData={{
              height: 36,
              locationTooltip: 170,
            }}
          />
        </div>
        <div className="xaxis-wrapper">
          {labelIndicesToShow.map((x, i) => (
            <span key={i}>{xAxisLabels[x]}</span>
          ))}
          {/* {xAxisLabels.slice(0, Math.min(countXAxis, 8)).map((label, index) => (
            <span key={index}>{label}</span>
          ))} */}
        </div>
      </div>
    </TvlChartGraphWrapper>
  );
};

export default TvlChartGraph;
