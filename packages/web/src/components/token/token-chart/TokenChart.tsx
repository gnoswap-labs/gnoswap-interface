import { ChartInfo, TokenChartGraphPeriodType, TokenInfo } from "@containers/token-chart-container/TokenChartContainer";
import React from "react";
import TokenChartInfo from "../token-chart-info/TokenChartInfo";
import TokenChartGraphTab from "./token-chart-graph-tab/TokenChartGraphTab";
import TokenChartGraph from "./token-chart-graph/TokenChartGraph";
import { LoadingChart, TokenChartWrapper } from "./TokenChart.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";


export interface TokenChartProps {
  tokenInfo: TokenInfo;
  chartInfo?: ChartInfo;
  currentTab: TokenChartGraphPeriodType;
  changeTab: (tab: string) => void;
  loading: boolean;
}

const TokenChart: React.FC<TokenChartProps> = ({
  tokenInfo,
  chartInfo,
  currentTab,
  changeTab,
  loading,
}) => {
  
  return (
    <TokenChartWrapper>
      <TokenChartInfo {...tokenInfo} loading={loading}/>
      <TokenChartGraphTab
        currentTab={currentTab}
        changeTab={changeTab}
      />

      {loading && <LoadingChart>
        <LoadingSpinner />
      </LoadingChart>}
      {!loading && <TokenChartGraph
        xAxisLabels={chartInfo?.xAxisLabels || []}
        yAxisLabels={["1", "2", "3", "4", "5", "6", "7"]}
        datas={chartInfo?.datas || []}
        currentTab={currentTab}
      />}
    </TokenChartWrapper>
  );
};

export default TokenChart;
