import { NetworkClient } from "@common/clients/network-client";
import {
  PoolDetailResponse,
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
import { PoolModel } from "@models/pool/pool-model";

const POOL_PATH = process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH || "";
const POSITION_PATH = process.env.NEXT_PUBLIC_PACKAGE_POSITION_PATH || "";
const POOL_ADDRESS = process.env.NEXT_PUBLIC_PACKAGE_POOL_ADDRESS || "";

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

  getPoolDetailByPoolId = async (
    poolId: string,
  ): Promise<PoolDetailResponse> => {
    const response = await this.networkClient.get<PoolDetailResponse>({
      url: "/pools/" + poolId,
    });
    return response.data;
  };

  getPoolInfoByPoolPath = async (
    poolPath: string,
  ): Promise<PoolRPCModel> => {
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
      return PoolRPCMapper.from(response?.response?.data);
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
    const result = await this.walletClient.sendTransaction({
      messages: [
        PoolRepositoryImpl.makeCreatePoolMessage(
          tokenA,
          tokenB,
          feeTier,
          startPrice,
          caller,
        ),
        PoolRepositoryImpl.makeApproveTokenMessage(
          tokenA,
          tokenAAmount,
          caller,
        ),
        PoolRepositoryImpl.makeApproveTokenMessage(
          tokenB,
          tokenBAmount,
          caller,
        ),
        PoolRepositoryImpl.makeAddLiquidityMessage(
          tokenA,
          tokenB,
          feeTier,
          minTick,
          maxTick,
          tokenAAmount,
          tokenBAmount,
          slippage,
          caller,
        ),
      ],
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
    const tokenAPath = tokenA.path;
    const tokenBPath = tokenB.path;
    const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
    return {
      caller,
      send: "",
      pkg_path: POOL_PATH,
      func: "CreatePool",
      args: [tokenAPath, tokenBPath, fee, startPrice],
    };
  }

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
      args: [POOL_ADDRESS, "999999999999"],
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
    slippage: number,
    caller: string,
  ) {
    const tokenAPath = tokenA.path;
    const tokenBPath = tokenB.path;
    const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
    const deadline = "7282571140";
    return {
      caller,
      send: "",
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
        "0",
        "0",
        deadline,
      ],
    };
  }
}
