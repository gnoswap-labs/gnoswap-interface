import BigNumber from "bignumber.js";

export function evaluateExpressionToNumber(evaluateExpression: string) {
  try {
    const regexp = /(.*?)/;
    const result = Array.from(
      evaluateExpression.matchAll(regexp),
      match => `${match[0]}`,
    );
    if (result.length > 0) {
      return BigNumber(result[0]).toNumber();
    }
  } catch {
    console.log("Parse Error: " + evaluateExpression);
  }
  return 0;
}
