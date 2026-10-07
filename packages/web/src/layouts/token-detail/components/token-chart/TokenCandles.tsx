import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { NetworkClient } from "@common/clients/network-client";
import PriceCandleChart from "@components/common/price-candle-chart/PriceCandleChart";

import { getTokenCandlePage, INTERVALS, type CandleResolution } from "./token-candle-data";

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
      label={t("TokenDetails:chart.candleLabel", { symbol })}
      loadingLabel={t("TokenDetails:chart.loading")}
      emptyLabel={t("TokenDetails:chart.empty")}
      searchOlderLabel={t("TokenDetails:chart.searchOlder")}
      errorLabel={t("TokenDetails:chart.error")}
      retryLabel={t("TokenDetails:chart.retry")}
      volumeLabel={t("TokenDetails:chart.volumeToken", { symbol })}
      loadPage={loadPage}
    />
  );
}
