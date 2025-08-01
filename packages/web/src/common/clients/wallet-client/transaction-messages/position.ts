import BigNumber from "bignumber.js";

import { DEFAULT_TRANSACTION_DEADLINE } from "@common/values";
import { PACKAGE_POSITION_PATH, PACKAGE_STAKER_PATH } from "@constants/environment.constant";
import { MAX_SLIPPAGE, SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";

import { makeGNOTSendAmount, makeTransactionMessage } from "./common";

export function makePositionMintMessage(
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
  referrerAddress: string | null,
) {
  const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
  const slippageRatio = (100 - slippage) / 100;
  const deadline = DEFAULT_TRANSACTION_DEADLINE;
  const send = makeGNOTSendAmount(sendAmount);

  return makeTransactionMessage({
    caller,
    send,
    packagePath: PACKAGE_POSITION_PATH,
    func: "Mint",
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
      referrerAddress || "", // Referral address
    ],
  });
}

export function makePositionMintWithStakeMessage(
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
  referrerAddress: string | null,
) {
  const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
  const slippageRatio = (100 - slippage) / 100;
  const deadline = (Math.floor(Date.now() / 1000) + 60 * 5).toString();
  const send = makeGNOTSendAmount(sendAmount);

  return makeTransactionMessage({
    caller,
    send,
    packagePath: PACKAGE_STAKER_PATH,
    func: "MintAndStake",
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
      referrerAddress || "", // Referral address
    ],
  });
}

export function makePositionIncreaseLiquidityMessage(
  lpTokenId: string,
  amount0Desired: string,
  amount1Desired: string,
  slippage: number,
  caller: string,
  sendAmount: string | null,
  referrerAddress: string | null,
) {
  const slippageRatio = (100 - slippage) / 100;
  const send = makeGNOTSendAmount(sendAmount);

  const deadline = (Math.floor(Date.now() / 1000) + 60 * 5).toString();

  return makeTransactionMessage({
    send,
    func: "IncreaseLiquidity",
    packagePath: PACKAGE_POSITION_PATH,
    args: [
      lpTokenId, // LP Token ID
      amount0Desired, // Maximum amount of tokenA to offer
      amount1Desired, // Maximum amount of tokenB to offer
      BigNumber(amount0Desired).multipliedBy(slippageRatio).toFixed(0), // Minimum amount of tokenA to provide
      BigNumber(amount1Desired).multipliedBy(slippageRatio).toFixed(0), // Minimum amount of tokenB to provide
      deadline, // Deadline UTC time
      referrerAddress || "", // Referral address
    ],
    caller,
  });
}

export function makePositionRepositionLiquidityMessage(
  lpTokenId: string,
  minTick: number,
  maxTick: number,
  amount0Desired: string,
  amount1Desired: string,
  slippage: number,
  caller: string,
  sendAmount: string | null,
  referrerAddress: string | null,
) {
  const send = makeGNOTSendAmount(sendAmount);
  const slippageRatio = (100 - slippage) / 100;

  return makeTransactionMessage({
    send,
    func: "Reposition",
    packagePath: PACKAGE_POSITION_PATH,
    args: [
      lpTokenId, // LP Token ID
      `${minTick}`, // position's minimal tick
      `${maxTick}`, // position's maximal tick
      `${amount0Desired}`, // Maximum amount of tokenA to offer
      `${amount1Desired}`, // Maximum amount of tokenB to offer
      BigNumber(amount0Desired).multipliedBy(slippageRatio).toFixed(0), // Minimum amount of tokenA to provide
      BigNumber(amount1Desired).multipliedBy(slippageRatio).toFixed(0), // Minimum amount of tokenB to provide
      referrerAddress || "", // Referral address
    ],
    caller,
  });
}

export function makePositionDecreaseLiquidityMessage(
  lpTokenId: string,
  liquidityAmount: number,
  amount0Desired: string,
  amount1Desired: string,
  slippage: number,
  isGetWGNOT: boolean,
  caller: string,
  referrerAddress: string | null,
) {
  const slippageRatio = (10_000 - MAX_SLIPPAGE) / 10_000;

  const deadline = (Math.floor(Date.now() / 1000) + 60 * 5).toString();

  return makeTransactionMessage({
    send: "",
    func: "DecreaseLiquidity",
    packagePath: PACKAGE_POSITION_PATH,
    args: [
      lpTokenId, // LP Token ID
      `${liquidityAmount}`, // Liquidity amount to decrease
      BigNumber(amount0Desired).multipliedBy(slippageRatio).toFixed(0), // Minimum quantity of tokenA to decrease liquidity
      BigNumber(amount1Desired).multipliedBy(slippageRatio).toFixed(0), // Minimum quantity of tokenB to decrease liquidity
      deadline, // Deadline UTC time
      `${!isGetWGNOT}`, // whether unwrap token : isGetWGNOT == true => wrap
      referrerAddress || "", // Referral address
    ],
    caller,
  });
}

export function makePositionCollectFeeMessage(lpTokenId: string, isGetWGNOT: boolean, caller: string) {
  return makeTransactionMessage({
    send: "",
    func: "CollectFee",
    packagePath: PACKAGE_POSITION_PATH,
    args: [
      lpTokenId,
      `${!isGetWGNOT}`, // whether unwrap token, true will get GNOT : isGetWGNOT == true => wrap
    ],
    caller,
  });
}
