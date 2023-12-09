import { WalletClient } from "@common/clients/wallet-client";
import { SwapRouterRepository } from "./swap-router-repository";
import { makeRoutesQuery } from "@utils/swap-route-utils";
import { GnoProvider } from "@gnolang/gno-js-client";
import { CommonError } from "@common/errors";
import { SwapError } from "@common/errors/swap";
import { evaluateExpressionToNumber, makeABCIParams } from "@utils/rpc-utils";
import { EstimateSwapRouteRequest } from "./request/estimate-swap-route-request";
import { SwapRouteRequest } from "./request/swap-route-request";
import { EstimateSwapRouteResponse } from "./response/estimate-swap-route-response";
import { SwapRouter } from "@gnoswap-labs/swap-router";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import BigNumber from "bignumber.js";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "@utils/token-utils";
import { MAX_UINT64 } from "@utils/math.utils";

const WRAPPED_GNOT_PATH = process.env.NEXT_PUBLIC_WRAPPED_GNOT_PATH || "";
const ROUTER_PACKAGE_PATH = process.env.NEXT_PUBLIC_PACKAGE_ROUTER_PATH;
const POOL_ADDRESS = process.env.NEXT_PUBLIC_PACKAGE_POOL_ADDRESS || "";

export class SwapRouterRepositoryImpl implements SwapRouterRepository {
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;
  private pools: PoolRPCModel[];

  constructor(
    rpcProvider: GnoProvider | null,
    walletClient: WalletClient | null,
  ) {
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
    this.pools = [];
  }

  public updatePools(pools: PoolRPCModel[]) {
    this.pools = pools;
  }

  public estimateSwapRoute = async (
    request: EstimateSwapRouteRequest,
  ): Promise<EstimateSwapRouteResponse> => {
    if (!ROUTER_PACKAGE_PATH || !this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }
    const { inputToken, outputToken, exactType, tokenAmount } = request;

    if (BigNumber(tokenAmount).isNaN()) {
      throw new SwapError("INVALID_PARAMS");
    }

    const inputTokenPath = inputToken.path;
    const outputTokenPath = outputToken.path;
    const swapRouter = new SwapRouter(this.pools);
    const tokenAmountRaw = makeRawTokenAmount(
      exactType === "EXACT_IN" ? inputToken : outputToken,
      tokenAmount,
    );

    const estimatedRoutes = swapRouter.estimateSwapRoute(
      inputTokenPath,
      outputTokenPath,
      BigInt(tokenAmountRaw || 0),
      exactType,
    );

    const routesQuery = makeRoutesQuery(estimatedRoutes, inputToken.path);
    const quotes = estimatedRoutes.map(route => route.quote).join(",");
    const param = makeABCIParams("DrySwapRoute", [
      inputTokenPath,
      outputTokenPath,
      tokenAmountRaw || "0",
      exactType,
      routesQuery,
      quotes,
    ]);

    const result = await this.rpcProvider
      .evaluateExpression(ROUTER_PACKAGE_PATH, param)
      .then(evaluateExpressionToNumber);

    if (result === null) {
      throw new SwapError("NOT_FOUND_SWAP_POOL");
    }
    const resultAmount = makeDisplayTokenAmount(
      exactType === "EXACT_IN" ? outputToken : inputToken,
      result,
    );
    return {
      amount: resultAmount?.toString() || "0",
      estimatedRoutes,
    };
  };

  public swapRoute = async (request: SwapRouteRequest): Promise<string> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !ROUTER_PACKAGE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const {
      inputToken,
      outputToken,
      exactType,
      tokenAmount,
      estimatedRoutes,
      tokenAmountLimit,
    } = request;

    const targetToken = exactType === "EXACT_IN" ? inputToken : outputToken;
    const resultToken = exactType === "EXACT_IN" ? outputToken : inputToken;
    const tokenAmountRaw = makeRawTokenAmount(targetToken, tokenAmount) || "0";
    const tokenAmountLimitRaw =
      makeRawTokenAmount(resultToken, tokenAmountLimit) || "0";
    const routesQuery = makeRoutesQuery(estimatedRoutes, inputToken.path);
    const quotes = estimatedRoutes.map(route => route.quote).join(",");
    let sendAmount = "";
    if (inputToken.type === "native") {
      const sendTokeAnmount =
        exactType === "EXACT_IN" ? tokenAmountRaw : tokenAmountLimitRaw;
      sendAmount = BigNumber(sendTokeAnmount).isGreaterThan(0)
        ? `${sendTokeAnmount}ugnot`
        : "";
    }
    const inputTokenPath =
      inputToken.type === "grc20" ? inputToken.path : WRAPPED_GNOT_PATH;
    const outputTokenPath =
      outputToken.type === "grc20" ? outputToken.path : WRAPPED_GNOT_PATH;
    const response = await this.walletClient.sendTransaction({
      messages: [
        SwapRouterRepositoryImpl.makeApproveTokenMessage(
          inputTokenPath,
          MAX_UINT64.toString(),
          address,
        ),
        SwapRouterRepositoryImpl.makeApproveTokenMessage(
          outputTokenPath,
          MAX_UINT64.toString(),
          address,
        ),
        {
          caller: address,
          send: sendAmount,
          pkg_path: ROUTER_PACKAGE_PATH,
          func: "SwapRoute",
          args: [
            inputToken.path,
            outputToken.path,
            `${tokenAmountRaw || 0}`,
            exactType,
            `${routesQuery}`,
            `${quotes}`,
            `${tokenAmountLimitRaw}`,
          ],
        },
      ],
      gasWanted: 2000000,
      gasFee: 1,
      memo: "",
    });
    if (response.code !== 0) {
      throw new SwapError("SWAP_FAILED");
    }
    return response.type;
  };

  private static makeApproveTokenMessage(
    tokenPath: string,
    amount: string,
    caller: string,
  ) {
    return {
      caller,
      send: "",
      pkg_path: tokenPath,
      func: "Approve",
      args: [POOL_ADDRESS, amount],
    };
  }
}
