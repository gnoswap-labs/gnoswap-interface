import BigNumber from "bignumber.js";

/**
 * Converts a value to a {@link BigNumber}.
 *
 * Returns a `NaN` instance instead of throwing when the input cannot be
 * converted, allowing callers to handle invalid values with methods such as
 * {@link BigNumber.isNaN} or {@link BigNumber.isFinite}.
 *
 * @param value - The value to convert.
 * @returns The converted value, or a `NaN` instance if conversion fails.
 */
export function toBigNumber(value: BigNumber.Value): BigNumber {
  try {
    return new BigNumber(value);
  } catch {
    return new BigNumber(NaN);
  }
}
