import BarGraph from "@components/common/bar-graph/BarGraph";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import React, { useMemo } from "react";
import { VolumeChartGraphWrapper } from "./VolumeChartGraph.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";

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
  const { breakpoint } = useWindowSize();

  const countXAxis = useMemo(() => {
    if (breakpoint !== DEVICE_TYPE.MOBILE)
      return Math.floor((((size.width || 0) + 20) - 25) / 100);
    return Math.floor((((size.width || 0) + 20) - 8) / 80);
    }, [size.width, breakpoint]);

  return (
    <VolumeChartGraphWrapper>
      <div className="data-wrapper">
        <div className="graph-wrap" ref={componentRef}>
          <BarGraph
            className="graph"
            width={size.width}
            height={size.height - 24}
            color={theme.color.background04Hover}
            hoverColor={theme.color.background04}
            strokeWidth={size.width * 0.022}
            datas={datas}
            customData={{
              height: 24,
              marginTop: 24,
            }}
          />
        </div>
        <div className="xaxis-wrapper">
          {xAxisLabels.slice(0, Math.min(countXAxis, 8)).map((label, index) => (
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
