import BigNumber from "bignumber.js";

import { SimulateTxResult } from "@common/clients/gno-provider/gno-provider";
import {
  DEFAULT_GAS_FEE,
  DEFAULT_NATIVE_AMOUNT_RESERVE,
  GAS_FEE_RESERVE_MARGIN,
  NATIVE_AMOUNT_RESERVE_BUFFER,
  PROBE_HEADROOM_CAP,
  PROBE_HEADROOM_RATIO,
  SMALL_BALANCE_PROBE_DIVISOR,
  STORAGE_DEPOSIT_BUFFER_MULTIPLIER,
} from "@common/values";
import { GasToken } from "@common/values/token-constant";
import { makeRawTokenAmount } from "@utils/token-utils";

import { MaxNativeAmount, NativeAmountReserve } from "./transaction-gas-service";

/**
 * How much native balance an action has to leave behind, and therefore the
 * largest amount it can spend. Every figure is an integer ugnot string.
 *
 * Two costs stay behind, known in different ways:
 *
 * - The **gas fee** is deducted in full, whatever the gas turns out to be. The
 *   wallet re-prices it from its own gas estimate, so it is priced from the
 *   measured gas rather than read off a constant.
 * - The **storage deposit** is locked per realm whose storage grew. It is only
 *   visible in the events a simulation emits.
 *
 * Both rise with the amount, so neither can be sized without simulating the
 * action — and the amount simulated has to be one the balance could actually
 * cover, which the maximum by definition is not. Hence:
 *
 * 1. {@link planProbes} — pick amounts to measure at, and the fee each affords.
 * 2. measure — simulate the first step that the balance can carry (I/O).
 * 3. {@link priceReserve} — turn that measurement into a reserve.
 * 4. {@link bisectToward} — climb toward the ceiling, retreating on failure.
 * 5. {@link cappedSpendable} — respect both the measured and the priced bound.
 * 6. {@link describeWithheld} — report what is really held back.
 */

/**
 * The flat fee a send path offers, in ugnot, derived the way
 * `generateSendTransactionParams` derives it so the two cannot drift apart.
 */
export const OFFERED_GAS_FEE = makeRawTokenAmount(GasToken, DEFAULT_GAS_FEE) ?? `${DEFAULT_NATIVE_AMOUNT_RESERVE}`;

/** Used when the node cannot say what gas costs. Matches the genesis floor. */
export const MINIMUM_GAS_PRICE = 0.001;

/**
 * How many times step 4 may narrow the amount. Each one is a message build and
 * a simulation, so this trades latency for precision: from a hold-back of H the
 * remaining slack is about H / 2^ATTEMPTS.
 */
export const NARROW_ATTEMPTS = 3;

export const toUgnot = (value: BigNumber.Value) => BigNumber(value).toFixed(0, BigNumber.ROUND_DOWN);

export const ceilToUgnot = (value: BigNumber.Value) => BigNumber(value).toFixed(0, BigNumber.ROUND_CEIL);

/** An amount to simulate at, with a fee the balance can still cover there. */
export interface ProbeStep {
  amount: string;
  gasFee: string;
}

/** True when the balance could not even pay the fee a send path offers. */
export function isSubFeeBalance(balance: BigNumber.Value, offeredGasFee: string): boolean {
  return BigNumber(balance).isLessThanOrEqualTo(offeredGasFee);
}

/**
 * Step 1. Amounts to measure at, in order of preference.
 *
 * | Balance            | Measured at                      | Retry              |
 * | ------------------ | -------------------------------- | ------------------ |
 * | over the fee       | `balance - min(5 GNOT, 10%)`     | `balance - 10%`    |
 * | fee or under       | `balance / 100`                  | none               |
 *
 * A balance that can bear the fee is measured just below its ceiling, holding
 * back a share rather than a flat figure: both costs fall with the amount, so a
 * fixed GNOT would measure a small balance at a fraction of its ceiling. The
 * wider share is the retry, for an extreme amount that crosses enough ticks to
 * lock a deposit the first hold-back cannot cover.
 *
 * A balance at or under the fee has no ceiling to measure near — holding back a
 * tenth still leaves nothing to pay with — so it is measured at a hundredth of
 * itself, leaving almost all of it free for the costs in question. Gas barely
 * moves across small amounts, so the reading still stands for the whole balance.
 *
 * The fee on each step only has to be payable for the measurement to run, since
 * gas used does not depend on it. It is the fee the transaction would really
 * carry where the hold-back covers it, and the whole hold-back otherwise.
 */
