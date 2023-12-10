import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";

export function makeRawTokenAmount(token: TokenModel, amount: string | number) {
  const number = BigNumber(amount.toString());
  if (number.isNaN()) {
    return null;
  }
  return number.shiftedBy(token.decimals).toFixed(0, BigNumber.ROUND_FLOOR);
}

export function makeDisplayTokenAmount(
  token: TokenModel,
  amount: bigint | string | number,
) {
  const number = BigNumber(amount.toString());
  if (number.isNaN()) {
    return null;
  }
  return number.shiftedBy(-token.decimals).toNumber();
}
