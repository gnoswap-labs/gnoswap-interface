import BigNumber from "bignumber.js";

export function multipliedToBigint(
  num1: string | bigint | number,
  num2: string | bigint | number,
) {
  const calculated = BigNumber(num1.toString())
    .multipliedBy(num2.toString())
    .toFixed(0);
  return BigInt(calculated);
}
