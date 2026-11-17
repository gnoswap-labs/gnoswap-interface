import BigNumber from "bignumber.js";
import dayjs from "dayjs";

import { DcaOrderModel } from "@models/order/dca-order-model";

import { formatPrice, formatTokenAmount } from "./new-number-utils";
import { subscriptFormat } from "./number-utils";

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
 * Amounts in order cards: two decimals rounded down, trailing
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

/**
 * An execution fee that was actually charged, to the output token's last decimal so a tiny fee never reads as zero.
 * `-` when the fee is unknown, which is not the same as a charged `0`.
 */
export function formatOrderFee(fee: BigNumber.Value | null | undefined, decimals: number): string {
  if (fee === null || fee === undefined || fee === "") return "-";
  return formatOrderFullAmount(fee, decimals);
}

/**
 * The current USD value of a fee, e.g. `$0.12`, and `<$0.01` for less than a cent. Null when there is
 * no fee to value or no USD price, so no placeholder value is ever shown.
 */
export function formatOrderFeeUsd(fee: string | null | undefined, usdPrice: string | null | undefined): string | null {
  if (!fee || !usdPrice) return null;
  const value = BigNumber(fee).multipliedBy(usdPrice);
  if (!value.isFinite() || !value.isGreaterThan(0)) return null;
  if (value.isLessThan(0.01)) return "<$0.01";

  return formatPrice(value, { usd: true, isKMB: false });
}

/** Exchange rates: six decimals rounded down with trailing zeros dropped. `-` when unknown. */
export function formatOrderRate(rate: BigNumber.Value | null | undefined): string {
  if (rate === null || rate === undefined || rate === "") return "-";
  const value = BigNumber(rate);
  if (!value.isFinite()) return "-";
  if (value.isZero()) return "0";

  return trimFractionZeros(formatTokenAmount(value.toFixed(), { decimals: 6, minLimit: 0.000001, isKMB: true }));
}

/** Inverts a positive output/input rate for a Buy order's quote/base view. */
export function invertOrderRate(rate: string | null): string | null {
  if (rate === null) return null;
  const value = BigNumber(rate);
  return value.isFinite() && value.isGreaterThan(0) ? BigNumber(1).dividedBy(value).toFixed() : null;
}

/** Significant digits of a displayed Limit market price: those the limit price field keeps. */
const MARKET_PRICE_SIGNIFICANT_DIGITS = 6;

/**
 * A Limit market price for display, so a pair and side read the same in the Limit form and on order cards: rounded
 * down to the six significant digits the limit price field keeps, shown as a rate from 1 up and with subscript zeros
 * once tiny (`0.0₅12345`). `-` when unknown.
 */
