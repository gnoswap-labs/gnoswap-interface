import { NetworkClient } from "@common/clients/network-client";
import { PoolDetailResponse, PoolListResponse, PoolRepository } from ".";
import { WalletClient } from "@common/clients/wallet-client";
import { CreatePoolRequest } from "./request/create-pool-request";
import { TokenModel } from "@models/token/token-model";
import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { SendTransactionSuccessResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";

const POOL_PATH = process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH || "";
const POSITION_PATH = process.env.NEXT_PUBLIC_PACKAGE_POSITION_PATH || "";
const POOL_ADDRESS = process.env.NEXT_PUBLIC_PACKAGE_POOL_ADDRESS || "";

export class PoolRepositoryImpl implements PoolRepository {
  private networkClient: NetworkClient;
  private walletClient: WalletClient | null;

  constructor(networkClient: NetworkClient, walletClient: WalletClient | null) {
    this.networkClient = networkClient;
    this.walletClient = walletClient;
  }

  getPools = async (): Promise<PoolListResponse> => {
    const response = await this.networkClient.get<PoolListResponse>({
      url: "/pools",
    });
    return {
      ...response.data,
      pools: response.data.pools || [],
    };
  };

  getPoolDetailByPoolId = async (
    poolId: string,
  ): Promise<PoolDetailResponse> => {
    const response = await this.networkClient.get<PoolDetailResponse>({
      url: "/pools/" + poolId,
    });
    return response.data;
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
    // Todo: Change to Path
    // const tokenAPath = tokenA.path;
    // const tokenBPath = tokenB.path;
    const tokenAPath = tokenA.symbol.toLowerCase();
    const tokenBPath = tokenB.symbol.toLowerCase();
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
    // Todo: Change to Path
    // const tokenAPath = tokenA.path;
    // const tokenBPath = tokenB.path;
    const tokenAPath = tokenA.symbol.toLowerCase();
    const tokenBPath = tokenB.symbol.toLowerCase();
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
