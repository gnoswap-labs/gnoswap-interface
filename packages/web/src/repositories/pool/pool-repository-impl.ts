import { NetworkClient } from "@common/clients/network-client";
import {
  PoolResponse,
  PoolListResponse,
  PoolRepository,
} from ".";
import { WalletClient } from "@common/clients/wallet-client";
import { CreatePoolRequest } from "./request/create-pool-request";
import { TokenModel } from "@models/token/token-model";
import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { SendTransactionSuccessResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { GnoProvider } from "@gnolang/gno-js-client";
import {
  evaluateExpressionToObject,
  makeABCIParams,
} from "@utils/rpc-utils";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { PoolRPCMapper } from "@models/pool/mapper/pool-rpc-mapper";
import { PoolError } from "@common/errors/pool";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolRPCResponse } from "./response/pool-rpc-response";
import { IPoolDetailResponse, PoolModel } from "@models/pool/pool-model";
import { AddLiquidityRequest } from "./request/add-liquidity-request";
import BigNumber from "bignumber.js";
import { priceToNearTick } from "@utils/swap-utils";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import { makeRawTokenAmount } from "@utils/token-utils";
import { tickToSqrtPriceX96 } from "@gnoswap-labs/swap-router";
import { PoolDetailModel } from "@models/pool/pool-detail-model";

const WRAPPED_GNOT_PATH = process.env.NEXT_PUBLIC_WRAPPED_GNOT_PATH || "";
const POOL_PATH = process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH || "";
const POSITION_PATH = process.env.NEXT_PUBLIC_PACKAGE_POSITION_PATH || "";
const POOL_ADDRESS = process.env.NEXT_PUBLIC_PACKAGE_POOL_ADDRESS || "";
const GNS_TOKEN_PATH = process.env.NEXT_PUBLIC_GNS_TOKEN_PATH || "";
const CREATE_POOL_FEE = process.env.NEXT_PUBLIC_CREATE_POOL_FEE || "";

export class PoolRepositoryImpl implements PoolRepository {
  private networkClient: NetworkClient;
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;

  constructor(
    networkClient: NetworkClient,
    rpcProvider: GnoProvider | null,
    walletClient: WalletClient | null,
  ) {
    this.networkClient = networkClient;
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
  }
  getRPCPools = async(): Promise<PoolRPCModel[]> => {
    const poolPackagePath = process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH;
    if (!poolPackagePath || !this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
    }
    const param = makeABCIParams("RpcGetPools", []);
    const result: PoolRPCModel[] = await this.rpcProvider.evaluateExpression(
      poolPackagePath,
      param,
    ).then(evaluateExpressionToObject<PoolRPCResponse[]>)
    .then(PoolRPCMapper.fromList)
    .catch(e => {
      console.error(e);
      return [];
    });
    return result;
  };

  getPools = async (): Promise<PoolModel[]> => {
    const response = await this.networkClient.get<PoolListResponse>({
      url: "/pools",
    });
    const pools = response?.data?.pools ? 
      response.data.pools.map(PoolMapper.fromResponse) :
      [];
    return pools;
  };

  getPoolDetailByPoolPath = async (
    poolPath: string,
  ): Promise<PoolDetailModel> => {
    const pool = await this.networkClient.get<PoolResponse>({
      url: "/pool_details/" + poolPath,
    }).then(response => PoolMapper.detailFromResponse(response.data));
    return pool;
  };

  getPoolDetailRPCByPoolPath = async (
    poolPath: string,
  ): Promise<PoolDetailRPCModel> => {
    const poolPackagePath = process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH;
    if (!poolPackagePath || !this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
    }
    const param = makeABCIParams("ApiGetPool", [poolPath]);

    const response = await this.rpcProvider.evaluateExpression(
      poolPackagePath,
      param,
    ).then(evaluateExpressionToObject<{
      response: {
        data: PoolRPCResponse
      }
    }>)
    .then(response => {
      if (!response?.response?.data) {
        return null;
      }
      return PoolRPCMapper.detailFrom(response?.response?.data);
    })
    .catch(e => {
      console.error(e);
      return null;
    });
    if (response === null) {
      throw new PoolError("NOT_FOUND_POOL");
    }
    return response;
  };

  createPool = async (request: CreatePoolRequest): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const {
      tokenA,
      tokenB,
      feeTier,
      tokenAAmount,
      tokenBAmount,
      minTick,
      maxTick,
      startPrice,
      slippage,
      caller,
    } = request;
    const gasFee = 1;
    const gasWanted = 2000000;
    const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
    const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";

    const messages = [];
    messages.push(PoolRepositoryImpl.makeApproveGnosTokenMessage(caller));
    messages.push(PoolRepositoryImpl.makeCreatePoolMessage(
      tokenA,
      tokenB,
      feeTier,
      startPrice,
      caller,
    ));