export function formatOrderMarketPrice(price: BigNumber.Value | null | undefined): string {
  if (price === null || price === undefined || price === "") return "-";
  const value = BigNumber(price);
  if (!value.isFinite() || value.isLessThanOrEqualTo(0)) return "-";

  const rounded = BigNumber(value.toPrecision(MARKET_PRICE_SIGNIFICANT_DIGITS, BigNumber.ROUND_DOWN));
  return rounded.isLessThan(1) ? subscriptFormat(rounded.toFixed()) : formatOrderRate(rounded);
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

/**
 * How far `price` sits from `referencePrice` as a signed fraction: `1.1` against `1` is `0.1`, `0.95` is `-0.05`.
 * Null unless both are positive numbers, so a missing quote never becomes NaN or Infinity.
 */
export function calculatePriceDeviation(
  price: BigNumber.Value | null | undefined,
  referencePrice: BigNumber.Value | null | undefined,
): number | null {
  const value = BigNumber(price ?? "");
  const reference = BigNumber(referencePrice ?? "");
  if (!value.isFinite() || !reference.isFinite() || value.lte(0) || reference.lte(0)) return null;

  const deviation = value.dividedBy(reference).minus(1).toNumber();
  return Number.isFinite(deviation) ? deviation : null;
}

/**
 * A deviation fraction as a signed percentage in `locale`: `0.1` → `+10%`, `-0.0525` → `-5.25%`.
 * Up to two decimals, and no sign once it rounds to `0%`. Null when there is no deviation.
 */
export function formatOrderPriceDeviation(deviation: number | null | undefined, locale?: string): string | null {
  if (deviation === null || deviation === undefined || !Number.isFinite(deviation)) return null;

  return new Intl.NumberFormat(locale, {
    style: "percent",
    signDisplay: "exceptZero",
    maximumFractionDigits: 2,
  }).format(deviation);
}

/** Calendar-free units, largest first: a month or a year has no fixed length, so 30 days stays `30 days`. */
const RELATIVE_DURATION_UNITS: readonly (readonly [Intl.RelativeTimeFormatUnit, number])[] = [
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
  ["second", 1],
];

/**
 * A future duration in seconds as `locale` text, in the largest whole unit that holds it exactly:
 * `3600` → `in 1 hour`, `604800` → `in 1 week`, `2592000` → `in 30 days`. Null for a non-positive or fractional span.
 */
export function formatOrderRelativeDuration(durationSec: number, locale?: string): string | null {
  if (!Number.isFinite(durationSec) || durationSec <= 0) return null;

  for (const [unit, unitSec] of RELATIVE_DURATION_UNITS) {
    if (durationSec % unitSec === 0) {
      return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(durationSec / unitSec, unit);
    }
  }
  return null;
}

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3_600;
const SECONDS_PER_DAY = 86_400;

/**
 * When an open DCA order places its last round: its next execution, plus one interval for each round after it.
 * Null unless the order has a real schedule (a next execution, a positive interval and a round left), so no end is
 * ever guessed for one that has none.
 */
export function calculateDcaOrderEndAt({
  nextExecutionAt,
  interval,
  remainingCount,
}: Pick<DcaOrderModel, "nextExecutionAt" | "interval" | "remainingCount">): number | null {
  if (nextExecutionAt === null || !Number.isFinite(nextExecutionAt) || nextExecutionAt <= 0) return null;
  if (!Number.isFinite(interval) || interval <= 0) return null;
  if (!Number.isInteger(remainingCount) || remainingCount < 1) return null;

  return nextExecutionAt + interval * (remainingCount - 1);
}

/** Seconds from `nowUnixSeconds` until `endAt`. Null when `endAt` is unknown or not a number, or no longer ahead. */
function secondsUntil(endAt: number | null | undefined, nowUnixSeconds: number): number | null {
  if (endAt === null || endAt === undefined) return null;

  const seconds = endAt - nowUnixSeconds;
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

/** Calendar-free units of a countdown, largest first: a month has no fixed length, so 30 days is `30d`. */
const COUNTDOWN_UNITS = [
  ["day", SECONDS_PER_DAY],
  ["hour", SECONDS_PER_HOUR],
  ["minute", SECONDS_PER_MINUTE],
] as const;

/**
 * The time left until `endAt` as compact `locale` text down to the minute: `2d 3h 15m`, `1h`, `45m`. A started
 * minute counts as a whole one, so it never reads `0m` while time is left. Null once `endAt` is unknown or not ahead.
 */
export function formatOrderRemainingTime(
  endAt: number | null | undefined,
  locale?: string,
  nowUnixSeconds = Date.now() / 1000,
): string | null {
  const seconds = secondsUntil(endAt, nowUnixSeconds);
  if (seconds === null) return null;

  let remaining = Math.ceil(seconds / SECONDS_PER_MINUTE) * SECONDS_PER_MINUTE;
  const parts: string[] = [];
  for (const [unit, unitSeconds] of COUNTDOWN_UNITS) {
    const count = Math.floor(remaining / unitSeconds);
    remaining -= count * unitSeconds;
    if (count > 0) {
      parts.push(new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "narrow" }).format(count));
    }
  }

  return new Intl.ListFormat(locale, { type: "unit", style: "narrow" }).format(parts);
}

/**
 * The unit an approximate time is told in. A larger unit takes over once the smaller one would round up to a whole
 * one of it: 59.5 minutes is `in 1 hour`, not `in 60 minutes`, and 23.5 hours is `in 1 day`, not `in 24 hours`.
 */
function pickApproximateUnit(seconds: number): readonly [Intl.RelativeTimeFormatUnit, number] {
  if (seconds >= SECONDS_PER_DAY - SECONDS_PER_HOUR / 2) return ["day", SECONDS_PER_DAY];
  if (seconds >= SECONDS_PER_HOUR - SECONDS_PER_MINUTE / 2) return ["hour", SECONDS_PER_HOUR];
  return ["minute", SECONDS_PER_MINUTE];
}

/**
 * How far off `endAt` is as approximate `locale` text, rounded to the nearest whole day, hour or minute:
 * `in 1 day`, `in 3 hours`, `in 25 minutes`. A month has no fixed length, so 30 days stays `in 30 days`.
 * Null once `endAt` is unknown or not ahead.
 */
export function formatOrderTimeUntil(
  endAt: number | null | undefined,
  locale?: string,
  nowUnixSeconds = Date.now() / 1000,
): string | null {
  const seconds = secondsUntil(endAt, nowUnixSeconds);
  if (seconds === null) return null;

  const [unit, unitSeconds] = pickApproximateUnit(seconds);
  const count = Math.max(1, Math.round(seconds / unitSeconds));
  return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(count, unit);
}
