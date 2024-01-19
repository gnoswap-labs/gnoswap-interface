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
import {
  AlphaRouter,
  EstimatedRoute,
  SwapRouter,
} from "@gnoswap-labs/swap-router";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import BigNumber from "bignumber.js";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "@utils/token-utils";
import { MAX_UINT64 } from "@utils/math.utils";
import { isNativeToken, TokenModel } from "@models/token/token-model";
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
import {
  OnChainGasPriceProvider,
  OnChainQuoteProvider,
  V3PoolProvider,
} from "@gnoswap-labs/swap-router/build/alpha-router/providers";
import { PortionProvider } from "@gnoswap-labs/swap-router/build/alpha-router/providers/portion-provider";
import {
  ChainId,
  CurrencyAmount,
  Token,
} from "@gnoswap-labs/swap-router/build/alpha-router/core";

const ROUTER_PACKAGE_PATH = process.env.NEXT_PUBLIC_PACKAGE_ROUTER_PATH;
const SWAP_API_URI = "https://dev.simulate.gnoswap.io/v1/dry_swap_route";

const ROUTING_CONFIG = {
  v3PoolSelection: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 3,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 5,
  },
  maxSwapsPerPath: 3,
  minSplits: 1,
  maxSplits: 7,
  distributionPercent: 5,
  forceCrossProtocol: false,
};

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

  public estimateAlphaSwapRoute = async (
    request: EstimateSwapRouteRequest,
  ): Promise<EstimateSwapRouteResponse> => {
    if (!ROUTER_PACKAGE_PATH || !this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }
    const { inputToken, outputToken, exactType, tokenAmount } = request;

    if (BigNumber(tokenAmount).isNaN()) {
      throw new SwapError("INVALID_PARAMS");
    }

    const chainId = ChainId.DEV_GNOSWAP;

    const tokenA = makeTokenByModel(chainId, inputToken);
    const tokenB = makeTokenByModel(chainId, outputToken);
    const tokenAmountRaw = makeRawTokenAmount(
      exactType === "EXACT_IN" ? inputToken : outputToken,
      tokenAmount,
    );

    console.log("estimateRouteParams", [
      tokenA.address,
      tokenB.address,
      tokenAmountRaw || "0",
      exactType,
    ]);

    const alphaRouter = SwapRouterRepositoryImpl.createAlphaRouter(
      chainId,
      this.rpcProvider,
    );
    const swap = await alphaRouter.route(
      CurrencyAmount.fromRawAmount(tokenA, tokenAmountRaw || "0"),
      tokenB,
      exactType === "EXACT_IN" ? 0 : 1,
      undefined,
      { ...ROUTING_CONFIG },
    );

    if (swap === null) {
      throw new SwapError("NOT_FOUND_SWAP_POOL");
    }

    const amount = makeDisplayTokenAmount(
      exactType === "EXACT_IN" ? outputToken : inputToken,
      swap.quote.quotient.toString(),
    );
    const estimatedRoutes: EstimatedRoute[] = swap.route.map(route => {
      let inputPath = tokenA.address;
      const orderedPoolPaths = route.route.pools.map(pool => {
        const currentTokenPair =
          inputPath === pool.token0.address
            ? [pool.token0.address, pool.token1.address]
            : [pool.token1.address, pool.token0.address];
        inputPath = currentTokenPair[1];
        return `${currentTokenPair.join(":")}:${pool.fee.toString()}`;
      });
      const routeKey = orderedPoolPaths.join("*POOL*");
      const pools = route.route.pools.map(pool => ({
        poolPath: pool.path,
        tokenAPath: pool.token0.address,
        tokenBPath: pool.token1.address,
        fee: Number(pool.fee.toString()),
        tokenABalance: 0n,
        tokenBBalance: 0n,
        tickSpacing: 0,
        maxLiquidityPerTick: 0,
        price: 0,
        sqrtPriceX96: BigInt(pool.sqrtRatioX96.toString()),
        tick: 0,
        feeProtocol: 0,
        tokenAProtocolFee: 0,
        tokenBProtocolFee: 0,
        liquidity: BigInt(pool.liquidity.toString()),
        ticks: [],
        tickBitmaps: {},
        positions: [],
      }));
      return {
        routeKey,
        amountIn: BigInt(route.amount.quotient.toString()),
        amountOut: BigInt(route.quote.quotient.toString()),
        quote: route.percent,
        pools,
      };
    });
    console.log("estimatedRoutes", estimatedRoutes);
    return {
      amount: `${amount || 0}`,
      estimatedRoutes,
    };
  };

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
        inputTokenPath,
        outputTokenPath,
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
    const data = response.data as SendTransactionSuccessResponse<string[]>;
    if (data.data === null || data.data.length === 0) {
      throw new SwapError("SWAP_FAILED");
    }
    const resultAmount =
      makeDisplayTokenAmount(resultToken, data.data[0])?.toString() || "0";
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

  private static createAlphaRouter(chainId: number, provider: GnoProvider) {
    const onChainQuoteProvider = new OnChainQuoteProvider(
      chainId,
      provider,
      SWAP_API_URI,
    );
    const gasPriceProvider = new OnChainGasPriceProvider();
    const portionProvider = new PortionProvider();
    const poolProvider = new V3PoolProvider(chainId);

    return new AlphaRouter({
      chainId,
      provider,
      onChainQuoteProvider,
      gasPriceProvider,
      portionProvider,
      v3PoolProvider: poolProvider,
    });
  }
}

function makeTokenByModel(chainId: number, tokenModel: TokenModel): Token {
  const tokenPath = tokenModel.wrappedPath || tokenModel.path;
  const symbol = tokenModel.type === "native" ? "WGNOT" : tokenModel.symbol;
  return new Token(chainId, tokenPath, tokenModel.decimals, symbol, symbol);
}
