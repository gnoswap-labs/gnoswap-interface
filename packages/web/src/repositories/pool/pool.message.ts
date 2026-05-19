import BigNumber from "bignumber.js";

import {
  makeDepositGNOTMessage,
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
  TransactionMessage,
} from "@common/clients/wallet-client/transaction-messages";
import { DEFAULT_TRANSACTION_DEADLINE } from "@common/values";
import {
  GNS_TOKEN_PATH,
  PACKAGE_POOL_ADDRESS,
  PACKAGE_POOL_PATH,
  PACKAGE_POSITION_PATH,
  PACKAGE_STAKER_ADDRESS,
  PACKAGE_STAKER_PATH,
  WRAPPED_GNOT_PATH,
} from "@constants/environment.constant";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { checkGnotPath, isGNOTPath, wrapNativeTokenPath } from "@utils/common";
import { tickToSqrtPriceX96 } from "@utils/math.utils";
import { isOrderedTokenPaths } from "@utils/pool-utils";
import { sortTokenPaths } from "@utils/sort-utils";
import { priceToTick } from "@utils/swap-utils";
import { isNativeTokenPath, makeRawTokenAmount } from "@utils/token-utils";

enum PoolTransactionMessageFunctionType {
  CreatePool = "CreatePool",
  Mint = "Mint",
  CreateExternalIncentive = "CreateExternalIncentive",
  EndExternalIncentive = "EndExternalIncentive",
  CollectExternalIncentivePenalty = "CollectExternalIncentivePenalty",
}

