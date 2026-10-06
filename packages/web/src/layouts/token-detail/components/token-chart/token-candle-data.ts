import type { NetworkClient } from "@common/clients/network-client";
import type { PriceBar } from "@components/common/price-candle-chart/PriceCandleChart";

export type CandleResolution = "5m" | "1h" | "4h" | "1d" | "All";
type SourceResolution = "5m" | "1h" | "1d";
const SECONDS: Record<SourceResolution, number> = { "5m": 300, "1h": 3600, "1d": 86400 };
const PAGE_SIZE = 300;
const FOUR_HOUR_SECONDS = 14400;
const DECIMAL = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;

interface CandleResponse {
  message: string;
  data: {
    tokenPath: string;
    resolutionSeconds: number;
    candles: {
      bucketStart: number;
      open: string;
      high: string;
      low: string;
      close: string;
      volumeUsd: string;
    }[];
  };
}

export function decodeTokenCandles(body: CandleResponse, tokenPath: string, resolution: SourceResolution): PriceBar[] {
  const data = body?.data;
  if (data?.tokenPath !== tokenPath || data.resolutionSeconds !== SECONDS[resolution] || !Array.isArray(data.candles)) {
    throw new Error("Invalid token candle response");
  }
  return data.candles.map((candle, index) => {
    const values = [candle?.open, candle?.high, candle?.low, candle?.close, candle?.volumeUsd];
    if (
      !Number.isSafeInteger(candle?.bucketStart) ||
      candle.bucketStart < 0 ||
      candle.bucketStart % SECONDS[resolution] !== 0 ||
      (index > 0 && candle.bucketStart <= data.candles[index - 1].bucketStart) ||
      values.some(value => typeof value !== "string" || !DECIMAL.test(value))
    ) {
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
    return { time: candle.bucketStart, open, high, low, close, volume };
  });
}

export async function getTokenCandlePage(
  client: NetworkClient,
  tokenPath: string,
  resolution: CandleResolution,
  to: number,
): Promise<PriceBar[]> {
  const sourceResolution = resolution === "4h" ? "1h" : resolution === "All" ? "1d" : resolution;
  const fetchPage = async (from: number, end: number, countback: number) => {
    const params = new URLSearchParams({
      resolution: sourceResolution,
      from: String(from),
      to: String(end),
      countback: String(countback),
    });
    const response = await client.get<CandleResponse>({
      url: `/tokens/${encodeURIComponent(tokenPath)}/candles?${params.toString()}`,
    });
    return decodeTokenCandles(response.data, tokenPath, sourceResolution);
  };
  const bars = await fetchPage(0, to, resolution === "4h" ? 496 : PAGE_SIZE);
  if (resolution !== "4h" || !bars.length) return bars;

  // Countback can cut through the oldest four-hour group. Complete it before rolling up.
  const firstBucket = Math.floor(bars[0].time / FOUR_HOUR_SECONDS) * FOUR_HOUR_SECONDS;
  if (firstBucket < bars[0].time) {
    bars.unshift(...(await fetchPage(firstBucket, bars[0].time, 3)));
  }
  const result: PriceBar[] = [];
  for (const bar of bars) {
    const time = Math.floor(bar.time / FOUR_HOUR_SECONDS) * FOUR_HOUR_SECONDS;
    const last = result[result.length - 1];
    if (last?.time === time) {
      last.high = Math.max(last.high, bar.high);
      last.low = Math.min(last.low, bar.low);
      last.close = bar.close;
      last.volume += bar.volume;
      if (!Number.isFinite(last.volume)) throw new Error("Token candle volume exceeds chart number range");
    } else {
      result.push({ ...bar, time });
    }
  }
  return result;
}
