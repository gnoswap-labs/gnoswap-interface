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
      return Math.floor((((size.width || 0) + 20) - 25) / 100);
    return Math.floor((((size.width || 0) + 20) - 8) / 80);
    }, [size.width, breakpoint]);
  return (
    <TvlChartGraphWrapper>
      <div className="data-wrapper">
        <div className="graph-wrap" ref={componentRef}>
          <LineGraph
            cursor
            className="graph"
            width={size.width}
            height={size.height - 36}
            color={theme.color.background04Hover}
            strokeWidth={1}
            datas={getDatas()}
            typeOfChart="tvl"
            customData={{
              height: 36,
              marginTop: 24,
            }}
          />
        </div>
        <div className="xaxis-wrapper">
          {xAxisLabels.slice(0, Math.min(countXAxis, 8)).map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      </div>
    </TvlChartGraphWrapper>
  );
};

export default TvlChartGraph;
