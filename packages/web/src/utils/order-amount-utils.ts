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

/**
 * Estimated Limit fee for a full fill exactly at the owner-net target, without slippage.
 * The realm requires gross = floor((net - 1) * 10000 / (10000 - feeBps)) + 1.
 * Its cumulative fee at that boundary is gross - net, all in raw output units.
 */
export function estimateLimitExecutionFee(rawNetOutput: string, feeBps: number | null | undefined): string | null {
  const net = BigNumber(rawNetOutput);
  if (
    !net.isInteger() ||
    !net.isGreaterThan(0) ||
    feeBps === null ||
    feeBps === undefined ||
    !Number.isInteger(feeBps) ||
    feeBps < 0 ||
    feeBps >= 10_000
  ) {
    return null;
  }
  return net.minus(1).multipliedBy(feeBps).dividedToIntegerBy(10_000 - feeBps).toFixed();
}
