import BarGraph from "@components/common/bar-graph/BarGraph";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import React from "react";
import { VolumeChartGraphWrapper } from "./VolumeChartGraph.styles";

export interface VolumeChartGraphProps {
  datas: string[];
  xAxisLabels: string[];
}

const VolumeChartGraph: React.FC<VolumeChartGraphProps> = ({
  datas,
  xAxisLabels,
}) => {
  const theme = useTheme();
  const [componentRef, size] = useComponentSize();

  return (
    <VolumeChartGraphWrapper>
      <div className="data-wrapper">
        <div className="graph-wrap" ref={componentRef}>
          <BarGraph
            className="graph"
            width={size.width}
            height={size.height}
            color={theme.color.background04Hover}
            hoverColor={theme.color.background04}
            strokeWidth={size.width * 0.022}
            datas={datas}
          />
        </div>
        <div className="xaxis-wrapper">
          {xAxisLabels.map((label, index) => (
            <span key={index} className="label">
              {label}
            </span>
          ))}
        </div>
      </div>
    </VolumeChartGraphWrapper>
  );
};

export default VolumeChartGraph;
