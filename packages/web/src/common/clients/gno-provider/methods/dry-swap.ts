import { GnoProvider } from "@gnolang/gno-js-client";

import { evaluateExpressionToStrings, makeABCIParams } from "@utils/rpc-utils";
import { DrySwapRequest } from "@repositories/swap-router/request/swap-route-request";
import { makeRawTokenAmount } from "@utils/token-utils";
import { makeRoutesQuery } from "@utils/swap-route-utils";
import { checkGnotPath } from "@utils/common";
import BigNumber from "bignumber.js";

interface DrySwapResponse {
  inputAmount: number;
  outputAmount: number;
  available: boolean;
}

function makeDrySwapResponse(abciResponse: string): DrySwapResponse {
  const drySwapResponse = evaluateExpressionToStrings(abciResponse);

  if (drySwapResponse.length !== 3) {
    console.warn(abciResponse, "DrySwap Error: Invalid DrySwap response format.");
    return { available: false, inputAmount: 0, outputAmount: 0 };
  }

  const [inputAmount, outputAmount, error] = drySwapResponse;

  return {
    inputAmount: BigNumber(inputAmount).toNumber(),
    outputAmount: BigNumber(outputAmount).toNumber(),
    available: error === "undefined",
  };
}

export async function drySwap(gnoProvider: GnoProvider, packagePath: string, request: DrySwapRequest): Promise<number> {
  const { inputToken, outputToken, tokenAmount, exactType, estimatedRoutes, tokenAmountLimit } = request;

  const targetToken = exactType === "EXACT_IN" ? inputToken : outputToken;
  const resultToken = exactType === "EXACT_IN" ? outputToken : inputToken;
  const tokenAmountRaw = makeRawTokenAmount(targetToken, tokenAmount) || "0";
  const tokenAmountLimitRaw = makeRawTokenAmount(resultToken, tokenAmountLimit) || "0";
  const routesQuery = makeRoutesQuery(estimatedRoutes, checkGnotPath(inputToken.path));
  const quotes = estimatedRoutes.map(route => route.quote).join(",");

  const abciQueryParams = makeABCIParams("DrySwapRoute", [
    inputToken.wrappedPath || inputToken.path,
    outputToken.wrappedPath || outputToken.path,
    tokenAmountRaw,
    exactType,
    routesQuery,
    quotes,
    tokenAmountLimitRaw,
  ]);

  try {
    const abciResponse = await gnoProvider.evaluateExpression(packagePath, abciQueryParams);
    const isExactIn = exactType === "EXACT_IN";
    const response = makeDrySwapResponse(abciResponse);

    // ToDo: Delete this code. This is for debugging.
    console.log(response, "dryswap abci_response for TEST");

    return isExactIn ? response.outputAmount : response.inputAmount;
  } catch (e) {
    console.log(e);
  }
  return -2;
}
