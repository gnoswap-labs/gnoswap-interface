import type { PriceBar } from "@components/common/price-candle-chart/PriceCandleChart";
import {
  DECIMAL,
  mapHistoryRows,
  type HistoryResponse,
} from "@components/common/price-candle-chart/price-history-data";

export interface PoolCandle {
  start: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume0: string;
  volume1: string;
}

export type PoolHistory = HistoryResponse<PoolCandle>;

export function decodeHistory(
  history: PoolHistory,
  reversed: boolean,
  interval: number,
  start: number,
  end: number,
): Required<PriceBar>[] {
  return mapHistoryRows(history, interval, start, end, (candle, time) => {
    const values = [candle.open, candle.high, candle.low, candle.close, candle.volume0, candle.volume1];
    if (values.some(value => typeof value !== "string" || !DECIMAL.test(value))) {
      throw new Error("Invalid price history response");
    }
    // The API already quotes whole token1 per whole token0, regardless of decimals.
    const [open, high, low, close, volume0, volume1] = values.map(Number);
    if (
      [open, high, low, close].some(price => !Number.isFinite(price) || price <= 0) ||
      !Number.isFinite(volume0) ||
      !Number.isFinite(volume1) ||
      high < Math.max(open, close, low) ||
      low > Math.min(open, close, high)
    ) {
      throw new Error("Price history cannot be displayed at this token precision");
    }
    const volume = reversed ? volume1 : volume0;
    const quoteVolume = reversed ? volume0 : volume1;
    const bar = reversed
      ? {
          time,
          open: 1 / open,
          high: 1 / low,
          low: 1 / high,
          close: 1 / close,
          volume,
          quoteVolume,
        }
      : { time, open, high, low, close, volume, quoteVolume };
    if (reversed && [bar.open, bar.high, bar.low, bar.close].some(price => !Number.isFinite(price) || price <= 0)) {
      throw new Error("Price history cannot be displayed at this token precision");
    }
    return bar;
  });
}
