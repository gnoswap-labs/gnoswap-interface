import type { NetworkClient } from "@common/clients/network-client";
import { DECIMAL, mapHistoryRows, type HistoryResponse } from "@components/common/price-candle-chart/price-history-data";
import type { PriceBar } from "@components/common/price-candle-chart/PriceCandleChart";

export type CandleResolution = "5m" | "1h" | "4h" | "1d" | "All";
export const INTERVALS: Record<CandleResolution, number> = {
  "5m": 300,
  "1h": 3600,
  "4h": 14400,
  "1d": 86400,
  All: 86400,
};

interface TokenCandle {
  start: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export type TokenHistory = HistoryResponse<TokenCandle>;

export function decodeTokenCandles(body: TokenHistory, interval: number, start: number, end: number): PriceBar[] {
  return mapHistoryRows(body, interval, start, end, (candle, time) => {
    const values = [candle.open, candle.high, candle.low, candle.close, candle.volume];
    if (values.some(value => typeof value !== "string" || !DECIMAL.test(value))) {
      throw new Error("Invalid token candle response");
    }
    const [open, high, low, close, volume] = values.map(Number);
    if (
      [open, high, low, close].some(price => !Number.isFinite(price) || price <= 0) ||
      !Number.isFinite(volume) ||
      high < Math.max(open, close, low) ||
      low > Math.min(open, close, high)
    ) {
      throw new Error("Token candles cannot be displayed at this precision");
    }
    return { time, open, high, low, close, volume };
  });
}

export async function getTokenCandlePage(
  client: NetworkClient,
  tokenPath: string,
  resolution: CandleResolution,
  start: number,
  end: number,
): Promise<PriceBar[]> {
  const interval = INTERVALS[resolution];
  const params = new URLSearchParams({
    interval: String(interval),
    start: String(start),
    end: String(end),
  });
  const response = await client.get<TokenHistory>({
    url: `/tokens/${encodeURIComponent(tokenPath)}/price/history?${params.toString()}`,
  });
  return decodeTokenCandles(response.data, interval, start, end);
}
