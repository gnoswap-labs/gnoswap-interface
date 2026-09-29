import BigNumber from "bignumber.js";
import { useAtomValue } from "jotai";
import { useCallback, useRef, useState } from "react";

import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import { DEFAULT_GAS_FEE } from "@common/values";
import { GasToken } from "@common/values/token-constant";
import { useOptionalGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { WalletState } from "@states/index";
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
   * Anything else the messages were built for and that the user can change
   * while the estimate is out: the other side of a swap, a price range. It
   * does not show up in the field, but it decides what the transaction costs.
   */
  dependsOn?: readonly unknown[];
}

const sameDependencies = (a: readonly unknown[] = [], b: readonly unknown[] = []) =>
  a.length === b.length && a.every((value, index) => Object.is(value, b[index]));

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
 * `getMaxAmount` resolves to `null` when the answer no longer belongs to the
 * field that asked: the token changed, the user typed, or a later press
 * superseded it. Callers write the result back only when it is not `null`.
 *
 * While an estimate is out, `pendingBalance` holds the whole balance for the
 * field to show as a placeholder — the answer is the balance less a reserve, so
 * this is what the user is about to get, rounded down by however much it costs.
 */
export const useMaxNativeAmount = (subject: MaxNativeAmountSubject) => {
  const transactionGasService = useOptionalGnoswapContext()?.transactionGasService ?? null;
  const [pendingBalance, setPendingBalance] = useState<string | null>(null);

  // Every action is built for, and simulated as, the connected account. Tracked
  // here rather than left to each caller, since none of them can afford to
  // forget it and the answer is meaningless for a different signer.
  const signer = useAtomValue(WalletState.account)?.address ?? null;

  const current = useRef({ subject, signer });
  current.current = { subject, signer };
  const pressCount = useRef(0);

  const getMaxAmount = useCallback(
    async ({ balance, makeMessages }: MaxNativeAmountParams): Promise<string | null> => {
      const press = (pressCount.current += 1);
      const asked = current.current;
      const { token } = asked.subject;

      const isLatest = () => press === pressCount.current;
      const stillWanted = () =>
        isLatest() &&
        current.current.signer === asked.signer &&
        current.current.subject.token?.path === asked.subject.token?.path &&
        current.current.subject.amount === asked.subject.amount &&
        sameDependencies(current.current.subject.dependsOn, asked.subject.dependsOn);

      const displayBalance = BigNumber(balance.replace(/,/g, ""));
      if (!token || displayBalance.isNaN()) return "0";

      // Only GNOT pays its own fee out of the amount being spent.
      if (!isNativeToken(token)) return displayBalance.toFixed();

      const rawBalance = makeRawTokenAmount(token, displayBalance.toFixed());
      if (!rawBalance) return displayBalance.toFixed();

      if (!makeMessages || !transactionGasService) {
        const spendable = BigNumber(rawBalance).minus(OFFERED_GAS_FEE);

        return makeDisplayTokenAmountString(token, BigNumber.maximum(spendable, 0).toFixed(0)) ?? "0";
      }

      setPendingBalance(displayBalance.toFixed());

      try {
        const { amount } = await transactionGasService.estimateMaxNativeAmount({
          balance: rawBalance,
          makeMessages,
        });

        if (!stillWanted()) return null;

        return makeDisplayTokenAmountString(token, amount) ?? "0";
      } finally {
        // An earlier press finishing must not re-enable the button while a
        // later one is still out.
        if (isLatest()) setPendingBalance(null);
      }
    },
    [transactionGasService],
  );

  return { getMaxAmount, pendingBalance, loading: pendingBalance !== null };
};
