import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import {
  makeGNOTSendAmount,
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
} from "@common/clients/wallet-client/transaction-messages";
import { GNOT_TOKEN } from "@common/values/token-constant";
import { PACKAGE_POOL_ADDRESS, PACKAGE_ROUTER_ADDRESS, PACKAGE_ROUTER_PATH } from "@constants/environment.constant";
import { EstimatedRoute } from "@models/swap/swap-route-info";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { checkGnotPath } from "@utils/common";
import { MAX_INT64 } from "@utils/math.utils";
import { makeRoutesQuery } from "@utils/swap-route-utils";
import { makeRawTokenAmount } from "@utils/token-utils";

enum TransactionMessageFunctionType {
  Deposit = "Deposit",
  Unwrap = "Withdraw",
  ExactIn = "ExactInSwapRoute",
  ExactOut = "ExactOutSwapRoute",
}

export function makeExactInSwapRouteMessageWithApproves(
  {
    inputToken,
    outputToken,
    tokenAmount,
    estimatedRoutes,
    tokenAmountLimit,
    deadline,
    caller,
  }: {
    inputToken: TokenModel;
    outputToken: TokenModel;
    tokenAmount: number;
    estimatedRoutes: EstimatedRoute[];
    tokenAmountLimit: number;
    deadline: number;
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const targetToken = inputToken;
  const resultToken = outputToken;
  const tokenAmountRaw = makeRawTokenAmount(targetToken, tokenAmount) || "0";
  const tokenAmountLimitRaw = makeRawTokenAmount(resultToken, tokenAmountLimit) || "0";
  const routesQuery = makeRoutesQuery(estimatedRoutes, checkGnotPath(inputToken.path));
  const quotes = estimatedRoutes.map(route => route.quote).join(",");

  const inputTokenWrappedPath = checkGnotPath(inputToken.path);
  const outputTokenWrappedPath = checkGnotPath(outputToken.path);

  const sendTokenAmount = tokenAmountRaw;
  const send = inputToken.path === GNOT_TOKEN.path ? makeGNOTSendAmount(sendTokenAmount) : "";

  const swapMessage = makeTransactionMessage({
    send,
    packagePath: PACKAGE_ROUTER_PATH,
    func: TransactionMessageFunctionType.ExactIn,
    args: [
      inputToken.path,
      outputToken.path,
      `${tokenAmountRaw || 0}`,
      `${routesQuery}`,
      `${quotes}`,
      tokenAmountLimitRaw,
      `${deadline}`,
      "", // Referral address
    ],
    caller,
  });

  const approveInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: inputTokenWrappedPath,
      targetAddress: PACKAGE_POOL_ADDRESS,
      amount: MAX_INT64,
      caller,
    },
    {
      tokenPath: inputTokenWrappedPath,
      targetAddress: PACKAGE_ROUTER_ADDRESS,
      amount: MAX_INT64,
      caller,
    },
    {
      tokenPath: outputTokenWrappedPath,
      targetAddress: PACKAGE_ROUTER_ADDRESS,
      amount: MAX_INT64,
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves([swapMessage], approveInfos, fetchAllowance);
}

export function makeExactOutSwapRouteMessageWithApproves(
  {
    inputToken,
    outputToken,
    tokenAmount,
    estimatedRoutes,
    tokenAmountLimit,
    deadline,
    caller,
  }: {
    inputToken: TokenModel;
    outputToken: TokenModel;
    tokenAmount: number;
    estimatedRoutes: EstimatedRoute[];
    tokenAmountLimit: number;
    deadline: number;
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const targetToken = outputToken;
  const resultToken = inputToken;
  const tokenAmountRaw = makeRawTokenAmount(targetToken, tokenAmount) || "0";
  const tokenAmountLimitRaw = makeRawTokenAmount(resultToken, tokenAmountLimit) || "0";
  const routesQuery = makeRoutesQuery(estimatedRoutes, checkGnotPath(inputToken.path));
  const quotes = estimatedRoutes.map(route => route.quote).join(",");

  const inputTokenWrappedPath = checkGnotPath(inputToken.path);
  const outputTokenWrappedPath = checkGnotPath(outputToken.path);

  const sendTokenAmount = tokenAmountLimitRaw;
  const send = inputToken.path === GNOT_TOKEN.path ? makeGNOTSendAmount(sendTokenAmount) : "";

  const swapMessage = makeTransactionMessage({
    send,
    packagePath: PACKAGE_ROUTER_PATH,
    func: TransactionMessageFunctionType.ExactOut,
    args: [
      inputToken.path,
      outputToken.path,
      `${tokenAmountRaw || 0}`,
      `${routesQuery}`,
      `${quotes}`,
      tokenAmountLimitRaw,
      `${deadline}`,
      "", // Referral address
    ],
    caller,
  });

  const approveInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: inputTokenWrappedPath,
      targetAddress: PACKAGE_POOL_ADDRESS,
      amount: MAX_INT64,
      caller,
    },
    {
      tokenPath: inputTokenWrappedPath,
      targetAddress: PACKAGE_ROUTER_ADDRESS,
      amount: MAX_INT64,
      caller,
    },
    {
      tokenPath: outputTokenWrappedPath,
      targetAddress: PACKAGE_ROUTER_ADDRESS,
      amount: MAX_INT64,
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves([swapMessage], approveInfos, fetchAllowance);
}

export function makeWrapTokenMessages({
  token,
  tokenAmount,
  caller,
}: {
  token: TokenModel;
  tokenAmount: string;
  caller: string;
}): TransactionMessage[] {
  const tokenAmountRaw = makeRawTokenAmount(token, tokenAmount) || "0";
  const sendAmount = makeGNOTSendAmount(tokenAmountRaw);
  const wrapTokenTransactionMessage = makeTransactionMessage({
    packagePath: token.wrappedPath || "",
    send: sendAmount,
    func: TransactionMessageFunctionType.Deposit,
    args: null,
    caller,
  });

  return [wrapTokenTransactionMessage];
}

export function makeUnwrapTokenMessages({
  token,
  tokenAmount,
  caller,
}: {
  token: TokenModel;
  tokenAmount: string;
  caller: string;
}): TransactionMessage[] {
  const tokenPath = isNativeToken(token) ? token.wrappedPath : token.path;
  const tokenAmountRaw = makeRawTokenAmount(token, tokenAmount) || "0";
  const wrapTokenTransactionMessage = makeTransactionMessage({
    packagePath: tokenPath,
    send: "",
    func: TransactionMessageFunctionType.Unwrap,
    args: [tokenAmountRaw],
    caller,
  });

  return [wrapTokenTransactionMessage];
}
