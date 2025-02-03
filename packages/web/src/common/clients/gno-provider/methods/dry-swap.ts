import { GnoProvider } from "@gnolang/gno-js-client";

import { evaluateExpressionToNumber, makeABCIParams } from "@utils/rpc-utils";
import { DrySwapRequest } from "@repositories/swap/request/swap-route-request";
import { makeRawTokenAmount } from "@utils/token-utils";
import { makeRoutesQuery } from "@utils/swap-route-utils";
import { checkGnotPath } from "@utils/common";

export async function drySwap(gnoProvider: GnoProvider, packagePath: string, request: DrySwapRequest): Promise<number> {
  const { inputToken, outputToken, tokenAmount, exactType, estimatedRoutes, tokenAmountLimit } = request;

  const targetToken = exactType === "EXACT_IN" ? inputToken : outputToken;
  const resultToken = exactType === "EXACT_IN" ? outputToken : inputToken;
  const tokenAmountRaw = makeRawTokenAmount(targetToken, tokenAmount) || "0";
  const tokenAmountLimitRaw = makeRawTokenAmount(resultToken, tokenAmountLimit) || "0";
  const routesQuery = makeRoutesQuery(estimatedRoutes, checkGnotPath(inputToken.path));
  const quotes = estimatedRoutes.map(route => route.quote).join(",");

  const abciQueryParams = makeABCIParams("DrySwapRoute", [
    inputToken.path,
    outputToken.path,
    tokenAmountRaw,
    exactType,
    routesQuery,
    quotes,
    tokenAmountLimitRaw,
  ]);
  try {
    const abciResponse = await gnoProvider.evaluateExpression(packagePath, abciQueryParams);
    return evaluateExpressionToNumber(abciResponse);
  } catch (e) {
    console.log(e);
  }
  return -1;
}
