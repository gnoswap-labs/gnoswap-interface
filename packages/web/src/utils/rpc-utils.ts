import BigNumber from "bignumber.js";

export function evaluateExpressionToNumber(evaluateExpression: string) {
  try {
    const regexp = /\((.*)\)/;
    const result = evaluateExpression.match(regexp);
    if (result === null || result.length < 1) {
      return 0;
    }

    const parsedValue = result[1].split(" ")[0];
    return BigNumber(parsedValue).toNumber();
  } catch {
    console.log("Parse Error: " + evaluateExpression);
  }
  return 0;
}
