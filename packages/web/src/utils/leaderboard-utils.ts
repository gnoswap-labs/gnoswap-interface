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

// Swap points per GNOT of router fee paid (the round swap rate).
export const LEADERBOARD_SWAP_POINTS_PER_GNOT = 5;

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

// Router fees paid in GNOT, derived from the swap points before the cap.
export const getSwapFeeGnot = (swapRawPoint: string | undefined): string | null => {
  const raw = toBigNumber(swapRawPoint);
  if (!raw) return null;
  return raw.dividedBy(LEADERBOARD_SWAP_POINTS_PER_GNOT).toString();
};

// USD value of a GNOT amount at the given GNOT price, or null without a price.
export const getGnotUsdValue = (gnotAmount: string | null, gnotUsdPrice: string | undefined): string | null => {
  const amount = toBigNumber(gnotAmount ?? undefined);
  const price = toBigNumber(gnotUsdPrice);
  if (!amount || !price) return null;
  return amount.multipliedBy(price).toString();
};
