import { WalletClient } from "@common/clients/wallet-client";
import { SwapRouterRepository } from "./swap-router-repository";
import { TokenModel } from "@models/token/token-model";
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

const ROUTER_PACKAGE_PATH = process.env.NEXT_PUBLIC_PACKAGE_ROUTER_PATH;
const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_PACKAGE_ROUTER_ADDRESS || "";

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

    if (Number.isNaN(tokenAmount)) {
      throw new SwapError("INVALID_PARAMS");
    }

    const inputTokenPath = inputToken.path;
    const outputTokenPath = outputToken.path;
    const swapRouter = new SwapRouter(this.pools);
    const estimatedRoutes = swapRouter.estimateSwapRoute(
      inputTokenPath,
      outputTokenPath,
      BigInt(Math.floor(tokenAmount)),
      exactType,
    );

    const routesQuery = makeRoutesQuery(estimatedRoutes);
    const quotes = estimatedRoutes.map(route => route.quote).join(",");
    const param = makeABCIParams("DrySwapRoute", [
      inputTokenPath,
      outputTokenPath,
      tokenAmount,
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
    return {
      amount: result.toString(),
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
    const routesQuery = makeRoutesQuery(estimatedRoutes);
    const quotes = estimatedRoutes.map(route => route.quote).join(",");
    const response = await this.walletClient.sendTransaction({
      messages: [
        SwapRouterRepositoryImpl.makeApproveTokenMessage(
          inputToken,
          "",
          address,
        ),
        SwapRouterRepositoryImpl.makeApproveTokenMessage(
          outputToken,
          "",
          address,
        ),
        {
          caller: address,
          send: "",
          pkg_path: ROUTER_PACKAGE_PATH,
          func: "SwapRoute",
          args: [
            inputToken.path,
            outputToken.path,
            `${tokenAmount}`,
            exactType,
            `${routesQuery}`,
            `${quotes}`,
            `${tokenAmountLimit}`,
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
    token: TokenModel,
    amount: string,
    caller: string,
  ) {
    return {
      caller,
      send: "",
      pkg_path: token.path,
      func: "Approve",
      args: [ROUTER_ADDRESS, "999999999999"],
    };
  }
}
