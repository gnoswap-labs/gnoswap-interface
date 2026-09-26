import BigNumber from "bignumber.js";
import { useCallback, useState } from "react";

import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import { DEFAULT_GAS_FEE } from "@common/values";
import { GasToken } from "@common/values/token-constant";
import { useOptionalGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { makeDisplayTokenAmountString, makeRawTokenAmount } from "@utils/token-utils";

/**
 * The flat fee every send path offers, in ugnot. It is deducted in full, so it
 * is the one cost that can be reserved without measuring anything.
 */
const OFFERED_GAS_FEE = makeRawTokenAmount(GasToken, DEFAULT_GAS_FEE) ?? "0";

export interface MaxNativeAmountParams {
  token: TokenModel | null;
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
 */
export const useMaxNativeAmount = () => {
  const transactionGasService = useOptionalGnoswapContext()?.transactionGasService ?? null;
  const [loading, setLoading] = useState(false);

  const getMaxAmount = useCallback(
    async ({ token, balance, makeMessages }: MaxNativeAmountParams): Promise<string> => {
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

      setLoading(true);

      try {
        const { amount } = await transactionGasService.estimateMaxNativeAmount({
          balance: rawBalance,
          makeMessages,
        });

        return makeDisplayTokenAmountString(token, amount) ?? "0";
      } finally {
        setLoading(false);
      }
    },
    [transactionGasService],
  );

  return { getMaxAmount, loading };
};
