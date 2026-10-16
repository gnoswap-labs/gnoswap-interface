import BigNumber from "bignumber.js";

import { LeaderboardVisibilityStatus } from "@repositories/leaderboard/response/common/types";
import { removeTrailingZeros } from "@utils/number-utils";
import { numberToFormat } from "@utils/string-utils";

export const isLeaderboardHidden = (status: LeaderboardVisibilityStatus) => {
  return status === LeaderboardVisibilityStatus.HIDDEN;
};

export const formatLeaderboardPoint = (point: string | undefined): string => {
  if (!point) return "-";
  const formattedPoint = numberToFormat(point, { decimals: 2, forceDecimals: true, truncateDecimals: true });
  return removeTrailingZeros(formattedPoint);
};

const toBigNumber = (value: string | undefined): BigNumber | null => {
  if (!value) return null;
  const parsed = BigNumber(value);
  return parsed.isFinite() ? parsed : null;
};

// The wallet cap limits the swap points when the swap points before the cap exceed it.
export const isSwapCapReached = (swapRawPoint: string | undefined, swapCapPoint: string | undefined): boolean => {
  const raw = toBigNumber(swapRawPoint);
  const cap = toBigNumber(swapCapPoint);
  if (!raw || !cap) return false;
  return raw.isGreaterThan(cap);
};

/**
 * Global cap ratio of the round, derived from one account's swap points: the
 * accepted swap points are the wallet-capped swap points scaled by the ratio.
 * Returns null when the account has no wallet-capped swap points to derive it from.
 */
export const getGlobalCapRatio = (
  swapPoint: string | undefined,
  swapRawPoint: string | undefined,
  swapCapPoint: string | undefined,
): string | null => {
  const accepted = toBigNumber(swapPoint);
  const raw = toBigNumber(swapRawPoint);
  const cap = toBigNumber(swapCapPoint);
  if (!accepted || !raw || !cap) return null;

  const walletCapped = BigNumber.min(raw, cap);
  if (!walletCapped.isGreaterThan(0)) return null;

  return BigNumber.min(accepted.dividedBy(walletCapped), 1).toFixed(2);
};

// Decimals of the GNS token (delegated amounts are in base units).
const GNS_DECIMALS = 6;

// Whole GNS from a base-unit amount, e.g. "2500000000000" -> "2,500,000".
export const formatGnsAmount = (baseAmount: string | undefined): string => {
  const amount = toBigNumber(baseAmount);
  if (!amount) return "-";
  return formatLeaderboardPoint(amount.shiftedBy(-GNS_DECIMALS).toString());
};

// GNOT value of a USD amount at the GNOT USD price, or null without a usable price.
export const getGnotValueOfUsd = (
  usd: string | undefined,
  gnotUsdPrice: string | number | undefined,
): string | null => {
  const value = toBigNumber(usd);
  const price = toBigNumber(gnotUsdPrice === undefined ? undefined : String(gnotUsdPrice));
  if (!value || !price || !price.isGreaterThan(0)) return null;
  return value.dividedBy(price).toString();
};
