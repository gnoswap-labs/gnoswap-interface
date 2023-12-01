import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import useComponentSize from "@hooks/common/use-component-size";
import React, { useCallback } from "react";
import { TvlChartGraphWrapper } from "./TvlChartGraph.styles";

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

  const getDatas = useCallback(() => {
    return datas.map(data => ({
      value: data.amount.value,
      time: data.time,
    }));
  }, [datas]);

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
          />
        </div>
        <div className="xaxis-wrapper">
          {xAxisLabels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      </div>
    </TvlChartGraphWrapper>
  );
};

export default TvlChartGraph;
