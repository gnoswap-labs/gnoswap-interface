import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { NetworkClient } from "@common/clients/network-client";
import PriceCandleChart from "@components/common/price-candle-chart/PriceCandleChart";
import { formatPrice } from "@utils/new-number-utils";

import { getTokenCandlePage, INTERVALS, type CandleResolution } from "./token-candle-data";

export const formatTokenCandlePrice = (value: number) =>
  formatPrice(value, { usd: false, isKMB: false }).replace(/(\.\d*?[1-9])0+(?=e|$)/, "$1");

interface Props {
  client?: NetworkClient | null;
  tokenPath: string;
  symbol: string;
  resolution: CandleResolution;
}

export default function TokenCandles({ client, tokenPath, symbol, resolution }: Props) {
  const { t } = useTranslation();
  const loadPage = useCallback(
    (start: number, end: number) => {
      if (!client) throw new Error("Token candle client is unavailable");
      return getTokenCandlePage(client, tokenPath, resolution, start, end);
    },
    [client, tokenPath, resolution],
  );
  return (
    <PriceCandleChart
      identity={`${tokenPath}:${resolution}`}
      interval={INTERVALS[resolution]}
      daily={resolution === "1d" || resolution === "All"}
      all={resolution === "All"}
      priceLabel="USD"
      formatCandlePrice={formatTokenCandlePrice}
      label={`${symbol} price in USD, with OHLC candles and ${symbol} volume`}
      volumeSymbols={[symbol]}
      loadingLabel={t("TokenDetails:chart.loading")}
      emptyLabel={t("TokenDetails:chart.empty")}
      searchOlderLabel={t("TokenDetails:chart.searchOlder")}
      errorLabel={t("TokenDetails:chart.error")}
      retryLabel={t("TokenDetails:chart.retry")}
      loadPage={loadPage}
    />
  );
}
