import LineGraph from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import React from "react";
import { TokenChartGraphWrapper } from "./TokenChartGraph.styles";

export interface TokenChartGraphProps {
  datas: {
    amount: {
      value: string;
      denom: string;
    };
    time: string;
  }[];
  xAxisLabels: string[];
  yAxisLabels: string[];
}

const TokenChartGraph: React.FC<TokenChartGraphProps> = ({
  datas,
  xAxisLabels,
  yAxisLabels
}) => {
  const theme = useTheme();

  return (
    <TokenChartGraphWrapper>
      <div className="data-wrapper">
        <LineGraph
          cursor
          className="graph"
          width={755}
          height={366}
          color={theme.color.point}
          strokeWidth={1}
          datas={datas.map(data => ({
            value: data.amount.value,
            time: data.time
          }))}
        />
        <div className="xaxis-wrapper">
          {xAxisLabels.map((label, index) =>
            <span key={index} className="label">{label}</span>)}
        </div>
      </div>
      <div className="yaxis-wrapper">
        {yAxisLabels.map((label, index) =>
          <span key={index} className="label">{label}</span>)}
      </div>
    </TokenChartGraphWrapper>
  );
};

export default TokenChartGraph;
