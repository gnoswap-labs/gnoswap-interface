import { ChartInfo, TokenChartGraphPeriodType, TokenInfo } from "@containers/token-chart-container/TokenChartContainer";
import React from "react";
import TokenChartInfo from "../token-chart-info/TokenChartInfo";
import TokenChartGraphTab from "./token-chart-graph-tab/TokenChartGraphTab";
import TokenChartGraph from "./token-chart-graph/TokenChartGraph";
import { ChartNotFound, LoadingChart, TokenChartWrapper } from "./TokenChart.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { ComponentSize } from "@hooks/common/use-component-size";
import { DEVICE_TYPE } from "@styles/media";


export interface TokenChartProps {
  tokenInfo: TokenInfo;
  chartInfo?: ChartInfo;
  currentTab: TokenChartGraphPeriodType;
  changeTab: (tab: string) => void;
  loading: boolean;
  componentRef: React.RefObject<HTMLDivElement>;
  size: ComponentSize;
  breakpoint: DEVICE_TYPE;
}

const TokenChart: React.FC<TokenChartProps> = ({
  tokenInfo,
  chartInfo,
  currentTab,
  changeTab,
  loading,
  componentRef,
  size,
  breakpoint,
}) => {
  
  return (
    <TokenChartWrapper>
      <TokenChartInfo {...tokenInfo} loading={loading}/>
      <TokenChartGraphTab
        currentTab={currentTab}
        changeTab={changeTab}
      />
      {chartInfo?.datas.length === 0 && !loading && <ChartNotFound>
        No data
      </ChartNotFound>}
      {loading && <LoadingChart>
        <LoadingSpinner />
      </LoadingChart>}
      {chartInfo?.datas.length !== 0 && !loading && <TokenChartGraph
        xAxisLabels={chartInfo?.xAxisLabels || []}
        yAxisLabels={chartInfo?.yAxisLabels || []}
        datas={chartInfo?.datas || []}
        currentTab={currentTab}
        componentRef={componentRef}
        size={size}
        breakpoint={breakpoint}
      />}
    </TokenChartWrapper>
  );
};

export default TokenChart;
