import { getTokenMessageConfig } from "@constants/token-message.constant";

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
 * Tokens registered in `resources/token-messages.json` are transferred with a
 * direct `MsgCall` to their realm; every other token goes through the GRC20
 * registry as a `MsgRun` message.
 */
export function makeTransferGRC20TokenMessage(
  tokenPath: string,
  amount: string,
  fromAddress: string,
  toAddress: string,
): TransactionMessage {
  const tokenMessageConfig = getTokenMessageConfig(tokenPath);

  if (tokenMessageConfig) {
    return makeTransactionMessage({
      caller: fromAddress,
      send: "",
      packagePath: tokenMessageConfig.packagePath,
      func: tokenMessageConfig.transferMethod,
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
