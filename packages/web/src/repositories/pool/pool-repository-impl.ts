import { NetworkClient } from "@common/clients/network-client";
import {
  PoolResponse,
  PoolListResponse,
  PoolRepository,
} from ".";
import { WalletClient } from "@common/clients/wallet-client";
import { CreatePoolRequest } from "./request/create-pool-request";
import { isNativeToken, TokenModel } from "@models/token/token-model";
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
import { priceToNearTick } from "@utils/swap-utils";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "@utils/token-utils";
import { tickToSqrtPriceX96 } from "@gnoswap-labs/swap-router";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { makeDepositMessage } from "@common/clients/wallet-client/transaction-messages/token";
import { CreateExternalIncentiveRequest } from "./request/create-external-incentive-request";
import { RemoveExternalIncentiveRequest } from "./request/remove-external-incentive-request";
import { makeCreateIncentiveMessage, makeRemoveIncentiveMessage, makeStakerApproveMessage } from "@common/clients/wallet-client/transaction-messages/pool";
import { makePositionMintMessage } from "@common/clients/wallet-client/transaction-messages/position";
import { AddLiquidityResponse } from "./response/add-liquidity-response";
import { CreatePoolResponse } from "./response/create-pool-response";

const POOL_PATH = process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH || "";
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

  createPool = async (request: CreatePoolRequest): Promise<CreatePoolResponse> => {
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
    
    let tokenAPath = tokenA.path;
    let tokenBPath = tokenB.path;
    if (isNativeToken(tokenA)) {
      tokenAPath = tokenA.wrappedPath;
      messages.push(makeDepositMessage(tokenAPath, tokenAAmountRaw, "ugnot", caller));
    }
    if (isNativeToken(tokenB)) {
      tokenBPath = tokenB.wrappedPath;
      messages.push(makeDepositMessage(tokenBPath, tokenBAmountRaw, "ugnot", caller));
    }
    messages.push(PoolRepositoryImpl.makeApproveGnosTokenMessage(caller));
    messages.push(PoolRepositoryImpl.makeCreatePoolMessage(
      tokenA,
      tokenB,
      feeTier,
      startPrice,
      caller,
    ));

    messages.push(PoolRepositoryImpl.makeApproveTokenMessage(
      tokenAPath,
      tokenAAmountRaw,
      caller,
    ));
    messages.push(PoolRepositoryImpl.makeApproveTokenMessage(
      tokenBPath,
      tokenBAmountRaw,
      caller,
    ));

    messages.push(makePositionMintMessage(
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
    if (result.code !== 0) {
      throw new Error(`${result}`);
    }
    const data = result.data as SendTransactionSuccessResponse<string[]>;
    if (data.data === null || !Array.isArray(data.data) || data.data.length < 4) {
      return {
        code: result.code,
        hash: data.hash,
        tokenA,
        tokenB,
        tokenAAmount: "0",
        tokenBAmount: "0",
      };
    }
    const resultTokenAAmount = makeDisplayTokenAmount(tokenA, data.data[2]) || 0;
    const resultTokenBAmount = makeDisplayTokenAmount(tokenA, data.data[3]) || 0;
    return {
      code: result.code,
      hash: data.hash,
      tokenA,
      tokenB,
      tokenAAmount: resultTokenAAmount.toString(),
      tokenBAmount: resultTokenBAmount.toString(),
    };
  };

  addLiquidity = async (request: AddLiquidityRequest): Promise<AddLiquidityResponse> => {
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
    
    let tokenAPath = tokenA.path;
    let tokenBPath = tokenB.path;
    if (isNativeToken(tokenA)) {
      tokenAPath = tokenA.wrappedPath;
      messages.push(makeDepositMessage(tokenAPath, tokenAAmountRaw, "ugnot", caller));
    }
    if (isNativeToken(tokenB)) {
      tokenBPath = tokenB.wrappedPath;
      messages.push(makeDepositMessage(tokenBPath, tokenBAmountRaw, "ugnot", caller));
    }

    messages.push(PoolRepositoryImpl.makeApproveTokenMessage(
      tokenAPath,
      tokenAAmountRaw,
      caller,
    ));
    messages.push(PoolRepositoryImpl.makeApproveTokenMessage(
      tokenBPath,
      tokenBAmountRaw,
      caller,
    ));

    messages.push(makePositionMintMessage(
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
    const data = result.data as SendTransactionSuccessResponse<string[]>;
    if (data.data === null || !Array.isArray(data.data) || data.data.length < 4) {
      return {
        code: result.code,
        hash: data.hash,
        tokenA,
        tokenB,
        tokenAAmount: "0",
        tokenBAmount: "0",
      };
    }
    const resultTokenAAmount = makeDisplayTokenAmount(tokenA, data.data[2]) || 0;
    const resultTokenBAmount = makeDisplayTokenAmount(tokenA, data.data[3]) || 0;
    return {
      code: result.code,
      hash: data.hash,
      tokenA,
      tokenB,
      tokenAAmount: resultTokenAAmount.toString(),
      tokenBAmount: resultTokenBAmount.toString(),
    };
  };

  getPoolDetailByPath = async (
    poolPath: string,
  ): Promise<IPoolDetailResponse> => {
    const response = await this.networkClient.get<IPoolDetailResponse>({
      url: "/pool_details/" + poolPath,
    });
    return response.data;
  };

  createExternalIncentive = async (request: CreateExternalIncentiveRequest): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data ) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const {
      poolPath,
      rewardToken,
      rewardAmount,
      startTime,
      endTime
    } = request;

    const rewardAmountRaw = makeRawTokenAmount(rewardToken, rewardAmount) || "0";

    const messages = [];
    let tokenPath = rewardToken.path;
    if (isNativeToken(rewardToken)) {
      tokenPath = rewardToken.wrappedPath;
      messages.push(
        makeDepositMessage(tokenPath, rewardAmountRaw, "ugnot", address),
      );
    }
    messages.push(makeStakerApproveMessage(tokenPath, rewardAmountRaw, address));
    messages.push(makeCreateIncentiveMessage(poolPath, tokenPath, rewardAmountRaw, startTime, endTime, address));

    const response = await this.walletClient.sendTransaction({
      messages,
      gasWanted: 2000000,
      gasFee: 1,
      memo: "",
    });
    if (response.code !== 0 || !response.data) {
      throw new PoolError("FAILED_TO_CREATE_INCENTIVE");
    }
    const data = response?.data as SendTransactionSuccessResponse<string[]>;
    return data?.hash || null;
  };

  removeExternalIncentive = async (request: RemoveExternalIncentiveRequest): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data ) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const {
      poolPath,
      rewardToken
    } = request;

    const messages = [];
    let tokenPath = rewardToken.path;
    if (isNativeToken(rewardToken)) {
      tokenPath = rewardToken.wrappedPath;
    }
    messages.push(makeRemoveIncentiveMessage(poolPath, tokenPath, address));

    const response = await this.walletClient.sendTransaction({
      messages,
      gasWanted: 2000000,
      gasFee: 1,
      memo: "",
    });
    if (response.code !== 0 || !response.data) {
      throw new PoolError("FAILED_TO_CREATE_INCENTIVE");
    }
    const data = response?.data as SendTransactionSuccessResponse<string[]>;
    return data?.hash || null;
  };

  private static makeCreatePoolMessage(
    tokenA: TokenModel,
    tokenB: TokenModel,
    feeTier: SwapFeeTierType,
    startPrice: string,
    caller: string,
  ) {
    let tokenAPath = tokenA.path;
    let tokenBPath = tokenB.path;
    if (isNativeToken(tokenA) ) {
      tokenAPath = tokenA.wrappedPath;
    }
    if (isNativeToken(tokenB) ) {
      tokenBPath = tokenB.wrappedPath;
    }
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
}
