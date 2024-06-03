import { ChartInfo, TokenChartGraphPeriodType, TokenInfo } from "@containers/token-chart-container/TokenChartContainer";
import React, { useMemo } from "react";
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
  const isAllZero = useMemo(() => {
    return ((chartInfo?.datas?.length || 0) > 0) && chartInfo?.datas.every(item => {
      return Number(item.amount.value) === 0;
    });
  }, [chartInfo?.datas]);
  console.log("🚀 ~ isAllZero ~ isAllZero:", isAllZero);

  return (
    <TokenChartWrapper>
      <TokenChartInfo {...tokenInfo} isEmpty={chartInfo?.datas.length === 0 && !loading || isAllZero || false} loading={loading} />
      <TokenChartGraphTab
        currentTab={currentTab}
        changeTab={changeTab}
      />
      {((chartInfo?.datas.length === 0 || isAllZero) && !loading) && <ChartNotFound>
        No data
      </ChartNotFound>}
      {loading && <LoadingChart>
        <LoadingSpinner />
      </LoadingChart>}
      {(chartInfo?.datas.length !== 0 && !loading && !isAllZero) && <TokenChartGraph
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
