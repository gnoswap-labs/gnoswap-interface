import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { NetworkClient } from "@common/clients/network-client";
import PriceCandleChart from "@components/common/price-candle-chart/PriceCandleChart";

import { getTokenCandlePage, type CandleResolution } from "./token-candle-data";

interface Props {
  client: NetworkClient;
  tokenPath: string;
  symbol: string;
  resolution: CandleResolution;
}

export default function TokenCandles({ client, tokenPath, symbol, resolution }: Props) {
  const { t } = useTranslation();
  const loadPage = useCallback(
    (to: number) => getTokenCandlePage(client, tokenPath, resolution, to),
    [client, tokenPath, resolution],
  );
  return (
    <PriceCandleChart
      key={`${tokenPath}:${resolution}`}
      identity={`${tokenPath}:${resolution}`}
      daily={resolution === "1d"}
      priceLabel="USD"
      label={t("TokenDetails:chart.candleLabel", { symbol })}
      loadingLabel={t("TokenDetails:chart.loading")}
      emptyLabel={t("TokenDetails:chart.empty")}
      errorLabel={t("TokenDetails:chart.error")}
      retryLabel={t("TokenDetails:chart.retry")}
      loadingOlderLabel={t("TokenDetails:chart.loadingOlder")}
      volumeLabel={t("TokenDetails:chart.volumeUsd")}
      loadPage={loadPage}
    />
  );
}
