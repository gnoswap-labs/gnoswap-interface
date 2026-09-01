import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import {
  makeTransferGRC20TokenMessage,
  makeTransferNativeTokenMessage,
} from "@common/clients/wallet-client/transaction-messages/token";
import { GNOT_UNIT_DENOM } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";

export function makeTransferGNOTTokenMessages({
  tokenAmount,
  fromAddress,
  toAddress,
}: {
  tokenAmount: string;
  fromAddress: string;
  toAddress: string;
}): TransactionMessage[] {
  const bankSendMessage = makeTransferNativeTokenMessage(tokenAmount, GNOT_UNIT_DENOM, fromAddress, toAddress);

  return [bankSendMessage];
}

export function makeTransferGRC20TokenMessages({
  token,
  tokenAmount,
  fromAddress,
  toAddress,
}: {
  token: TokenModel;
  tokenAmount: string;
  fromAddress: string;
  toAddress: string;
}): TransactionMessage[] {
  const transferGRC20TokenMessage = makeTransferGRC20TokenMessage(token.path, tokenAmount, fromAddress, toAddress);

  return [transferGRC20TokenMessage];
}
