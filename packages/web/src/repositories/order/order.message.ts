import BigNumber from "bignumber.js";

import {
  makeDepositGNOTMessage,
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
  TransactionMessage,
} from "@common/clients/wallet-client/transaction-messages";
import {
  PACKAGE_DCA_ORDER_ADDRESS,
  PACKAGE_DCA_ORDER_PATH,
  PACKAGE_LIMIT_ORDER_ADDRESS,
  PACKAGE_LIMIT_ORDER_PATH,
} from "@constants/environment.constant";
import { TokenModel } from "@models/token/token-model";
import { getSwapTokenPath } from "@utils/swap-route-utils";
import { isNativeTokenPath } from "@utils/token-utils";

enum OrderMessageFunctionType {
  CreateOrder = "CreateOrder",
  CancelOrder = "CancelOrder",
  Claim = "Claim",
}

type FetchAllowance = (packagePath: string, owner: string, spender: string) => Promise<number>;

export interface CreateDcaOrderMessageRequest {
  inputToken: TokenModel;
  outputToken: TokenModel;
  interval: number;
  slotOffset: number;
  /** Raw integer amount sold per execution. */
  amountPerExecution: string;
  executionCount: number;
  caller: string;
}

export interface CreateLimitOrderMessageRequest {
  tokenIn: TokenModel;
  tokenOut: TokenModel;
  /** Raw integer amount of `tokenIn`. */
  makingAmount: string;
  /** Raw integer amount of `tokenOut`. */
  takingAmount: string;
  slippageBps: number;
  /** Unix seconds. */
  expiresAt: number;
  caller: string;
}

/** The amount escrowed by a DCA order: every execution is funded up front. */
export function getDcaDepositAmount(amountPerExecution: string, executionCount: number): string {
  return BigNumber(amountPerExecution).multipliedBy(executionCount).toFixed(0, BigNumber.ROUND_FLOOR);
}

/**
 * The order realms escrow GRC20 only, so native GNOT is wrapped first in the
 * same transaction and the wrapped token is approved to the order realm.
 */
function makeWrapMessages(token: TokenModel, rawAmount: string, caller: string): TransactionMessage[] {
  if (!isNativeTokenPath(token.path)) {
    return [];
  }

  const depositMessage = makeDepositGNOTMessage(rawAmount, caller);
  return depositMessage ? [depositMessage] : [];
}

export async function makeCreateDcaOrderMessagesWithApproves(
  request: CreateDcaOrderMessageRequest,
  fetchAllowance?: FetchAllowance,
): Promise<TransactionMessage[]> {
  const { inputToken, outputToken, interval, slotOffset, amountPerExecution, executionCount, caller } = request;
  const inputTokenPath = getSwapTokenPath(inputToken);
  const outputTokenPath = getSwapTokenPath(outputToken);
  const depositAmount = getDcaDepositAmount(amountPerExecution, executionCount);

  const messages: TransactionMessage[] = [
    ...makeWrapMessages(inputToken, depositAmount, caller),
    makeTransactionMessage({
      packagePath: PACKAGE_DCA_ORDER_PATH,
      send: "",
      func: OrderMessageFunctionType.CreateOrder,
      args: [inputTokenPath, outputTokenPath, `${interval}`, `${slotOffset}`, amountPerExecution, `${executionCount}`],
      caller,
    }),
  ];

  const approveInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: inputTokenPath,
      pkgPath: inputToken.pkgPath,
      routes: inputToken.routes,
      targetAddress: PACKAGE_DCA_ORDER_ADDRESS,
      amount: depositAmount,
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves(messages, approveInfos, fetchAllowance);
}

export function makeCancelDcaOrderMessages({
  orderId,
  caller,
}: {
  orderId: string;
  caller: string;
}): TransactionMessage[] {
  return [
    makeTransactionMessage({
      packagePath: PACKAGE_DCA_ORDER_PATH,
      send: "",
      func: OrderMessageFunctionType.CancelOrder,
      args: [orderId],
      caller,
    }),
  ];
}

/**
 * Pays a DCA order's accrued output to its owner. Once every round executed,
 * the realm also finalizes the order in the same call.
 */
export function makeClaimDcaOrderMessages({
  orderId,
  caller,
}: {
  orderId: string;
  caller: string;
}): TransactionMessage[] {
  return [
    makeTransactionMessage({
      packagePath: PACKAGE_DCA_ORDER_PATH,
      send: "",
      func: OrderMessageFunctionType.Claim,
      args: [orderId],
      caller,
    }),
  ];
}

export async function makeCreateLimitOrderMessagesWithApproves(
  request: CreateLimitOrderMessageRequest,
  fetchAllowance?: FetchAllowance,
): Promise<TransactionMessage[]> {
  const { tokenIn, tokenOut, makingAmount, takingAmount, slippageBps, expiresAt, caller } = request;
  const tokenInPath = getSwapTokenPath(tokenIn);
  const tokenOutPath = getSwapTokenPath(tokenOut);

  const messages: TransactionMessage[] = [
    ...makeWrapMessages(tokenIn, makingAmount, caller),
    makeTransactionMessage({
      packagePath: PACKAGE_LIMIT_ORDER_PATH,
      send: "",
      func: OrderMessageFunctionType.CreateOrder,
      args: [tokenInPath, tokenOutPath, makingAmount, takingAmount, `${slippageBps}`, `${expiresAt}`],
      caller,
    }),
  ];

  const approveInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: tokenInPath,
      pkgPath: tokenIn.pkgPath,
      routes: tokenIn.routes,
      targetAddress: PACKAGE_LIMIT_ORDER_ADDRESS,
      amount: makingAmount,
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves(messages, approveInfos, fetchAllowance);
}

export function makeCancelLimitOrderMessages({
  orderId,
  caller,
}: {
  orderId: string;
  caller: string;
}): TransactionMessage[] {
  return [
    makeTransactionMessage({
      packagePath: PACKAGE_LIMIT_ORDER_PATH,
      send: "",
      func: OrderMessageFunctionType.CancelOrder,
      args: [orderId],
      caller,
    }),
  ];
}
