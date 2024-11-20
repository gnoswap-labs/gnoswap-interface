import { GnoProvider } from "@gnolang/gno-js-client";
import { evaluateExpressionToNumber, makeABCIParams } from "@utils/rpc-utils";

export async function getGRC20Allowance(
  gnoProvider: GnoProvider,
  packagePath: string,
  owner: string,
  spender: string,
): Promise<number> {
  const abciQueryParams = makeABCIParams("Allowance", [owner, spender]);
  try {
    const abciResponse = await gnoProvider.evaluateExpression(packagePath, abciQueryParams);
    return evaluateExpressionToNumber(abciResponse);
  } catch (e) {
    console.log(e);
  }
  return 0;
}
