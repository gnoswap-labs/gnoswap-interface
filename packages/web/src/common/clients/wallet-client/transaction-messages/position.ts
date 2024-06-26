import { makeGNOTSendAmount, makeTransactionMessage } from "./common";
import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { DEFAULT_TRANSACTION_DEADLINE } from "@common/values";
import BigNumber from "bignumber.js";
import {
  PACKAGE_POSITION_PATH,
  PACKAGE_STAKER_PATH,
} from "@constants/environment.constant";

export function makePositionMintMessage(
  tokenAPath: string,
  tokenBPath: string,
  feeTier: SwapFeeTierType,
  minTick: number,
  maxTick: number,
  tokenAAmount: string,
  tokenBAmount: string,
  slippage: string,
  caller: string,
  sendAmount: string | null,
) {
  const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
  const slippageRatio = 0;
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
  slippage: string,
  caller: string,
  sendAmount: string | null,
) {
  const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
  const slippageRatio = 0;
  const deadline = DEFAULT_TRANSACTION_DEADLINE;
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
    ],
  });
}

export function makePositionIncreaseLiquidityMessage(
  lpTokenId: string,
  amount0Desired: string,
  amount1Desired: string,
  amount0Min: string,
  amount1Min: string,
  caller: string,
  sendAmount: string | null,
) {
  const send = makeGNOTSendAmount(sendAmount);

  return makeTransactionMessage({
    send,
    func: "IncreaseLiquidity",
    packagePath: PACKAGE_POSITION_PATH,
    args: [
      lpTokenId, // LP Token ID
      `${amount0Desired}`, // Maximum amount of tokenA to offer
      `${amount1Desired}`, // Maximum amount of tokenB to offer
      `${amount0Min}`, // Minimum amount of tokenA to provide
      `${amount1Min}`, // Minimum amount of tokenB to provide
      "9999999999", // Deadline UTC time
    ],
    caller,
  });
}

export function makePositionDecreaseLiquidityMessage(
  lpTokenId: string,
  liquidityRatio: number,
  existWrappedToken: boolean,
  caller: string,
) {
  return makeTransactionMessage({
    send: "",
    func: "DecreaseLiquidity",
    packagePath: PACKAGE_POSITION_PATH,
    args: [
      lpTokenId, // LP Token ID
      `${liquidityRatio}`, // Percentage of liquidity to reduce (0 ~ 100)
      "0", // Minimum quantity of tokenA to decrease liquidity
      "0", // Minimum quantity of tokenB to decrease liquidity
      "9999999999", // Deadline UTC time
      `${existWrappedToken}`, // Whether to receive wrapped tokens as native tokens
    ],
    caller,
  });
}

export function makePositionCollectFeeMessage(
  lpTokenId: string,
  caller: string,
) {
  return makeTransactionMessage({
    send: "",
    func: "CollectFee",
    packagePath: PACKAGE_POSITION_PATH,
    args: [lpTokenId],
    caller,
  });
}
