import BigNumber from "bignumber.js";

type DisplayNumberValue = BigNumber | bigint | number | string;

const AMOUNT_MINIMUM = BigNumber("0.000001");
const USD_MINIMUM = BigNumber("0.01");
const AMOUNT_DECIMALS = 6;
const USD_DECIMALS = 2;

const toBigNumber = (value: DisplayNumberValue | null | undefined): BigNumber | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const normalizedValue = value.toString().replace(/,/g, "").trim();
  if (normalizedValue === "") {
    return null;
  }

  const bigNumber = BigNumber(normalizedValue);
  return bigNumber.isFinite() && !bigNumber.isNaN() ? bigNumber : null;
};

const formatWithoutTrailingZeros = (value: BigNumber, decimals: number): string => {
  const sign = value.isNegative() ? "-" : "";
  const [integer, fraction] = value.abs().toFormat(decimals, BigNumber.ROUND_DOWN).split(".");
  const trimmedFraction = fraction?.replace(/0+$/, "");

  return `${sign}${integer}${trimmedFraction ? `.${trimmedFraction}` : ""}`;
};

/**
 * Formats a token amount that is already converted to display units.
 * Positive values below the Gno minimum display unit use the minimum marker.
 */
export const formatAmount = (value: DisplayNumberValue | null | undefined): string => {
  const bigNumber = toBigNumber(value);
  if (!bigNumber) {
    return "-";
  }

  if (bigNumber.isZero()) {
    return "0";
  }

  if (bigNumber.isPositive() && bigNumber.isLessThan(AMOUNT_MINIMUM)) {
    return "<0.000001";
  }

  return formatWithoutTrailingZeros(bigNumber, AMOUNT_DECIMALS);
};

/**
 * Converts a raw token amount to display units without passing through a JavaScript number,
 * then applies the shared token amount display policy.
 */
export const formatRawAmount = (rawAmount: DisplayNumberValue | null | undefined, decimals: number): string => {
  if (!Number.isInteger(decimals) || decimals < 0) {
    return "-";
  }

  const bigNumber = toBigNumber(rawAmount);
  return formatAmount(bigNumber?.shiftedBy(-decimals));
};

/**
 * Formats a USD value using the shared wallet/value display policy.
 */
export const formatUsd = (value: DisplayNumberValue | null | undefined): string => {
  const bigNumber = toBigNumber(value);
  if (!bigNumber) {
    return "-";
  }

  if (bigNumber.isZero()) {
    return "$0";
  }

  if (bigNumber.isPositive() && bigNumber.isLessThan(USD_MINIMUM)) {
    return "<$0.01";
  }

  const sign = bigNumber.isNegative() ? "-" : "";
  const formattedValue = bigNumber.abs().isInteger()
    ? bigNumber.abs().toFormat(0)
    : bigNumber.abs().toFormat(USD_DECIMALS, BigNumber.ROUND_DOWN);

  return `${sign}$${formattedValue}`;
};
