import { Grc20Routes } from "@models/token/token-model";

import { makeTransactionMessage, TransactionBankMessage, TransactionMessage } from "./common";
import { resolveGrc20Route } from "./grc20-route";
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

export function makeTransferGRC20TokenMessage(
  token: { path: string; pkgPath?: string; routes?: Grc20Routes },
  amount: string,
  fromAddress: string,
  toAddress: string,
): TransactionMessage {
  const amountLiteral = gnoInt64Literal(amount);
  const route = resolveGrc20Route(token, "transfer", { $to: toAddress, $amount: amountLiteral });

  if (route) {
    return makeTransactionMessage({
      caller: fromAddress,
      send: "",
      packagePath: route.packagePath,
      func: route.func,
      args: route.args,
    });
  }

  return makeGRC20TransferRunMessage({
    tokenPath: token.path,
    toAddress,
    amount,
    caller: fromAddress,
  });
}
