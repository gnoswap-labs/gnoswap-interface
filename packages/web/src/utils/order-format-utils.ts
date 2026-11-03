import BigNumber from "bignumber.js";
import dayjs from "dayjs";

import { formatTokenAmount } from "./new-number-utils";

const ORDER_DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const ORDER_DATE_FORMAT = "YYYY-MM-DD";

/** Drops trailing fraction zeros while keeping any K/M/B suffix: `1.50K` → `1.5K`, `12.00` → `12`. */
export function trimFractionZeros(value: string): string {
  const match = value.match(/^([^.]*)(\.\d*?)(0*)([^\d]*)$/);
  if (!match) return value;
  const [, integer, fraction, , suffix] = match;
  return `${integer}${fraction === "." ? "" : fraction}${suffix}`;
}

/**
 * Amounts in order cards and history rows: two decimals rounded down, trailing
 * zeros dropped, `<0.01` below that and K/M/B above a thousand. `0` when empty.
 */
export function formatOrderAmount(amount: BigNumber.Value | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "0";
  const value = BigNumber(amount);
  if (!value.isFinite() || value.isZero()) return "0";

  return trimFractionZeros(formatTokenAmount(value.toFixed(), { decimals: 2, minLimit: 0.01, isKMB: true }));
}

/** Full-precision amounts for the stop modal: every token decimal, grouped, trailing zeros dropped, no K/M/B. */
export function formatOrderFullAmount(amount: BigNumber.Value | null | undefined, decimals: number): string {
  if (amount === null || amount === undefined || amount === "") return "0";
  const value = BigNumber(amount);
  if (!value.isFinite() || value.isZero()) return "0";

  return trimFractionZeros(value.toFormat(decimals, BigNumber.ROUND_DOWN));
}

/** Exchange rates: six decimals rounded down with trailing zeros dropped. `-` when unknown. */
export function formatOrderRate(rate: BigNumber.Value | null | undefined): string {
  if (rate === null || rate === undefined || rate === "") return "-";
  const value = BigNumber(rate);
  if (!value.isFinite()) return "-";
  if (value.isZero()) return "0";

  return trimFractionZeros(formatTokenAmount(value.toFixed(), { decimals: 6, minLimit: 0.000001, isKMB: true }));
}

/** Unix seconds as local `YYYY-MM-DD HH:mm:ss`. */
export function formatOrderDateTime(unixSeconds: number | null | undefined): string {
  if (!unixSeconds) return "-";
  return dayjs(unixSeconds * 1000).format(ORDER_DATE_TIME_FORMAT);
}

/** Unix seconds as local `YYYY-MM-DD`. */
export function formatOrderDate(unixSeconds: number | null | undefined): string {
  if (!unixSeconds) return "-";
  return dayjs(unixSeconds * 1000).format(ORDER_DATE_FORMAT);
}

/** Cumulative return with a direction marker: `▴ 1.52%`, `▾ 0.40%`. Zero counts as up. */
export function formatOrderRoi(roi: number | null): { text: string; isNegative: boolean } | null {
  if (roi === null || !Number.isFinite(roi)) return null;
  const isNegative = roi < 0;
  return {
    text: `${isNegative ? "▾" : "▴"} ${BigNumber(Math.abs(roi)).toFixed(2, BigNumber.ROUND_DOWN)}%`,
    isNegative,
  };
}

/** Basis points as a percentage: `15` → `0.15%`. */
export function formatBps(bps: number | null | undefined): string {
  if (bps === null || bps === undefined || !Number.isFinite(bps)) return "-";
  return `${trimFractionZeros(BigNumber(bps).dividedBy(100).toFixed(2))}%`;
}
