import { getGrc20MethodSpec } from "@constants/grc20-method-spec.constant";

import { makeTransactionMessage, TransactionBankMessage, TransactionMessage } from "./common";
import { gnoInt64Literal, makeGRC20TransferRunMessage } from "./run";

export function makeTransferNativeTokenMessage(
  amount: string,
  denom: string,
  fromAddress: string,
  toAddress: string,
): TransactionBankMessage {
  return {
    amount: `${amount}${denom}`,
    from_address: fromAddress,
    to_address: toAddress,
  };
}

/**
 * Builds the transfer message of a GRC20 token.
 *
 * Tokens registered in `resources/grc20-method-specs.json` are transferred with a
 * direct `MsgCall` to their realm; every other token goes through the GRC20
 * registry as a `MsgRun` message.
 */
export function makeTransferGRC20TokenMessage(
  tokenPath: string,
  amount: string,
  fromAddress: string,
  toAddress: string,
): TransactionMessage {
  const grc20MethodSpec = getGrc20MethodSpec(tokenPath);

  if (grc20MethodSpec) {
    return makeTransactionMessage({
      caller: fromAddress,
      send: "",
      packagePath: grc20MethodSpec.packagePath,
      func: grc20MethodSpec.transferMethod,
      args: [toAddress, gnoInt64Literal(amount)],
    });
  }

  return makeGRC20TransferRunMessage({
    tokenPath,
    toAddress,
    amount,
    caller: fromAddress,
  });
}
