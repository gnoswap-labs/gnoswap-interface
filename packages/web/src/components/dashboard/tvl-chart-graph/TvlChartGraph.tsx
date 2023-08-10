import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
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

  const getDatas = useCallback(() => {
    return datas.map(data => ({
      value: data.amount.value,
      time: data.time,
    }));
  }, [datas]);

  return (
    <TvlChartGraphWrapper>
      <div className="data-wrapper">
        <LineGraph
          cursor
          className="graph"
          width={570}
          height={180}
          color={theme.color.point}
          strokeWidth={1}
          datas={getDatas()}
        />
        <div className="xaxis-wrapper">
          {xAxisLabels.map((label, index) => (
            <span key={index} className="label">
              {label}
            </span>
          ))}
        </div>
      </div>
    </TvlChartGraphWrapper>
  );
};

export default TvlChartGraph;
