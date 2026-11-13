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
  WRAPPED_GNOT_PACKAGE_PATH,
} from "@constants/environment.constant";
import { Grc20Routes, TokenModel } from "@models/token/token-model";
import { getSwapTokenPath } from "@utils/swap-route-utils";
import { isNativeTokenPath } from "@utils/token-utils";

enum OrderMessageFunctionType {
  CreateOrder = "CreateOrder",
  CancelOrder = "CancelOrder",
  Claim = "Claim",
}

type FetchAllowance = (packagePath: string, owner: string, spender: string) => Promise<number>;


/**
 * The wugnot realm's own MsgCall approve. A native input is escrowed as wugnot, and
 * approving it by MsgCall rather than the MsgRun fallback keeps the order keyless to
 * simulate: the chain demands a signature to simulate any transaction carrying a
 * MsgRun, so Max and fee estimates of a native order could never be priced.
 */
const WUGNOT_APPROVE_ROUTES: Grc20Routes = {
  funcs: { approve: { name: "Approve", args: ["$spender", "$amount"] } },
};

/** The package and routes that approve what an order escrows of `token`. */
function escrowApproveRoute(token: TokenModel): Pick<TokenApproveMessageInfo, "pkgPath" | "routes"> {
  if (isNativeTokenPath(token.path)) {
    return { pkgPath: WRAPPED_GNOT_PACKAGE_PATH, routes: WUGNOT_APPROVE_ROUTES };
  }
  return { pkgPath: token.pkgPath, routes: token.routes };
}

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
  /** Asset whose Buy/Sell perspective is recorded on-chain. */
  baseToken: TokenModel;
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
 * Throws when the amount is below the wrap minimum: without the Deposit the
 * order would escrow existing wugnot (or fail) instead of the selected GNOT.
 */
function makeWrapMessages(token: TokenModel, rawAmount: string, caller: string): TransactionMessage[] {
  if (!isNativeTokenPath(token.path)) {
    return [];
  }

  const depositMessage = makeDepositGNOTMessage(rawAmount, caller);
  if (!depositMessage) {
    throw new Error(`Native ${token.symbol} order amount ${rawAmount} is below the wrap minimum.`);
  }
  return [depositMessage];
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
      ...escrowApproveRoute(inputToken),
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
  packagePath,
}: {
  orderId: string;
  caller: string;
  /** Realm of the order; an earlier realm deployment's order is cancelled there. */
  packagePath?: string;
}): TransactionMessage[] {
  return [
    makeTransactionMessage({
      packagePath: packagePath || PACKAGE_DCA_ORDER_PATH,
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
  packagePath,
}: {
  orderId: string;
  caller: string;
  /** Realm of the order; an earlier realm deployment's order is claimed there. */
  packagePath?: string;
}): TransactionMessage[] {
  return [
    makeTransactionMessage({
      packagePath: packagePath || PACKAGE_DCA_ORDER_PATH,
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
  const { tokenIn, tokenOut, baseToken, makingAmount, takingAmount, slippageBps, expiresAt, caller } = request;
  const tokenInPath = getSwapTokenPath(tokenIn);
  const tokenOutPath = getSwapTokenPath(tokenOut);

  const messages: TransactionMessage[] = [
    ...makeWrapMessages(tokenIn, makingAmount, caller),
    makeTransactionMessage({
      packagePath: PACKAGE_LIMIT_ORDER_PATH,
      send: "",
      func: OrderMessageFunctionType.CreateOrder,
      args: [
        tokenInPath,
        tokenOutPath,
        makingAmount,
        takingAmount,
        `${slippageBps}`,
        `${expiresAt}`,
        getSwapTokenPath(baseToken),
      ],
      caller,
    }),
  ];

  const approveInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: tokenInPath,
      ...escrowApproveRoute(tokenIn),
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
  packagePath,
}: {
  orderId: string;
  caller: string;
  /** Realm of the order; an earlier realm deployment's order is cancelled there. */
  packagePath?: string;
}): TransactionMessage[] {
  return [
    makeTransactionMessage({
      packagePath: packagePath || PACKAGE_LIMIT_ORDER_PATH,
      send: "",
      func: OrderMessageFunctionType.CancelOrder,
      args: [orderId],
      caller,
    }),
  ];
}