export function planProbes(
  balance: BigNumber.Value,
  offeredGasFee: string,
  gasWanted: number,
  gasPrice: number,
): ProbeStep[] {
  const available = BigNumber(balance);
  const realisticGasFee = ceilToUgnot(BigNumber(gasWanted).multipliedBy(gasPrice));

  const amounts = isSubFeeBalance(available, offeredGasFee)
    ? [toUgnot(available.dividedBy(SMALL_BALANCE_PROBE_DIVISOR))]
    : holdBacks(available).map(holdBack => toUgnot(available.minus(holdBack)));

  return amounts
    .filter(amount => BigNumber(amount).isGreaterThan(0))
    .map(amount => ({
      amount,
      gasFee: BigNumber.minimum(available.minus(amount), realisticGasFee).toFixed(0),
    }));
}

function holdBacks(balance: BigNumber): string[] {
  const proportional = ceilToUgnot(balance.multipliedBy(PROBE_HEADROOM_RATIO));
  const capped = BigNumber.minimum(PROBE_HEADROOM_CAP, proportional).toFixed(0);

  return capped === proportional ? [capped] : [capped, proportional];
}

/**
 * Step 3a. The least the fee may be reserved at.
 *
 * The flat fee a send path offers, so that a wallet taking it at face value is
 * covered — except on a balance that could never pay it, where holding that
 * much back would only ever leave nothing to spend.
 */
export function gasFeeFloor(balance: BigNumber.Value, offeredGasFee: string): string {
  return isSubFeeBalance(balance, offeredGasFee) ? "0" : offeredGasFee;
}

/**
 * Step 3b. The reserve implied by one measurement.
 *
 * Both costs are padded over what was measured, since both grow with the amount
 * between the measurement and the answer.
 */
export function priceReserve(
  { gasUsed, storageDeposit }: SimulateTxResult,
  gasPrice: number,
  feeFloor: string,
): NativeAmountReserve {
  const priced = ceilToUgnot(BigNumber(gasUsed).multipliedBy(GAS_FEE_RESERVE_MARGIN).multipliedBy(gasPrice));

  const gasFee = BigNumber.maximum(feeFloor, priced).toFixed(0);
  const deposit = ceilToUgnot(BigNumber(storageDeposit).multipliedBy(STORAGE_DEPOSIT_BUFFER_MULTIPLIER));
  const buffer = `${NATIVE_AMOUNT_RESERVE_BUFFER}`;

  return {
    gasFee,
    storageDeposit: deposit,
    buffer,
    total: BigNumber(gasFee).plus(deposit).plus(buffer).toFixed(0),
  };
}

/** What is left to spend once a reserve is held back. */
export function spendableUnder(balance: BigNumber.Value, reserve: NativeAmountReserve): string {
  return toUgnot(BigNumber(balance).minus(reserve.total));
}

/**
 * Step 4. Where to retreat to when an amount turns out not to be affordable.
 *
 * Halfway back to the last amount that worked, rather than a share off the top:
 * on a large balance a relative step throws away thousands of GNOT to grope for
 * costs of a few.
 */
export function bisectToward(known: BigNumber.Value, failed: BigNumber.Value): string {
  return toUgnot(BigNumber(known).plus(failed).dividedBy(2));
}

/**
 * Step 5. The answer honours both bounds: the largest amount a simulation
 * accepted, and the largest the priced reserve leaves room for. For a light
 * action the reserve can land above what the measurement held back, and the
 * amount has to come down to it.
 */
export function cappedSpendable(
  balance: BigNumber.Value,
  measuredAmount: BigNumber.Value,
  reserve: NativeAmountReserve,
): string {
  return BigNumber.minimum(measuredAmount, spendableUnder(balance, reserve)).toFixed(0);
}

/**
 * Step 6. The breakdown of what is really held back.
 *
 * The search can stop above the priced reserve, when a cost it could not see
 * keeps the amount down. The remainder is reported as buffer rather than left
 * unaccounted for.
 */
export function describeWithheld(
  balance: BigNumber.Value,
  amount: BigNumber.Value,
  reserve: NativeAmountReserve,
): NativeAmountReserve {
  const withheld = BigNumber(balance).minus(amount);
  const measured = BigNumber(reserve.gasFee).plus(reserve.storageDeposit);

  return {
    ...reserve,
    buffer: BigNumber.maximum(withheld.minus(measured), 0).toFixed(0),
    total: withheld.toFixed(0),
  };
}

/** The answer when nothing could be measured: only the certain cost is held back. */
export function fallbackMaxNativeAmount(balance: BigNumber.Value, reserve: BigNumber.Value): MaxNativeAmount {
  const total = ceilToUgnot(reserve);

  return {
    amount: toUgnot(BigNumber.maximum(BigNumber(balance).minus(total), 0)),
    reserve: { gasFee: total, storageDeposit: "0", buffer: "0", total },
    simulated: false,
  };
}
