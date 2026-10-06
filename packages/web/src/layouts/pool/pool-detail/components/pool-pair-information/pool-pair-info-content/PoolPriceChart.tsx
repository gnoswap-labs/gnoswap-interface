import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { NetworkClient } from "@common/clients/network-client";
import PriceCandleChart from "@components/common/price-candle-chart/PriceCandleChart";
import type { TokenModel } from "@models/token/token-model";

import { decodeHistory, type Resolution, type UdfHistory } from "./price-chart-data";

interface Props {
  client: NetworkClient;
  poolPath: string;
  tokenA: TokenModel;
  tokenB: TokenModel;
  reversed: boolean;
  range: CandleRange;
}

const PAGE_SIZE = 300;
export type CandleRange = "5m" | "1h" | "4h" | "1d" | "All";
const RESOLUTIONS: Record<CandleRange, Resolution> = {
  "5m": "5",
  "1h": "60",
  "4h": "240",
  "1d": "1D",
  All: "1D",
};

export default function PoolPriceChart({ client, poolPath, tokenA, tokenB, reversed, range }: Props) {
  const { t } = useTranslation();
  const resolution = RESOLUTIONS[range];
  const loadPage = useCallback(
    async (to: number) => {
      const params = new URLSearchParams({
        symbol: poolPath,
        resolution,
        from: "0",
        to: String(to),
        countback: String(PAGE_SIZE),
      });
      const response = await client.get<UdfHistory>({ url: `/tradingview/history?${params.toString()}` });
      return decodeHistory(response.data, tokenA, tokenB, reversed);
    },
    [client, poolPath, tokenA, tokenB, resolution, reversed],
  );
  return (
    <PriceCandleChart
      identity={`${poolPath}:${range}:${reversed}`}
      daily={resolution === "1D"}
      all={range === "All"}
      label={t("Pool:chart.priceChartLabel", {
        pair: `${reversed ? tokenB.displaySymbol : tokenA.displaySymbol}/${
          reversed ? tokenA.displaySymbol : tokenB.displaySymbol
        }`,
      })}
      loadingLabel={t("Pool:chart.loading")}
      emptyLabel={t("Pool:chart.empty")}
      errorLabel={t("Pool:chart.error")}
      retryLabel={t("Pool:chart.retry")}
      loadingOlderLabel={t("Pool:chart.loadingOlder")}
      volumeLabel={t("Pool:chart.volumeUsd")}
      loadPage={loadPage}
    />
  );
}
