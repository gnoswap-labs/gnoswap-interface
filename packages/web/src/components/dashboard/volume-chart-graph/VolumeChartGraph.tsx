import BarGraph from "@components/common/bar-graph/BarGraph";
import { useTheme } from "@emotion/react";
import React from "react";
import { VolumeChartGraphWrapper } from "./VolumeChartGraph.styles";

export interface VolumeChartGraphProps {
  datas: string[];
  xAxisLabels: string[];
}

const VolumeChartGraph: React.FC<VolumeChartGraphProps> = ({
  datas,
  xAxisLabels
}) => {
  const theme = useTheme();

  return (
    <VolumeChartGraphWrapper>
      <div className="data-wrapper">
        <BarGraph
          className="graph"
          width={570}
          height={180}
          color={theme.color.background04Hover}
          hoverColor={theme.color.point}
          strokeWidth={12.5}
          datas={datas}
        />
        <div className="xaxis-wrapper">
          {xAxisLabels.map((label, index) =>
            <span key={index} className="label">{label}</span>)}
        </div>
      </div>
    </VolumeChartGraphWrapper>
  );
};

export default VolumeChartGraph;
