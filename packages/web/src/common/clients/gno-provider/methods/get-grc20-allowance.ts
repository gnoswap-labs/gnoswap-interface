import { GnoProvider } from "@gnolang/gno-js-client";
import { PACKAGE_COMMON_PATH } from "@constants/environment.constant";
import { evaluateExpressionToNumber } from "@utils/rpc-utils";

export async function getGRC20Allowance(
  gnoProvider: GnoProvider,
  tokenKey: string,
  owner: string,
  spender: string,
): Promise<number> {
  const expression = `Allowance(${JSON.stringify(tokenKey)}, ${JSON.stringify(owner)}, ${JSON.stringify(spender)})`;
  try {
    const abciResponse = await gnoProvider.evaluateExpression(PACKAGE_COMMON_PATH, expression);
    return evaluateExpressionToNumber(abciResponse);
  } catch (e) {
    console.log(e);
  }
  return 0;
}
