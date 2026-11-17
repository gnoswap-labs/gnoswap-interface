import BigNumber from "bignumber.js";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import { DEFAULT_GAS_FEE } from "@common/values";
import { GasToken } from "@common/values/token-constant";
import { useOptionalGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import type { MaxNativeAmount } from "@services/transaction-gas";
import * as WalletState from "@states/wallet";
import { makeDisplayTokenAmountString, makeRawTokenAmount } from "@utils/token-utils";

/**
 * The flat fee every send path offers, in ugnot. It is deducted in full, so it
 * is the one cost that can be reserved without measuring anything.
 */
const OFFERED_GAS_FEE = makeRawTokenAmount(GasToken, DEFAULT_GAS_FEE) ?? "0";

/**
 * What the pending result belongs to. An estimate takes route lookups and
 * simulations to come back, and by then the request it answers may no longer
 * be the one on screen — an answer priced for one transaction must not be
 * written into another.
 */
export interface MaxNativeAmountSubject {
  token: TokenModel | null;
  /** The amount currently in the field the result would be written to. */
  amount?: string;
  /**
   * Anything else the messages were built for and that can change the estimate,
   * including the other side of a swap, transaction terms, or wallet balance.
   * It does not show up in the field, but it decides what the transaction costs.
   */
  dependsOn?: readonly unknown[];
}

const sameDependencies = (a: readonly unknown[] = [], b: readonly unknown[] = []) =>
  a.length === b.length && a.every((value, index) => Object.is(value, b[index]));

/** Everything an answer is priced for: the field it belongs to and who signs. */
interface AskedFor {
  subject: MaxNativeAmountSubject;
  signer: string | null;
}

const sameEstimateContext = (a: AskedFor, b: AskedFor) =>
  a.signer === b.signer &&
  a.subject.token?.path === b.subject.token?.path &&
  sameDependencies(a.subject.dependsOn, b.subject.dependsOn);

const sameAskedFor = (a: AskedFor, b: AskedFor) =>
  sameEstimateContext(a, b) && a.subject.amount === b.subject.amount;

const sameFailedSubject = (failure: AskedFor, current: AskedFor) =>
  sameEstimateContext(failure, current) &&
  (failure.subject.amount === current.subject.amount || current.subject.amount === "0");

export interface MaxNativeAmountParams {
  /** Wallet balance as shown in the UI, so with a decimal point and optional grouping. */
  balance: string;
  /**
   * Builds the messages the action would broadcast for a candidate raw amount.
   * Without it only the gas fee is reserved, since there is nothing to simulate
   * the storage deposit against.
   */
  makeMessages?: (amount: string) => TransactionMessage[] | Promise<TransactionMessage[]>;
}

/**
 * Resolves the amount a MAX button should fill in for a GNOT input.
 *
 * GNOT pays for its own transaction, so the full balance is never spendable:
 * the gas fee is consumed and the storage deposit is locked. Both are read off
 * a simulation of the action itself, since an action doing more work for a
 * larger amount also costs more.
 *
 * When that simulation cannot be run — the node does not answer, the messages
 * cannot be built, there is no service to ask — no amount is known to be
 * spendable, and one that only holds back the fee could leave the action short
 * of its own deposit. `getMaxAmount` then resolves to `"0"` and `failed` becomes
 * true. The failure remains visible when a caller applies that zero to the
 * field; it clears when the estimate context changes or `resetError` is called.
 * A zero the estimate does arrive at is an answer rather than a failure: the
 * balance cannot cover the action.
 *
 * `getMaxAmount` resolves to `null` when the answer no longer belongs to the
 * field that asked: the token changed, the user typed, a later press
 * superseded it, or the field is gone. Callers write the result back only when
 * it is not `null`, and an obsolete failure is not exposed.
 *
 * Call `resetError` before manual edits; it also invalidates any in-flight
 * estimate so an answer for the unchanged field cannot overwrite the edit.
 *
 * While an estimate is out, `pendingBalance` holds the whole balance for the
 * field to show as a placeholder — the answer is the balance less a reserve, so
 * this is what the user is about to get, rounded down by however much it costs.
 * It is worked out as the field renders rather than cleared when the request
 * settles, so a subject that moves on is not left waiting on an answer that
 * will be thrown away when it arrives.
 */
export const useMaxNativeAmount = (subject: MaxNativeAmountSubject) => {
  const transactionGasService = useOptionalGnoswapContext()?.transactionGasService ?? null;
  const [pending, setPending] = useState<{ balance: string; askedFor: AskedFor } | null>(null);
  const [failure, setFailure] = useState<AskedFor | null>(null);

  // Every action is built for, and simulated as, the connected account. Tracked
  // here rather than left to each caller, since none of them can afford to
  // forget it and the answer is meaningless for a different signer.
  const signer = useAtomValue(WalletState.account)?.address ?? null;

  const askingFor: AskedFor = { subject, signer };
  const current = useRef(askingFor);
  current.current = askingFor;
  const pressCount = useRef(0);
  const resetError = useCallback(() => {
    pressCount.current += 1;
    setPending(null);
    setFailure(null);
  }, []);

  // A field that is gone has nothing to write an answer into, and a failure
  // reported after it would be about a form the user has already left.
  useEffect(
    () => () => {
      pressCount.current += 1;
    },
    [],
  );

  // Clear stale failure during this render so a context that later returns to
  // the failed subject cannot make an obsolete error reappear.
  if (failure && !sameFailedSubject(failure, askingFor)) setFailure(null);
  const failed = failure !== null && sameFailedSubject(failure, askingFor);

  // Only stands in for the request still on screen. A field that has moved on
  // gets its placeholder and its button back at once, without waiting out an
  // estimate whose answer no longer applies to it.
  const pendingBalance = pending && sameAskedFor(pending.askedFor, askingFor) ? pending.balance : null;

  const getMaxAmount = useCallback(
    async ({ balance, makeMessages }: MaxNativeAmountParams): Promise<string | null> => {
      const press = (pressCount.current += 1);
      const asked = current.current;
      setFailure(null);
      setPending(null);
      const { token } = asked.subject;

      const isLatest = () => press === pressCount.current;
      const stillWanted = () => isLatest() && sameAskedFor(asked, current.current);

      const displayBalance = BigNumber(balance.replace(/,/g, ""));
      if (!token || displayBalance.isNaN()) return "0";

      // Only GNOT pays its own fee out of the amount being spent.
      if (!isNativeToken(token)) return displayBalance.toFixed();

      const rawBalance = makeRawTokenAmount(token, displayBalance.toFixed());
      if (!rawBalance) return displayBalance.toFixed();

      // A field that builds no messages has no deposit to measure, so the flat
      // fee is all it holds back.
      if (!makeMessages) {
        const spendable = BigNumber(rawBalance).minus(OFFERED_GAS_FEE);

        return makeDisplayTokenAmountString(token, BigNumber.maximum(spendable, 0).toFixed(0)) ?? "0";
      }

      // One that does has a deposit only a simulation can price. Without the
      // service there is no estimate at all, and the fee alone would leave the
      // deposit unaccounted for.
      let estimate: MaxNativeAmount | null = null;
      if (transactionGasService) {
        setPending({ balance: displayBalance.toFixed(), askedFor: asked });

        try {
          estimate = await transactionGasService.estimateMaxNativeAmount({ balance: rawBalance, makeMessages });
        } catch {
          // Handled below, once it is known the field is still asking.
        } finally {
          // An earlier press finishing must not re-enable the button while a
          // later one is still out.
          if (isLatest()) setPending(null);
        }
      }

      if (!stillWanted()) return null;

      // A positive amount is only safe to spend once a simulation priced what
      // it leaves behind; zero offers nothing, so it stands either way. Without
      // an estimate, return zero and expose failure rather than guess.
      if (!estimate || (!estimate.simulated && BigNumber(estimate.amount).isGreaterThan(0))) {
        setFailure(asked);
        return "0";
      }

      return makeDisplayTokenAmountString(token, estimate.amount) ?? "0";
    },
    [transactionGasService],
  );

  return { getMaxAmount, pendingBalance, loading: pendingBalance !== null, failed, resetError };
};
