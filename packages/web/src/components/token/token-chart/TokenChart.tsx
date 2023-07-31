import { ChartInfo, TokenChartGraphPeriodType, TokenInfo } from "@containers/token-chart-container/TokenChartContainer";
import React from "react";
import TokenChartInfo from "../token-chart-info/TokenChartInfo";
import TokenChartGraphTab from "./token-chart-graph-tab/TokenChartGraphTab";
import TokenChartGraph from "./token-chart-graph/TokenChartGraph";
import { TokenChartWrapper } from "./TokenChart.styles";


export interface TokenChartProps {
  tokenInfo: TokenInfo;
  chartInfo?: ChartInfo;
  currentTab: TokenChartGraphPeriodType;
  changeTab: (tab: string) => void;
}

const TokenChart: React.FC<TokenChartProps> = ({
  tokenInfo,
  chartInfo,
  currentTab,
  changeTab,
}) => {
  return (
    <TokenChartWrapper>
      <TokenChartInfo {...tokenInfo} />
      <TokenChartGraphTab
        currentTab={currentTab}
        changeTab={changeTab}
      />
      <TokenChartGraph
        xAxisLabels={chartInfo?.xAxisLabels || []}
        yAxisLabels={["1", "2", "3", "4", "5", "6", "7"]}
        datas={chartInfo?.datas || []}
      />
    </TokenChartWrapper>
  );
};

export default TokenChart;
