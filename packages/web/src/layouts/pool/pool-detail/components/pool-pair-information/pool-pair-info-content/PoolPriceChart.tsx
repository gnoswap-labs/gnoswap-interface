import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { NetworkClient } from "@common/clients/network-client";
import PriceCandleChart from "@components/common/price-candle-chart/PriceCandleChart";
import type { TokenModel } from "@models/token/token-model";

import { decodeHistory, type PoolHistory } from "./price-chart-data";

interface Props {
  client: NetworkClient;
  poolPath: string;
  tokenA: TokenModel;
  tokenB: TokenModel;
  reversed: boolean;
  range: CandleRange;
}

export type CandleRange = "5m" | "15m" | "30m" | "1h" | "4h" | "12h" | "1d" | "All";
const INTERVALS: Record<CandleRange, number> = {
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "4h": 14400,
  "12h": 43200,
  "1d": 86400,
  All: 86400,
};

export default function PoolPriceChart({ client, poolPath, tokenA, tokenB, reversed, range }: Props) {
  const { t } = useTranslation();
  const interval = INTERVALS[range];
  const loadPage = useCallback(
    async (start: number, end: number) => {
      const params = new URLSearchParams({
        interval: String(interval),
        start: String(start),
        end: String(end),
      });
      const response = await client.get<PoolHistory>({
        url: `/pools/${encodeURIComponent(poolPath)}/ohlcv?${params.toString()}`,
      });
      return decodeHistory(response.data, reversed, interval, start, end);
    },
    [client, poolPath, interval, reversed],
  );
  return (
    <PriceCandleChart
      identity={`${poolPath}:${range}:${reversed}`}
      interval={interval}
      daily={interval === 86400}
      all={range === "All"}
      label={t("Pool:chart.priceChartLabel", {
        pair: `${reversed ? tokenB.displaySymbol : tokenA.displaySymbol}/${
          reversed ? tokenA.displaySymbol : tokenB.displaySymbol
        }`,
        symbol: reversed ? tokenB.displaySymbol : tokenA.displaySymbol,
      })}
      volumeSymbols={
        reversed ? [tokenB.displaySymbol, tokenA.displaySymbol] : [tokenA.displaySymbol, tokenB.displaySymbol]
      }
      loadingLabel={t("Pool:chart.loading")}
      emptyLabel={t("Pool:chart.empty")}
      searchOlderLabel={t("Pool:chart.searchOlder")}
      errorLabel={t("Pool:chart.error")}
      retryLabel={t("Pool:chart.retry")}
      loadPage={loadPage}
    />
  );
}
