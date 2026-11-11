import BigNumber from "bignumber.js";

/** Owner-net minimum for a full Limit fill, rounded up in raw output units as the realm does. */
export function calculateLimitMinimumReceived(rawTakingAmount: string, slippageBps: number): string {
  return BigNumber(rawTakingAmount || 0)
    .multipliedBy(10_000 - slippageBps)
    .dividedBy(10_000)
    .toFixed(0, BigNumber.ROUND_CEIL);
}

/**
 * Owner-net minimum for the part of a Limit order that is still unfilled, rounded up in raw output units:
 * `ceil(taking × remaining × (10000 − slippageBps) / (making × 10000))`, where taking and making are the whole
 * order's raw output and input, and remaining is its raw unfilled input.
 *
 * The ceiling is taken once, from those raw terms. Scaling the already rounded full minimum by the unfilled share
 * would round twice, and BigNumber's `dividedBy` rounds the quotient to 20 decimal places, which can drop the
 * fraction that decides the ceiling when raw amounts are large. So the division is done on integers.
 */
export function calculateLimitMinimumRemainingReceived({
  takingAmount,
  makingAmount,
  remainingInput,
  slippageBps,
}: {
  takingAmount: string;
  makingAmount: string;
  remainingInput: string;
  slippageBps: number;
}): string {
  const numerator = BigNumber(takingAmount || 0)
    .multipliedBy(remainingInput || 0)
    .multipliedBy(10_000 - slippageBps);
  const denominator = BigNumber(makingAmount || 0).multipliedBy(10_000);
  if (!numerator.isFinite() || !denominator.isGreaterThan(0)) return "0";

  const quotient = numerator.dividedToIntegerBy(denominator);
  return (numerator.modulo(denominator).isZero() ? quotient : quotient.plus(1)).toFixed();
}
