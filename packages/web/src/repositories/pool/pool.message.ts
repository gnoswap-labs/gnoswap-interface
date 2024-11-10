import BigNumber from "bignumber.js";

import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import {
  TokenApproveMessageInfo,
  makeGNOTSendAmount,
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
} from "@common/clients/wallet-client/transaction-messages";
import { DEFAULT_TRANSACTION_DEADLINE, GNS_DEPOSIT_AMOUNT } from "@common/values";
import {
  GNS_TOKEN_PATH,
  PACKAGE_POOL_ADDRESS,
  PACKAGE_POOL_PATH,
  PACKAGE_POSITION_ADDRESS,
  PACKAGE_POSITION_PATH,
  PACKAGE_STAKER_ADDRESS,
  PACKAGE_STAKER_PATH,
  WRAPPED_GNOT_PATH,
} from "@constants/environment.constant";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { checkGnotPath, isGNOTPath, toNativePath, wrapNativeTokenPath } from "@utils/common";
import { MAX_INT64, tickToSqrtPriceX96 } from "@utils/math.utils";
import { isOrderedTokenPaths } from "@utils/pool-utils";
import { priceToTick } from "@utils/swap-utils";
import { makeRawTokenAmount } from "@utils/token-utils";

enum PoolTransactionMessageFunctionType {
  CreatePool = "CreatePool",
  Mint = "Mint",
  MintAndStake = "MintAndStake",
  CreateExternalIncentive = "CreateExternalIncentive",
  EndExternalIncentive = "EndExternalIncentive",
}

export function makeCreatePoolMessageWithApproves({
  tokenA,
  tokenB,
  feeTier,
  startPrice,
  createPoolFee,
  caller,
}: {
  tokenA: TokenModel;
  tokenB: TokenModel;
  feeTier: SwapFeeTierType;
  startPrice: string;
  createPoolFee: number;
  caller: string;
}): TransactionMessage[] {
  const tokenAPath = tokenA.wrappedPath || tokenA.path;
  const tokenBPath = tokenB.wrappedPath || tokenB.path;
  const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
  const startPriceNum = BigNumber(startPrice).toNumber();

  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  if (createPoolFee > 0) {
    approveMessageInfos.push({
      tokenPath: GNS_TOKEN_PATH,
      targetAddress: PACKAGE_POOL_ADDRESS,
      amount: createPoolFee,
      caller,
    });
  }

  /**
   * If the token path pairs are out of order, adjust the price and token order.
   */
  const isOrdered = isOrderedTokenPaths(tokenAPath, tokenBPath);

  const [orderedPoolAPath, orderedPoolBPath] = [tokenAPath, tokenBPath].sort();
  const orderedStartPriceNum = isOrdered || startPriceNum === 0 ? startPriceNum : 1 / startPriceNum;
  const startPriceSqrt = tickToSqrtPriceX96(priceToTick(orderedStartPriceNum));

  const createPoolMessage = makeTransactionMessage({
    caller,
    send: "",
    packagePath: PACKAGE_POOL_PATH,
    func: PoolTransactionMessageFunctionType.CreatePool,
    args: [orderedPoolAPath, orderedPoolBPath, fee, startPriceSqrt.toString()],
  });

  return makeTransactionMessagesWithApproves([createPoolMessage], approveMessageInfos);
}

