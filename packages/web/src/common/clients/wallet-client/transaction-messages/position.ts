import { isNativeToken, TokenModel } from "@models/token/token-model";
import { makeTransactionMessage, PACKAGE_POSITION_PATH } from "./common";
import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { DEFAULT_TRANSACTION_DEADLINE } from "@common/values";
import BigNumber from "bignumber.js";

export function makePositionMintMessage(
  tokenA: TokenModel,
  tokenB: TokenModel,
  feeTier: SwapFeeTierType,
  minTick: number,
  maxTick: number,
  tokenAAmount: string,
  tokenBAmount: string,
  slippage: string,
  caller: string,
) {
  const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
  const slippageRatio = 0;
  const deadline = DEFAULT_TRANSACTION_DEADLINE;
  let tokenAPath = tokenA.path;
  let tokenBPath = tokenB.path;
  if (isNativeToken(tokenA)) {
    tokenAPath = tokenA.wrappedPath;
  }
  if (isNativeToken(tokenB)) {
    tokenBPath = tokenB.wrappedPath;
  }
  const sendAmount = "";
  return makeTransactionMessage({
    caller,
    send: sendAmount,
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
    ],
  });
}

export function makePositionBurnMessage(lpTokenId: string, caller: string) {
  return makeTransactionMessage({
    send: "",
    func: "Burn",
    packagePath: PACKAGE_POSITION_PATH,
    args: [lpTokenId],
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
