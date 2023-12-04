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
    return Math.floor((((size.width || 0) + 20) - 25) / 100);
  return Math.floor((((size.width || 0) + 20) - 8) / 80);
  }, [size.width, breakpoint]);
  
  const minGap = useMemo(() => {
    if (datas.length === 8) return 16;
    if (datas.length === 31) return 6;
    if (datas.length === 91) return 2;
  }, [datas.length]);

  return (
    <VolumeChartGraphWrapper>
      <div className="data-wrapper">
        <div className="graph-wrap" ref={componentRef}>
          <BarGraph
            className="graph"
            width={size.width - 12}
            height={size.height - 24}
            color={theme.color.background04Hover}
            hoverColor={theme.color.background04}
            strokeWidth={size.width * 0.022}
            datas={datas}
            minGap={minGap}
            customData={{
              height: 24,
              marginTop: 24,
            }}
            times={times}
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
