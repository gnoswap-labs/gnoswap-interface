import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { ComponentSize } from "@hooks/common/use-component-size";
import { DEVICE_TYPE } from "@styles/media";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";

import TokenChartGraphTab from "./token-chart-graph-tab/TokenChartGraphTab";
import TokenChartGraph from "./token-chart-graph/TokenChartGraph";
import TokenChartInfo from "./token-chart-info/TokenChartInfo";

import {
  ChartNotFound,
  LoadingChart,
  TokenChartWrapper,
} from "./TokenChart.styles";

export interface TokenInfo {
  token: {
    name: string;
    symbol: string;
    image: string;
    pkg_path: string;
    decimals: number;
    description: string;
    website_url: string;
  };
  priceInfo: {
    amount: {
      value: number | string;
      denom: string;
      status: MATH_NEGATIVE_TYPE;
    };
    changedRate: string;
  };
}

export interface ChartInfo {
  xAxisLabels: string[];
  yAxisLabels: string[];
  datas: {
    amount: {
      value: string;
      denom: string;
    };
    time: string;
  }[];
}

export interface TokenChartProps {
  tokenInfo: TokenInfo;
  chartInfo?: ChartInfo;
  tabs: Readonly<string[]>;
  currentTab: string;
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
  tabs,
  changeTab,
  loading,
  componentRef,
  size,
  breakpoint,
}) => {
  const { t } = useTranslation();

  const isAllZero = useMemo(() => {
    return (
      (chartInfo?.datas?.length || 0) === 0 ||
      chartInfo?.datas.every(item => {
        return Number(item.amount.value) === 0;
      })
    );
  }, [chartInfo?.datas]);

  return (
    <TokenChartWrapper>
      <TokenChartInfo
        {...tokenInfo}
        isEmpty={loading || isAllZero || false}
        loading={loading}
      />
      <TokenChartGraphTab
        tabs={tabs}
        currentTab={currentTab}
        changeTab={changeTab}
      />
      {(chartInfo?.datas.length === 0 || isAllZero) && !loading && (
        <ChartNotFound>{t("common:noData")}</ChartNotFound>
      )}
      {loading && (
        <LoadingChart>
          <LoadingSpinner />
        </LoadingChart>
      )}
      {chartInfo?.datas.length !== 0 && !loading && !isAllZero && (
        <TokenChartGraph
          xAxisLabels={chartInfo?.xAxisLabels || []}
          yAxisLabels={chartInfo?.yAxisLabels || []}
          datas={chartInfo?.datas || []}
          currentTab={currentTab}
          componentRef={componentRef}
          size={size}
          breakpoint={breakpoint}
        />
      )}
    </TokenChartWrapper>
  );
};

export default TokenChart;
