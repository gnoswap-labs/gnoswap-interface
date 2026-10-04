import type { TokenModel } from "@models/token/token-model";
import { makeDisplayPrice } from "@utils/pool-utils";

export type Resolution = "5" | "60" | "240" | "1D";

export interface UdfHistory {
  s: "ok" | "no_data" | "error";
  t?: number[];
  o?: number[];
  h?: number[];
  l?: number[];
  c?: number[];
  v?: number[];
  errmsg?: string;
}

export interface PriceBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function decodeHistory(
  history: UdfHistory,
  tokenA: TokenModel,
  tokenB: TokenModel,
  reversed: boolean,
): PriceBar[] {
  if (history.s === "no_data") return [];
  if (history.s !== "ok") throw new Error(history.errmsg || "Price history unavailable");
  const { t, o, h, l, c, v } = history;
  if (!t || !o || !h || !l || !c || !v || [o, h, l, c, v].some(values => values.length !== t.length)) {
    throw new Error("Invalid price history response");
  }
  return t.map((time, index) => {
    const raw = [o[index], h[index], l[index], c[index]];
    if (
      !Number.isInteger(time) ||
      raw.some(price => !Number.isFinite(price) || price <= 0) ||
      !Number.isFinite(v[index]) ||
      v[index] < 0 ||
      (index > 0 && time <= t[index - 1])
    ) {
      throw new Error("Invalid price history response");
    }
    const [open, high, low, close] = raw.map(price => makeDisplayPrice(price, tokenA, tokenB));
    if ([open, high, low, close].some(price => !Number.isFinite(price) || price <= 0)) {
      throw new Error("Price history cannot be displayed at this token precision");
    }
    const bar = reversed
      ? { time, open: 1 / open, high: 1 / low, low: 1 / high, close: 1 / close, volume: v[index] }
      : { time, open, high, low, close, volume: v[index] };
    if ([bar.open, bar.high, bar.low, bar.close].some(price => !Number.isFinite(price) || price <= 0)) {
      throw new Error("Price history cannot be displayed at this token precision");
    }
    return bar;
  });
}
