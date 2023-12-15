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
import { isNativeToken } from "@models/token/token-model";
import {
  makeDepositMessage,
  makeWithdrawMessage,
} from "@common/clients/wallet-client/transaction-messages/token";
import { makePoolTokenApproveMessage } from "@common/clients/wallet-client/transaction-messages/pool";
import { SendTransactionSuccessResponse } from "@common/clients/wallet-client/protocols";
import { WrapTokenRequest } from "./request/wrap-token-request";
import { TokenError } from "@common/errors/token";
import { UnwrapTokenRequest } from "./request/unwrap-token-request";
import { SwapRouteResponse } from "./response/swap-route-response";

const ROUTER_PACKAGE_PATH = process.env.NEXT_PUBLIC_PACKAGE_ROUTER_PATH;

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

    const inputTokenPath = isNativeToken(inputToken)
      ? inputToken.wrappedPath
      : inputToken.path;
    const outputTokenPath = isNativeToken(outputToken)
      ? outputToken.wrappedPath
      : outputToken.path;
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

    console.log("estimateRouteParams", [
      inputTokenPath,
      outputTokenPath,
      tokenAmountRaw || "0",
      exactType,
      routesQuery,
      quotes,
    ]);

    console.log("estimateRouteParams:Result", result);

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

  public swapRoute = async (
    request: SwapRouteRequest,
  ): Promise<SwapRouteResponse> => {
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
    const inputTokenPath = isNativeToken(inputToken)
      ? inputToken.wrappedPath
      : inputToken.path;
    const outputTokenPath = isNativeToken(outputToken)
      ? outputToken.wrappedPath
      : outputToken.path;
    const messages = [];
    const sendTokenAmount =
      exactType === "EXACT_IN" ? tokenAmountRaw : tokenAmountLimitRaw;
    if (isNativeToken(inputToken)) {
      messages.push(
        makeDepositMessage(inputTokenPath, sendTokenAmount, "ugnot", address),
      );
    }
    messages.push(
      makePoolTokenApproveMessage(
        inputTokenPath,
        MAX_UINT64.toString(),
        address,
      ),
    );
    messages.push(
      makePoolTokenApproveMessage(
        outputTokenPath,
        MAX_UINT64.toString(),
        address,
      ),
    );
    messages.push({
      caller: address,
      send: "",
      pkg_path: ROUTER_PACKAGE_PATH,
      func: "SwapRoute",
      args: [
        inputToken.path,
        outputToken.path,
        `${tokenAmountRaw || 0}`,
        exactType,
        `${routesQuery}`,
        `${quotes}`,
        tokenAmountLimitRaw.toString(),
      ],
    });
    const response = await this.walletClient.sendTransaction({
      messages,
      gasWanted: 2000000,
      gasFee: 1,
      memo: "",
    });
    if (response.code !== 0 || !response.data) {
      throw new SwapError("SWAP_FAILED");
    }
    const data = response.data as SendTransactionSuccessResponse<string>;
    if (BigNumber(data.data).isNaN()) {
      throw new SwapError("SWAP_FAILED");
    }
    const resultAmount =
      makeDisplayTokenAmount(resultToken, data.data)?.toString() || "0";
    const slippageAmount =
      makeDisplayTokenAmount(
        resultToken,
        sendTokenAmount.toString(),
      )?.toString() || "0";
    return {
      hash: data.hash,
      height: data.height,
      resultToken,
      resultAmount: resultAmount,
      slippageAmount,
    };
  };

  public wrapToken = async (request: WrapTokenRequest): Promise<string> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !ROUTER_PACKAGE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const { token, tokenAmount } = request;

    const tokenAmountRaw = makeRawTokenAmount(token, tokenAmount) || "0";

    const messages = [];
    if (!isNativeToken(token)) {
      throw new TokenError("FAILED_WRAP_TOKEN");
    }
    messages.push(
      makeDepositMessage(token.wrappedPath, tokenAmountRaw, "ugnot", address),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasWanted: 2000000,
      gasFee: 1,
      memo: "",
    });
    if (response.code !== 0) {
      throw new SwapError("SWAP_FAILED");
    }
    return response.status;
  };

  public unwrapToken = async (request: UnwrapTokenRequest): Promise<string> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !ROUTER_PACKAGE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const { token, tokenAmount } = request;

    const tokenPath = isNativeToken(token) ? token.wrappedPath : token.path;
    const tokenAmountRaw = makeRawTokenAmount(token, tokenAmount) || "0";

    const messages = [];
    messages.push(makeWithdrawMessage(tokenPath, tokenAmountRaw, address));
    const response = await this.walletClient.sendTransaction({
      messages,
      gasWanted: 2000000,
      gasFee: 1,
      memo: "",
    });
    if (response.code !== 0) {
      throw new SwapError("SWAP_FAILED");
    }
    return response.status;
  };
}
