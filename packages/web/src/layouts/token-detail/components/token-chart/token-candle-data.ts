import type { NetworkClient } from "@common/clients/network-client";
import type { PriceBar } from "@components/common/price-candle-chart/PriceCandleChart";

export type CandleResolution = "5m" | "1h" | "1d";

const SECONDS: Record<CandleResolution, number> = { "5m": 300, "1h": 3600, "1d": 86400 };
const PAGE_SIZE = 300;
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

export function decodeTokenCandles(body: CandleResponse, tokenPath: string, resolution: CandleResolution): PriceBar[] {
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
  const params = new URLSearchParams({
    resolution,
    from: "0",
    to: String(to),
    countback: String(PAGE_SIZE),
  });
  // The configured API base URL already includes /v1.
  const response = await client.get<CandleResponse>({
    url: `/tokens/${encodeURIComponent(tokenPath)}/candles?${params.toString()}`,
  });
  return decodeTokenCandles(response.data, tokenPath, resolution);
}
