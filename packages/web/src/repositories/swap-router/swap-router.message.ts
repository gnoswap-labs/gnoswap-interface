import {
  makeDepositGNOTMessage,
  makeGNOTSendAmount,
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
  TransactionMessage,
} from "@common/clients/wallet-client/transaction-messages";
import {
  getSwapExtensionByOriginPath,
  getSwapExtensionByWrappedPath,
  resolveSwapExtensionExecution,
} from "@resources/swap-extension";
import {
  PACKAGE_ROUTER_ADDRESS,
  PACKAGE_ROUTER_PATH,
  WRAPPED_GNOT_PACKAGE_PATH,
} from "@constants/environment.constant";
import { EstimatedRoute } from "@models/swap/swap-route-info";
import { TokenModel } from "@models/token/token-model";
import { getSwapTokenPath, makeRoutesQuery } from "@utils/swap-route-utils";
import { isNativeTokenPath, makeRawTokenAmount } from "@utils/token-utils";

enum TransactionMessageFunctionType {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
  ExactIn = "ExactInSwapRoute",
  ExactOut = "ExactOutSwapRoute",
}

export interface ExactSwapRouteMessageRequest {
  inputToken: TokenModel;
  outputToken: TokenModel;
  tokenAmount: string;
  estimatedRoutes: EstimatedRoute[];
  tokenAmountLimit: string;
  deadline: number;
  caller: string;
  referrerAddress: string | null;
}

export async function makeExactInSwapRouteMessageWithApproves(
  {
    inputToken,
    outputToken,
    tokenAmount,
    estimatedRoutes,
    tokenAmountLimit,
    deadline,
    caller,
    referrerAddress,
  }: ExactSwapRouteMessageRequest,
  fetchAllowance?: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const targetToken = inputToken;
  const resultToken = outputToken;
  const tokenAmountRaw = makeRawTokenAmount(targetToken, tokenAmount) || "0";
  const tokenAmountLimitRaw = makeRawTokenAmount(resultToken, tokenAmountLimit) || "0";
  const inputTokenWrappedPath = getSwapTokenPath(inputToken);
  const outputTokenWrappedPath = getSwapTokenPath(outputToken);
  const routesQuery = makeRoutesQuery(estimatedRoutes, inputTokenWrappedPath);
  const quotes = estimatedRoutes.map(route => route.quote).join(",");

  const messages: TransactionMessage[] = [];
  if (isNativeTokenPath(inputToken.path)) {
    const depositMessage = makeDepositGNOTMessage(tokenAmountRaw, caller);
    if (depositMessage) {
      messages.push(depositMessage);
    }
  }

  const swapMessage = makeTransactionMessage({
    send: "",
    packagePath: PACKAGE_ROUTER_PATH,
    func: TransactionMessageFunctionType.ExactIn,
    args: [
      inputTokenWrappedPath,
      outputTokenWrappedPath,
      `${tokenAmountRaw || 0}`,
      `${routesQuery}`,
      `${quotes}`,
      tokenAmountLimitRaw,
      `${deadline}`,
      referrerAddress || "", // Referral address
    ],
    caller,
  });
  messages.push(swapMessage);

  const approveInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: inputTokenWrappedPath,
      pkgPath: inputToken.pkgPath,
      routes: inputToken.routes,
      targetAddress: PACKAGE_ROUTER_ADDRESS,
      amount: tokenAmountRaw,
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves(messages, approveInfos, fetchAllowance);
}

export async function makeExactOutSwapRouteMessageWithApproves(
  {
    inputToken,
    outputToken,
    tokenAmount,
    estimatedRoutes,
    tokenAmountLimit,
    deadline,
    caller,
    referrerAddress,
  }: ExactSwapRouteMessageRequest,
  fetchAllowance?: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const targetToken = outputToken;
  const resultToken = inputToken;
  const tokenAmountRaw = makeRawTokenAmount(targetToken, tokenAmount) || "0";
  const tokenAmountLimitRaw = makeRawTokenAmount(resultToken, tokenAmountLimit) || "0";
  const inputTokenWrappedPath = getSwapTokenPath(inputToken);
  const outputTokenWrappedPath = getSwapTokenPath(outputToken);
  const routesQuery = makeRoutesQuery(estimatedRoutes, inputTokenWrappedPath);
  const quotes = estimatedRoutes.map(route => route.quote).join(",");

  const messages: TransactionMessage[] = [];
  if (isNativeTokenPath(inputToken.path)) {
    const depositMessage = makeDepositGNOTMessage(tokenAmountLimitRaw, caller);
    if (depositMessage) {
      messages.push(depositMessage);
    }
  }

  const swapMessage = makeTransactionMessage({
    send: "",
    packagePath: PACKAGE_ROUTER_PATH,
    func: TransactionMessageFunctionType.ExactOut,
    args: [
      inputTokenWrappedPath,
      outputTokenWrappedPath,
      `${tokenAmountRaw || 0}`,
      `${routesQuery}`,
      `${quotes}`,
      tokenAmountLimitRaw,
      `${deadline}`,
      referrerAddress || "", // Referral address
    ],
    caller,
  });
  messages.push(swapMessage);

  const approveInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: inputTokenWrappedPath,
      pkgPath: inputToken.pkgPath,
      routes: inputToken.routes,
      targetAddress: PACKAGE_ROUTER_ADDRESS,
      amount: tokenAmountLimitRaw,
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves(messages, approveInfos, fetchAllowance);
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
  const extension = getSwapExtensionByOriginPath(token.path);
  if (extension) {
    return resolveSwapExtensionExecution(extension, "wrap", { amount: tokenAmountRaw }).map(step =>
      makeTransactionMessage({
        packagePath: step.packagePath,
        send: "",
        func: step.function,
        args: step.inputs,
        caller,
      }),
    );
  }

  const wrapTokenTransactionMessage = makeTransactionMessage({
    packagePath: WRAPPED_GNOT_PACKAGE_PATH,
    send: makeGNOTSendAmount(tokenAmountRaw),
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
  const tokenAmountRaw = makeRawTokenAmount(token, tokenAmount) || "0";
  const extension = getSwapExtensionByWrappedPath(token.path);
  if (extension) {
    return resolveSwapExtensionExecution(extension, "unwrap", { amount: tokenAmountRaw }).map(step =>
      makeTransactionMessage({
        packagePath: step.packagePath,
        send: "",
        func: step.function,
        args: step.inputs,
        caller,
      }),
    );
  }

  const wrapTokenTransactionMessage = makeTransactionMessage({
    packagePath: WRAPPED_GNOT_PACKAGE_PATH,
    send: "",
    func: TransactionMessageFunctionType.Withdraw,
    args: [tokenAmountRaw],
    caller,
  });

  return [wrapTokenTransactionMessage];
}
