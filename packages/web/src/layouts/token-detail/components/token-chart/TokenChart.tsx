import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import type { NetworkClient } from "@common/clients/network-client";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { CHART_LOADING_DELAY_MS } from "@constants/loading.constant";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";

import { CandleChartWrapper, ChartControls, ChartRegion, TokenChartWrapper } from "./TokenChart.styles";
import type { CandleResolution } from "./token-candle-data";
import TokenChartInfo from "./token-chart-info/TokenChartInfo";

function TokenChartLoading() {
  return (
    <div className="price-chart-shell">
      <div className="price-chart-status" role="status" aria-label="Loading price candles">
        <LoadingSpinner size="CHART" delay={CHART_LOADING_DELAY_MS} />
      </div>
    </div>
  );
}

const TokenCandles = dynamic(() => import("./TokenCandles"), {
  ssr: false,
  loading: TokenChartLoading,
});

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

export interface TokenChartProps {
  tokenInfo: TokenInfo;
  loading: boolean;
  hasPrice: boolean;
  candleClient?: NetworkClient | null;
  candlePath?: string;
  candleSymbol?: string;
}

const TokenChart: React.FC<TokenChartProps> = ({
  tokenInfo,
  loading,
  hasPrice,
  candleClient,
  candlePath,
  candleSymbol,
}) => {
  const { t } = useTranslation();
  const [resolution, setResolution] = useState<CandleResolution>("1h");
  const canShowCandles = hasPrice && tokenInfo.priceInfo.priceGradeType !== TOKEN_PRICE_GRADE_TYPE.NONE;

  return (
    <TokenChartWrapper>
      <TokenChartInfo {...tokenInfo} isEmpty={loading} loading={loading} />
      <ChartRegion>
        <ChartControls role="group" aria-label="Chart interval">
          {(["5m", "1h", "4h", "1d", "All"] as const).map(interval => (
            <button
              key={interval}
              type="button"
              aria-pressed={resolution === interval}
              onClick={() => setResolution(interval)}
            >
              {interval}
            </button>
          ))}
        </ChartControls>
        <CandleChartWrapper>
          {loading ? (
            <TokenChartLoading />
          ) : canShowCandles && candlePath ? (
            <TokenCandles
              client={candleClient}
              tokenPath={candlePath}
              symbol={candleSymbol || tokenInfo.token.displaySymbol}
              resolution={resolution}
            />
          ) : (
            <div className="price-chart-shell">
              <div className="price-chart-status" role="status">
                {t("common:noData")}
              </div>
            </div>
          )}
        </CandleChartWrapper>
      </ChartRegion>
    </TokenChartWrapper>
  );
};

export default TokenChart;