export function makeCreatePoolMessageWithApproves(
  {
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
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
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

  const [orderedPoolAPath, orderedPoolBPath] = [tokenAPath, tokenBPath].sort(sortTokenPaths);
  const orderedStartPriceNum = isOrdered || startPriceNum === 0 ? startPriceNum : 1 / startPriceNum;
  const startPriceSqrt = tickToSqrtPriceX96(priceToTick(orderedStartPriceNum));

  const createPoolMessage = makeTransactionMessage({
    caller,
    send: "",
    packagePath: PACKAGE_POOL_PATH,
    func: PoolTransactionMessageFunctionType.CreatePool,
    args: [orderedPoolAPath, orderedPoolBPath, fee, startPriceSqrt.toString()],
  });

  return makeTransactionMessagesWithApproves([createPoolMessage], approveMessageInfos, fetchAllowance);
}

export function makePositionMintMessageWithApproves(
  {
    tokenA,
    tokenB,
    feeTier,
    tokenAAmount,
    tokenBAmount,
    minTick,
    maxTick,
    slippage,
    caller,
    referrerAddress,
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
    referrerAddress: string | null;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
  const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";

  const tokenAWrappedPath = tokenA.wrappedPath || wrapNativeTokenPath(tokenA.path);
  const tokenBWrappedPath = tokenB.wrappedPath || wrapNativeTokenPath(tokenB.path);

  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  // When native GNOT is included, wrap it first via Deposit.
  const sendAmount: string | null = isNativeTokenPath(tokenA.path)
    ? tokenAAmountRaw
    : isNativeTokenPath(tokenB.path)
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

  const messages: TransactionMessage[] = [];

  if (sendAmount && BigNumber(sendAmount).isGreaterThan(0)) {
    const depositMessage = makeDepositGNOTMessage(sendAmount, caller);
    if (depositMessage) {
      messages.push(depositMessage);
    }
  }

  const mintMessage = makePositionMintMessage(
    tokenAWrappedPath,
    tokenBWrappedPath,
    feeTier,
    minTick,
    maxTick,
    tokenAAmountRaw,
    tokenBAmountRaw,
    slippage,
    caller,
    referrerAddress,
  );
  messages.push(mintMessage);

  return makeTransactionMessagesWithApproves(messages, approveMessageInfos, fetchAllowance);
}

export function makeCreateExternalIncentiveMessageWithApproves(
  {
    poolPath,
    rewardToken,
    rewardAmount,
    incentiveCreationDepositGnsAmount,
    startTime,
    endTime,
    caller,
  }: {
    poolPath: string;
    rewardToken: TokenModel;
    rewardAmount: string;
    incentiveCreationDepositGnsAmount: string;
    startTime: number;
    endTime: number;
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const rewardTokenPath = checkGnotPath(rewardToken.path);
  const rewardAmountRaw = makeRawTokenAmount(rewardToken, rewardAmount) || "0";
  const isGNOT = isGNOTPath(rewardTokenPath);

  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  const isIncentivizeGNSToken = rewardTokenPath === GNS_TOKEN_PATH;
  if (isIncentivizeGNSToken) {
    approveMessageInfos.push({
      tokenPath: GNS_TOKEN_PATH,
      targetAddress: PACKAGE_STAKER_ADDRESS,
      amount: incentiveCreationDepositGnsAmount,
      caller,
    });
    approveMessageInfos.push({
      tokenPath: GNS_TOKEN_PATH,
      targetAddress: PACKAGE_STAKER_ADDRESS,
      amount: rewardAmountRaw,
      caller,
    });
  } else {
    approveMessageInfos.push({
      tokenPath: GNS_TOKEN_PATH,
      targetAddress: PACKAGE_STAKER_ADDRESS,
      amount: incentiveCreationDepositGnsAmount,
      caller,
    });
    approveMessageInfos.push({
      tokenPath: rewardTokenPath,
      targetAddress: PACKAGE_STAKER_ADDRESS,
      amount: rewardAmountRaw,
      caller,
    });
  }

  const messages: TransactionMessage[] = [];
  if (isGNOT && BigNumber(rewardAmountRaw).isGreaterThan(0)) {
    const depositMessage = makeDepositGNOTMessage(rewardAmountRaw, caller);
    if (depositMessage) {
      messages.push(depositMessage);
    }
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
  messages.push(createIncentiveMessage);

  return makeTransactionMessagesWithApproves(messages, approveMessageInfos, fetchAllowance);
}

export function makeRemoveExternalIncentiveMessageWithApproves(
  {
    poolPath,
    incentiveID,
    caller,
  }: {
    poolPath: string;
    incentiveID: string;
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  const removeExternalIncentiveMessage = makeRemoveIncentiveMessage(poolPath, incentiveID, caller);
  const collectExternalIncentivePenaltyMessage = makeCollectExternalIncentivePenaltyMessage(
    poolPath,
    incentiveID,
    caller,
  );

  return makeTransactionMessagesWithApproves(
    [removeExternalIncentiveMessage, collectExternalIncentivePenaltyMessage],
    approveMessageInfos,
    fetchAllowance,
  );
}

export function makeCollectExternalIncentivePenaltyMessageWithApproves(
  {
    poolPath,
    incentiveID,
    caller,
  }: {
    poolPath: string;
    incentiveID: string;
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const approveMessageInfos: TokenApproveMessageInfo[] = [];

  const collectExternalIncentivePenaltyMessage = makeCollectExternalIncentivePenaltyMessage(
    poolPath,
    incentiveID,
    caller,
  );

  return makeTransactionMessagesWithApproves(
    [collectExternalIncentivePenaltyMessage],
    approveMessageInfos,
    fetchAllowance,
  );
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
  const unwrappedRewardTokenPath = isGNOT ? WRAPPED_GNOT_PATH : rewardTokenPath;

  return makeTransactionMessage({
    send: "",
    func: PoolTransactionMessageFunctionType.CreateExternalIncentive,
    packagePath: PACKAGE_STAKER_PATH,
    args: [poolPath, unwrappedRewardTokenPath, rewardAmount, `${startTime}`, `${endTime}`],
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
  referrerAddress: string | null,
) {
  const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
  const slippageRatio = (100 - slippage) / 100;
  const deadline = DEFAULT_TRANSACTION_DEADLINE;
  return makeTransactionMessage({
    caller,
    send: "",
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
      referrerAddress || "", // Referral address
    ],
  });
}

function makeRemoveIncentiveMessage(poolPath: string, incentiveID: string, caller: string) {
  return makeTransactionMessage({
    send: "",
    func: PoolTransactionMessageFunctionType.EndExternalIncentive,
    packagePath: PACKAGE_STAKER_PATH,
    args: [poolPath, incentiveID, caller],
    caller,
  });
}

function makeCollectExternalIncentivePenaltyMessage(poolPath: string, incentiveID: string, caller: string) {
  return makeTransactionMessage({
    send: "",
    func: PoolTransactionMessageFunctionType.CollectExternalIncentivePenalty,
    packagePath: PACKAGE_STAKER_PATH,
    args: [poolPath, incentiveID, caller],
    caller,
  });
}