    const tokenAPath = tokenA.type === "grc20" ? tokenA.path : WRAPPED_GNOT_PATH;
    messages.push(PoolRepositoryImpl.makeApproveTokenMessage(
      tokenAPath,
      tokenAAmountRaw,
      caller,
    ));
    const tokenBPath = tokenB.type === "grc20" ? tokenB.path : WRAPPED_GNOT_PATH;
    messages.push(PoolRepositoryImpl.makeApproveTokenMessage(
      tokenBPath,
      tokenBAmountRaw,
      caller,
    ));

    messages.push(PoolRepositoryImpl.makeAddLiquidityMessage(
      tokenA,
      tokenB,
      feeTier,
      minTick,
      maxTick,
      tokenAAmountRaw,
      tokenBAmountRaw,
      slippage.toString(),
      caller,
    ));
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee,
      gasWanted,
    });
    const response = result.data as SendTransactionSuccessResponse;
    if (!response.hash) {
      throw new Error(`${result}`);
    }
    return response.hash;
  };

  addLiquidity = async (request: AddLiquidityRequest): Promise<string> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const {
      tokenA,
      tokenB,
      feeTier,
      tokenAAmount,
      tokenBAmount,
      minTick,
      maxTick,
      slippage,
      caller,
    } = request;
    const gasFee = 1;
    const gasWanted = 2000000;
    const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
    const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";
    const messages = [];

    const tokenAPath = tokenA.type === "grc20" ? tokenA.path : WRAPPED_GNOT_PATH;
    messages.push(PoolRepositoryImpl.makeApproveTokenMessage(
      tokenAPath,
      tokenAAmountRaw,
      caller,
    ));
    const tokenBPath = tokenB.type === "grc20" ? tokenB.path : WRAPPED_GNOT_PATH;
    messages.push(PoolRepositoryImpl.makeApproveTokenMessage(
      tokenBPath,
      tokenBAmountRaw,
      caller,
    ));

    messages.push(PoolRepositoryImpl.makeAddLiquidityMessage(
      tokenA,
      tokenB,
      feeTier,
      minTick,
      maxTick,
      tokenAAmountRaw,
      tokenBAmountRaw,
      slippage.toString(),
      caller,
    ));
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee,
      gasWanted,
    });
    const response = result.data as SendTransactionSuccessResponse;
    if (!response.hash) {
      throw new Error(`${result}`);
    }
    return response.hash;
  };

  private static makeCreatePoolMessage(
    tokenA: TokenModel,
    tokenB: TokenModel,
    feeTier: SwapFeeTierType,
    startPrice: string,
    caller: string,
  ) {
    const tokenAPath = tokenA.priceId;
    const tokenBPath = tokenB.priceId;
    const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
    const startPriceSqrt = tickToSqrtPriceX96(priceToNearTick(Number(startPrice), SwapFeeTierInfoMap[feeTier].tickSpacing));

    return {
      caller,
      send: "",
      pkg_path: POOL_PATH,
      func: "CreatePool",
      args: [tokenAPath, tokenBPath, fee, startPriceSqrt.toString()],
    };
  }

  private static makeApproveGnosTokenMessage(caller: string) {
    return this.makeApproveTokenMessage(GNS_TOKEN_PATH, CREATE_POOL_FEE, caller);
  }

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

  private static makeAddLiquidityMessage(
    tokenA: TokenModel,
    tokenB: TokenModel,
    feeTier: SwapFeeTierType,
    minTick: number,
    maxTick: number,
    tokenAAmount: string,
    tokenBAmount: string,
    slippage: string,
    caller: string,
  ) {
    const tokenAPath = tokenA.priceId;
    const tokenBPath = tokenB.priceId;
    const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
    const slippageRatio = 0;
    const deadline = "7282571140";
    const sendItems = [];
    if (tokenA.type === "native" && BigNumber(tokenAAmount).isGreaterThan(0) ) {
      sendItems.push(`${tokenAAmount}ugnot`);
    }
    if (tokenB.type === "native" && BigNumber(tokenAAmount).isGreaterThan(0)) {
      sendItems.push(`${tokenBAmount}ugnot`);
    }
    const sendAmount = sendItems.join(",");
    return {
      caller,
      send: sendAmount,
      pkg_path: POSITION_PATH,
      func: "Mint",
      args: [
        tokenAPath,
        tokenBPath,
        fee,
        `${minTick}`,
        `${maxTick}`,
        tokenAAmount,
        tokenBAmount,
        BigNumber(tokenAAmount).multipliedBy(slippageRatio).toFixed(0),
        BigNumber(tokenBAmount).multipliedBy(slippageRatio).toFixed(0),
        deadline,
      ],
    };
  }

  getPoolDetailByPath = async (
    poolPath: string,
  ): Promise<IPoolDetailResponse> => {
    const response = await this.networkClient.get<IPoolDetailResponse>({
      url: "/pool_details/" + poolPath,
    });
    return response.data;
  };
}
