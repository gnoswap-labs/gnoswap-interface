import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import { roundDownDecimalNumber } from "./regex";

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
  options?: { decimalsWithoutRounding?: number }
) {
  const number = BigNumber(Number(amount));
  if (number.isNaN()) {
    return null;
  }

  if (options?.decimalsWithoutRounding) {
    return Number(number.shiftedBy(-token.decimals).toString().match(roundDownDecimalNumber(options?.decimalsWithoutRounding)));
  }

  return number.shiftedBy(-token.decimals).toNumber();
}