export function makePositionMintMessageWithApproves({
  tokenA,
  tokenB,
  feeTier,
  tokenAAmount,
  tokenBAmount,
  minTick,
  maxTick,
  slippage,
  caller,
  withStaking,
}: {
  tokenA: TokenModel;
  tokenB: TokenModel;
  feeTier: SwapFeeTierType;
  tokenAAmount: string;
  tokenBAmount: string;
  minTick: number;
  maxTick: number;
  slippage: number;
  caller: string;
  withStaking?: boolean;
}): TransactionMessage[] {
  const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
  const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";

  const tokenAPath = tokenA.path;
  const tokenBPath = tokenB.path;

  const tokenAWrappedPath = tokenA.wrappedPath || wrapNativeTokenPath(tokenA.path);
  const tokenBWrappedPath = tokenB.wrappedPath || wrapNativeTokenPath(tokenB.path);

  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  // When GNOT, make a send to the pool contract.
  const wrappedAmount: string | null = isGNOTPath(tokenAWrappedPath)
    ? tokenAAmountRaw
    : isGNOTPath(tokenBWrappedPath)
    ? tokenBAmountRaw
    : null;

  if (BigNumber(tokenAAmount).isGreaterThan(0)) {
    approveMessageInfos.push({
      tokenPath: tokenAWrappedPath,
      targetAddress: PACKAGE_POOL_ADDRESS,
      amount: tokenAAmountRaw,
      caller,
    });
  }

  if (BigNumber(tokenBAmount).isGreaterThan(0)) {
    approveMessageInfos.push({
      tokenPath: tokenBWrappedPath,
      targetAddress: PACKAGE_POOL_ADDRESS,
      amount: tokenBAmountRaw,
      caller,
    });
  }

  if (!!wrappedAmount) {
    approveMessageInfos.push({
      tokenPath: WRAPPED_GNOT_PATH,
      targetAddress: PACKAGE_POSITION_ADDRESS,
      amount: wrappedAmount || 0,
      caller,
    });
  }

  // Make mint transaction message
  const makeMintMessage = withStaking ? makePositionMintWithStakeMessage : makePositionMintMessage;

  const mintMessage = makeMintMessage(
    tokenAPath,
    tokenBPath,
    feeTier,
    minTick,
    maxTick,
    tokenAAmountRaw,
    tokenBAmountRaw,
    slippage,
    caller,
    wrappedAmount,
  );

  return makeTransactionMessagesWithApproves([mintMessage], approveMessageInfos);
}

export function makeCreateExternalIncentiveMessageWithApproves({
  poolPath,
  rewardToken,
  rewardAmount,
  startTime,
  endTime,
  caller,
}: {
  poolPath: string;
  rewardToken: TokenModel;
  rewardAmount: string;
  startTime: number;
  endTime: number;
  caller: string;
}): TransactionMessage[] {
  const rewardTokenPath = checkGnotPath(rewardToken.path);
  const rewardAmountRaw = makeRawTokenAmount(rewardToken, rewardAmount) || "0";
  const isGNOT = isGNOTPath(rewardTokenPath);

  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  const isIncentivizeGNSToken = rewardTokenPath === GNS_TOKEN_PATH;
  if (isIncentivizeGNSToken) {
    const gnsApproveAmount = BigNumber(rewardAmountRaw).plus(GNS_DEPOSIT_AMOUNT).toString();

    approveMessageInfos.push({
      tokenPath: GNS_TOKEN_PATH,
      targetAddress: PACKAGE_STAKER_ADDRESS,
      amount: gnsApproveAmount,
      caller,
    });
  } else {
    approveMessageInfos.push({
      tokenPath: GNS_TOKEN_PATH,
      targetAddress: PACKAGE_STAKER_ADDRESS,
      amount: GNS_DEPOSIT_AMOUNT,
      caller,
    });
    approveMessageInfos.push({
      tokenPath: rewardTokenPath,
      targetAddress: PACKAGE_STAKER_ADDRESS,
      amount: rewardAmountRaw,
      caller,
    });
  }

  const createIncentiveMessage = makeCreateIncentiveMessage(
    poolPath,
    rewardTokenPath,
    rewardAmountRaw,
    startTime,
    endTime,
    caller,
    isGNOT,
  );

  return makeTransactionMessagesWithApproves([createIncentiveMessage], approveMessageInfos);
}

