import BigNumber from "bignumber.js";
import JSBI from "jsbi";
import { Currency, CurrencyAmount as CurrencyAmountRaw } from "../core";
import { BigNumberish } from "../core/entities/fractions/currencyAmount";
import { FeeAmount } from "../v3-sdk";

export class CurrencyAmount extends CurrencyAmountRaw<Currency> {}

export const MAX_UINT160 = "0xffffffffffffffffffffffffffffffffffffffff";

export function parseFeeAmount(feeAmountStr: string) {
  switch (feeAmountStr) {
    case "10000":
      return FeeAmount.HIGH;
    case "3000":
      return FeeAmount.MEDIUM;
    case "500":
      return FeeAmount.LOW;
    case "100":
      return FeeAmount.LOWEST;
    default:
      throw new Error(`Fee amount ${feeAmountStr} not supported.`);
  }
}

export function unparseFeeAmount(feeAmount: FeeAmount) {
  switch (feeAmount) {
    case FeeAmount.HIGH:
      return "10000";
    case FeeAmount.MEDIUM:
      return "3000";
    case FeeAmount.LOW:
      return "500";
    case FeeAmount.LOWEST:
      return "100";
    default:
      throw new Error(`Fee amount ${feeAmount} not supported.`);
  }
}

// Try to parse a user entered amount for a given token
export function parseAmount(value: string, currency: Currency): CurrencyAmount {
  const typedValueParsed = parseUnits(value, currency.decimals).toString();
  return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed));
}

export function parseUnits(value: string, unitName?: BigNumberish): BigNumber {
  if (typeof value !== "string") {
    throw Error("value must be a string");
  }
  return BigNumber(value).shiftedBy(
    unitName != null ? Number(unitName.toString()) : 6,
  );
}
