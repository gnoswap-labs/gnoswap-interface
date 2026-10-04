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
  resolution: Resolution;
  reversed: boolean;
  all: boolean;
}

const PAGE_SIZE = 300;

export default function PoolPriceChart({ client, poolPath, tokenA, tokenB, resolution, reversed, all }: Props) {
  const { t } = useTranslation();
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
      key={`${poolPath}:${resolution}:${reversed}:${all}`}
      identity={`${poolPath}:${resolution}:${reversed}:${all}`}
      daily={resolution === "1D"}
      all={all}
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