export function makeRemoveExternalIncentiveMessageWithApproves({
  poolPath,
  rewardToken,
  caller,
}: {
  poolPath: string;
  rewardToken: TokenModel;
  caller: string;
}): TransactionMessage[] {
  const tokenPath = wrapNativeTokenPath(rewardToken.path);

  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  if (isGNOTPath(tokenPath)) {
    approveMessageInfos.push({
      tokenPath: tokenPath,
      targetAddress: PACKAGE_STAKER_ADDRESS,
      amount: MAX_INT64,
      caller,
    });
  }

  const removeExternalIncentiveMessage = makeRemoveIncentiveMessage(poolPath, tokenPath, caller);

  return makeTransactionMessagesWithApproves([removeExternalIncentiveMessage], approveMessageInfos);
}

function makeCreateIncentiveMessage(
  poolPath: string,
  rewardTokenPath: string,
  rewardAmount: string,
  startTime: number,
  endTime: number,
  caller: string,
  isGNOT: boolean,
) {
  const send = makeGNOTSendAmount(isGNOT ? rewardAmount : 0);
  const tokenPath = isGNOT ? toNativePath(rewardTokenPath) : rewardTokenPath;

  return makeTransactionMessage({
    send: send,
    func: PoolTransactionMessageFunctionType.CreateExternalIncentive,
    packagePath: PACKAGE_STAKER_PATH,
    args: [poolPath, tokenPath, rewardAmount, `${startTime}`, `${endTime}`],
    caller,
  });
}

function makePositionMintMessage(
  tokenAPath: string,
  tokenBPath: string,
  feeTier: SwapFeeTierType,
  minTick: number,
  maxTick: number,
  tokenAAmount: string,
  tokenBAmount: string,
  slippage: number,
  caller: string,
  sendAmount: string | null,
) {
  const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
  const slippageRatio = (100 - slippage) / 100;
  const deadline = DEFAULT_TRANSACTION_DEADLINE;
  const send = makeGNOTSendAmount(sendAmount);

  return makeTransactionMessage({
    caller,
    send,
    packagePath: PACKAGE_POSITION_PATH,
    func: PoolTransactionMessageFunctionType.Mint,
    args: [
      tokenAPath,
      tokenBPath,
      fee,
      `${minTick}`,
      `${maxTick}`,
      tokenAAmount,
      tokenBAmount,
      BigNumber(tokenAAmount).multipliedBy(slippageRatio).toFixed(0),
      BigNumber(tokenBAmount).multipliedBy(slippageRatio).toFixed(0),
      deadline,
      caller, // LP Token Receiver
      caller, // Replace OriginCaller
    ],
  });
}

function makePositionMintWithStakeMessage(
  tokenAPath: string,
  tokenBPath: string,
  feeTier: SwapFeeTierType,
  minTick: number,
  maxTick: number,
  tokenAAmount: string,
  tokenBAmount: string,
  slippage: number,
  caller: string,
  sendAmount: string | null,
) {
  const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
  const slippageRatio = (100 - slippage) / 100;
  const deadline = DEFAULT_TRANSACTION_DEADLINE;
  const send = makeGNOTSendAmount(sendAmount);

  return makeTransactionMessage({
    caller,
    send,
    packagePath: PACKAGE_STAKER_PATH,
    func: PoolTransactionMessageFunctionType.MintAndStake,
    args: [
      tokenAPath,
      tokenBPath,
      fee,
      `${minTick}`,
      `${maxTick}`,
      tokenAAmount,
      tokenBAmount,
      BigNumber(tokenAAmount).multipliedBy(slippageRatio).toFixed(0),
      BigNumber(tokenBAmount).multipliedBy(slippageRatio).toFixed(0),
      deadline,
    ],
  });
}

function makeRemoveIncentiveMessage(poolPath: string, rewardTokenPath: string, caller: string) {
  return makeTransactionMessage({
    send: "",
    func: PoolTransactionMessageFunctionType.EndExternalIncentive,
    packagePath: PACKAGE_STAKER_PATH,
    args: [caller, poolPath, rewardTokenPath],
    caller,
  });
}
