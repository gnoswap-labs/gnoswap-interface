import { ChartInfo, TokenChartGraphPeriodType, TokenInfo } from "@containers/token-chart-container/TokenChartContainer";
import React from "react";
import TokenChartInfo from "../token-chart-info/TokenChartInfo";
import TokenChartGraphTab from "./token-chart-graph-tab/TokenChartGraphTab";
import TokenChartGraph from "./token-chart-graph/TokenChartGraph";
import { ChartNotFound, LoadingChart, TokenChartWrapper } from "./TokenChart.styles";
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
      {chartInfo?.datas.length === 0 && !loading && <ChartNotFound>
        No data found
      </ChartNotFound>}
      {loading && <LoadingChart>
        <LoadingSpinner />
      </LoadingChart>}
      {chartInfo?.datas.length !== 0 && !loading && <TokenChartGraph
        xAxisLabels={chartInfo?.xAxisLabels || []}
        yAxisLabels={chartInfo?.yAxisLabels || []}
        datas={chartInfo?.datas || []}
        currentTab={currentTab}
      />}
    </TokenChartWrapper>
  );
};

export default TokenChart;
