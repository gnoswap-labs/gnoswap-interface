import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type { NetworkClient } from "@common/clients/network-client";
import PriceCandleChart, { type PricePoint } from "@components/common/price-candle-chart/PriceCandleChart";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import type { TokenModel } from "@models/token/token-model";
import { useGetPoolPriceByPath } from "@query/pools/use-get-pool-price-by-path";
import { makeDisplayPrice } from "@utils/pool-utils";

import { decodeHistory, type Resolution, type UdfHistory } from "./price-chart-data";

interface Props {
  client: NetworkClient;
  poolPath: string;
  tokenA: TokenModel;
  tokenB: TokenModel;
  currentPriceRatio: string;
  currentPriceReverse: string;
}

const PAGE_SIZE = 300;
const CANDLE_RANGES: { label: string; resolution: Resolution }[] = [
  { label: "5m", resolution: "5" },
  { label: "1h", resolution: "60" },
  { label: "4h", resolution: "240" },
  { label: "1d", resolution: "1D" },
  { label: "All", resolution: "1D" },
];

export default function PoolPriceChart({
  client,
  poolPath,
  tokenA,
  tokenB,
  currentPriceRatio,
  currentPriceReverse,
}: Props) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"line" | "candles">("line");
  const [range, setRange] = useState("7D");
  const [reversed, setReversed] = useState(false);
  const period =
    range === "30D"
      ? CHART_DAY_SCOPE_TYPE["30D"]
      : range === "ALL"
      ? CHART_DAY_SCOPE_TYPE.ALL
      : CHART_DAY_SCOPE_TYPE["7D"];
  const resolution = CANDLE_RANGES.find(item => item.label === range)?.resolution ?? "60";
  const { data, isLoading, isError, refetch } = useGetPoolPriceByPath(poolPath, period, { enabled: mode === "line" });
  const linePoints = useMemo((): PricePoint[] => {
    const points = new Map<number, number>();
    for (const { date, ratio } of data?.prices ?? []) {
      const time = Math.floor(Date.parse(date) / 1000);
      const raw = Number(ratio);
      const price = reversed ? makeDisplayPrice(1 / raw, tokenB, tokenA) : makeDisplayPrice(raw, tokenA, tokenB);
      if (Number.isSafeInteger(time) && Number.isFinite(price) && price > 0) points.set(time, price);
    }
    return Array.from(points, ([time, value]) => ({ time, value })).sort((a, b) => a.time - b.time);
  }, [data?.prices, reversed, tokenA, tokenB]);
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
    <>
      <div className="chart-controls">
        <div className="chart-tabs" role="group" aria-label={t("Pool:chart.mode")}>
          <button
            type="button"
            aria-pressed={mode === "line"}
            onClick={() => {
              setMode("line");
              setRange("7D");
            }}
          >
            {t("Pool:chart.line")}
          </button>
          <button
            type="button"
            aria-pressed={mode === "candles"}
            onClick={() => {
              setMode("candles");
              setRange("1h");
            }}
          >
            {t("Pool:chart.candles")}
          </button>
        </div>
        <div className="chart-pair">
          {`1 ${reversed ? tokenB.displaySymbol : tokenA.displaySymbol} = ${
            reversed ? currentPriceReverse : currentPriceRatio
          } ${reversed ? tokenA.displaySymbol : tokenB.displaySymbol}`}
          <button
            type="button"
            onClick={() => setReversed(value => !value)}
            aria-label={t("Pool:chart.reverse")}
            title={t("Pool:chart.reverse")}
          >
            ⇄
          </button>
        </div>
        <div className="chart-ranges" role="group" aria-label={t("Pool:chart.range")}>
          {(mode === "line" ? ["7D", "30D", "ALL"] : CANDLE_RANGES.map(item => item.label)).map(label => (
            <button key={label} type="button" aria-pressed={range === label} onClick={() => setRange(label)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {mode === "line" && (isLoading || isError) ? (
        <div className="price-chart-shell">
          <div className="price-chart-status" role="status">
            {isLoading ? (
              t("Pool:chart.loading")
            ) : (
              <>
                {t("Pool:chart.error")}{" "}
                <button type="button" onClick={() => void refetch()}>
                  {t("Pool:chart.retry")}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <PriceCandleChart
          identity={`${poolPath}:${mode}:${range}:${reversed}`}
          daily={mode === "line" || resolution === "1D"}
          all={mode === "candles" && range === "All"}
          linePoints={mode === "line" ? linePoints : undefined}
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
      )}
    </>
  );
}
