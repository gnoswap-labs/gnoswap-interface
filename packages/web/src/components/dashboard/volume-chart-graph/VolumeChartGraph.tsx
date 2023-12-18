import BarGraph from "@components/common/bar-graph/BarGraph";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import React, { useMemo } from "react";
import { VolumeChartGraphWrapper } from "./VolumeChartGraph.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";

export interface VolumeChartGraphProps {
  datas: string[];
  times: string[];
  xAxisLabels: string[];
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
  return Array.from(indices).sort((a, b) => a - b);
};

const VolumeChartGraph: React.FC<VolumeChartGraphProps> = ({
  datas,
  xAxisLabels,
  times,
}) => {
  const theme = useTheme();
  const [componentRef, size] = useComponentSize();
  const { breakpoint } = useWindowSize();

  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor(((size.width || 0) + 20 - 25) / 100);
    return Math.floor(((size.width || 0) + 20 - 8) / 80);
  }, [size.width, breakpoint]);

  const minGap = useMemo(() => {
    if (datas.length < 8) return 16;
    if (datas.length < 31) return 6;
    return 2;
  }, [datas.length]);

  const labelIndicesToShow = useMemo(() => {
    return calculateMiddleIndices(xAxisLabels.length, Math.min(countXAxis, 4));
  }, [countXAxis, xAxisLabels.length]);

  return (
    <VolumeChartGraphWrapper>
      <div className="data-wrapper">
        <div className="graph-wrap" ref={componentRef}>
          <BarGraph
            className={`graph ${datas.length > 8 ? "graph-medium-gap" : ""}`}
            width={size.width - 12}
            height={size.height - 24}
            color={theme.color.background04Hover}
            hoverColor={theme.color.background04}
            strokeWidth={size.width * 0.022}
            datas={datas}
            minGap={minGap}
            customData={{
              height: 24,
              locationTooltip: 170,
            }}
            times={times}
            radiusBorder={datas.length !== 91 ? 2 : 1}
          />
        </div>
        <div className="xaxis-wrapper">
          {labelIndicesToShow.map((x, i) => (
            <span key={i}>{xAxisLabels[x]}</span>
          ))}

          {/* {xAxisLabels.slice(0, Math.min(countXAxis, 8)).map((label, index) => (
            <span key={index} className="label">
              {label}
            </span>
          ))} */}
        </div>
      </div>
    </VolumeChartGraphWrapper>
  );
};

export default VolumeChartGraph;
