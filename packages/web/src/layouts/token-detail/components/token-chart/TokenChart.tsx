import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type { NetworkClient } from "@common/clients/network-client";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { ComponentSize } from "@hooks/common/use-component-size";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";
import { DEVICE_TYPE } from "@styles/media";

import {
  CandleChartWrapper,
  ChartControls,
  ChartNotFound,
  ChartRegion,
  LoadingChart,
  TokenChartWrapper,
} from "./TokenChart.styles";
import type { CandleResolution } from "./token-candle-data";
import TokenChartGraphTab from "./token-chart-graph-tab/TokenChartGraphTab";
import TokenChartGraph from "./token-chart-graph/TokenChartGraph";
import TokenChartInfo from "./token-chart-info/TokenChartInfo";

// Browser-only canvas dependency stays outside SSR and the default line chart bundle.
const TokenCandles = dynamic(() => import("./TokenCandles"), { ssr: false });

export interface TokenInfo {
  token: {
    name: string;
    symbol: string;
    displaySymbol: string;
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
    priceGradeType: TOKEN_PRICE_GRADE_TYPE;
    changedRate: string;
  };
}

export interface ChartInfo {
  xAxisLabels: string[];
  yAxisLabels: string[];
  yAxisMin?: string;
  yAxisMax?: string;
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
  candleClient?: NetworkClient | null;
  candlePath?: string;
  candleSymbol?: string;
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
  candleClient,
  candlePath,
  candleSymbol,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"line" | "candles">("line");
  const [resolution, setResolution] = useState<CandleResolution>("1h");

  const isAllZero = useMemo(() => {
    return (
      (chartInfo?.datas?.length || 0) === 0 ||
      (chartInfo?.datas.every(item => Number(item.amount.value) === 0) ?? false)
    );
  }, [chartInfo?.datas]);

  return (
    <TokenChartWrapper>
      <TokenChartInfo {...tokenInfo} isEmpty={loading || (mode === "line" && isAllZero)} loading={loading} />
      <ChartRegion>
        <ChartControls role="group" aria-label={t("TokenDetails:chart.controls")}>
          <div className="chart-mode">
            <button type="button" aria-pressed={mode === "line"} onClick={() => setMode("line")}>
              {t("TokenDetails:chart.line")}
            </button>
            <button type="button" aria-pressed={mode === "candles"} onClick={() => setMode("candles")}>
              {t("TokenDetails:chart.candles")}
            </button>
          </div>
          {mode === "line" ? (
            <div className="chart-tab-wrapper" role="group" aria-label={t("TokenDetails:chart.interval")}>
              <TokenChartGraphTab tabs={tabs} currentTab={currentTab} changeTab={changeTab} />
            </div>
          ) : (
            <div className="chart-intervals" role="group" aria-label={t("TokenDetails:chart.interval")}>
              {(["5m", "1h", "1d"] as const).map(interval => (
                <button
                  key={interval}
                  type="button"
                  aria-pressed={resolution === interval}
                  onClick={() => setResolution(interval)}
                >
                  {interval}
                </button>
              ))}
            </div>
          )}
        </ChartControls>
        {mode === "line" ? (
          <>
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
                yAxisMin={chartInfo?.yAxisMin}
                yAxisMax={chartInfo?.yAxisMax}
                datas={chartInfo?.datas || []}
                currentTab={currentTab}
                componentRef={componentRef}
                size={size}
                breakpoint={breakpoint}
              />
            )}
          </>
        ) : candleClient && candlePath ? (
          <CandleChartWrapper>
            <TokenCandles
              key={`${candlePath}:${resolution}`}
              client={candleClient}
              tokenPath={candlePath}
              symbol={candleSymbol || tokenInfo.token.displaySymbol}
              resolution={resolution}
            />
          </CandleChartWrapper>
        ) : (
          <ChartNotFound role="status">
            {loading ? t("TokenDetails:chart.loading") : t("TokenDetails:chart.error")}
          </ChartNotFound>
        )}
      </ChartRegion>
    </TokenChartWrapper>
  );
};

export default TokenChart;
