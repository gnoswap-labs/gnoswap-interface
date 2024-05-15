import { NetworkClient } from "@common/clients/network-client";
import { PoolResponse, PoolListResponse, PoolRepository } from ".";
import { WalletClient } from "@common/clients/wallet-client";
import { CreatePoolRequest } from "./request/create-pool-request";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import {
  SendTransactionResponse,
  SendTransactionSuccessResponse,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { GnoProvider } from "@gnolang/gno-js-client";
import { evaluateExpressionToObject, makeABCIParams } from "@utils/rpc-utils";
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
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { makeDepositMessage } from "@common/clients/wallet-client/transaction-messages/token";
import { CreateExternalIncentiveRequest } from "./request/create-external-incentive-request";
import { RemoveExternalIncentiveRequest } from "./request/remove-external-incentive-request";
import {
  makeCreateIncentiveMessage,
  makeRemoveIncentiveMessage,
  makeStakerApproveMessage,
} from "@common/clients/wallet-client/transaction-messages/pool";
import {
  makePositionMintMessage,
  makePositionMintWithStakeMessage,
} from "@common/clients/wallet-client/transaction-messages/position";
import { AddLiquidityResponse } from "./response/add-liquidity-response";
import { CreatePoolResponse } from "./response/create-pool-response";
import {
  PACKAGE_POOL_ADDRESS,
  PACKAGE_POOL_PATH,
  GNS_TOKEN_PATH,
  CREATE_POOL_FEE,
} from "@common/clients/wallet-client/transaction-messages";
import { tickToSqrtPriceX96 } from "@utils/math.utils";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { checkGnotPath } from "@utils/common";

const POOL_PATH = PACKAGE_POOL_PATH || "";
const POOL_ADDRESS = PACKAGE_POOL_ADDRESS || "";

export class PoolRepositoryImpl implements PoolRepository {
  private rpcPools: PoolRPCModel[];
  private updatedAt: number;

  private networkClient: NetworkClient;
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;

  constructor(
    networkClient: NetworkClient,
    rpcProvider: GnoProvider | null,
    walletClient: WalletClient | null,
  ) {
    this.updatedAt = 0;
    this.rpcPools = [];
    this.networkClient = networkClient;
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
  }
  getRPCPools = async (): Promise<PoolRPCModel[]> => {
    try {
      this.updatedAt = Date.now();

      const poolPackagePath = PACKAGE_POOL_PATH;

      if (!poolPackagePath || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("ApiGetPools", []);
      const res = await this.rpcProvider.evaluateExpression(
        poolPackagePath,
        param,
      );
      const pools = PoolRPCMapper.fromList(
        evaluateExpressionToObject<{ response: PoolRPCResponse[] }>(res)
          ?.response || [],
      );
      this.rpcPools = pools;

      return pools;
    } catch (error) {
      return [];
    }
  };

  getPools = async (): Promise<PoolModel[]> => {
    const response = await this.networkClient.get<PoolListResponse>({
      url: "/pools",
    });
    const pools = response?.data?.data
      ? response.data.data.map(PoolMapper.fromResponse)
      : [];
    return pools;
  };

  getPoolDetailByPoolPath = async (
    poolPath: string,
  ): Promise<PoolDetailModel> => {
    const pool = await this.networkClient
      .get<{ data: PoolResponse }>({
        url: "/pools/" + encodeURIComponent(poolPath),
      })
      .then(response => PoolMapper.detailFromResponse(response.data.data));
    return pool;
  };

  getBinsOfPoolByPath = async (poolPath: string): Promise<PoolBinModel[]> => {
    const tempPath = poolPath.replace(/\//g, "%2F");
    const pool = await this.networkClient
      .get<{ data: PoolBinModel[] }>({
        url: "/pools/" + tempPath + "/bins?bins=40",
      })
      .then(response => {
        return response.data.data;
      });
    return pool;
  };

  getPoolDetailRPCByPoolPath = async (
    poolPath: string,
  ): Promise<PoolDetailRPCModel> => {
    const pools = await this.getRPCPools();
    const pool = pools?.find(item => {
      return item.poolPath === poolPath;
    });
    if (!pool) {
      throw new PoolError("NOT_FOUND_POOL");
    }

    return PoolRPCMapper.toDetail(pool);
  };

  createPool = async (
    request: CreatePoolRequest,
  ): Promise<CreatePoolResponse> => {
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
      withStaking,
    } = request;
    const gasFee = 1;
    const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
    const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";

    const tokenAPath = tokenA.path;
    const tokenBPath = tokenB.path;

    const tokenAWrappedPath = tokenA.wrappedPath || checkGnotPath(tokenA.path);
    const tokenBWrappedPath = tokenB.wrappedPath || checkGnotPath(tokenB.path);

    // When GNOT, make a send to the pool contract.
    const sendAmount: string | null = isNativeToken(tokenA)
      ? tokenAAmountRaw
      : isNativeToken(tokenB)
      ? tokenBAmountRaw
      : null;

    const createPoolMessage = PoolRepositoryImpl.makeCreatePoolMessage(
      tokenA,
      tokenB,
      feeTier,
      startPrice,
      caller,
    );

    const approveMessages = [
      PoolRepositoryImpl.makeApproveTokenMessage(
        tokenAWrappedPath,
        tokenAAmountRaw,
        caller,
      ),
      PoolRepositoryImpl.makeApproveTokenMessage(
        tokenBWrappedPath,
        tokenBAmountRaw,
        caller,
      ),
    ];

    const makeMintMessage = withStaking
      ? makePositionMintWithStakeMessage
      : makePositionMintMessage;

    const mintMessage = makeMintMessage(
      tokenAPath,
      tokenBPath,
      feeTier,
      minTick,
      maxTick,
      tokenAAmountRaw,
      tokenBAmountRaw,
      slippage.toString(),
      caller,
      sendAmount,
    );

    const messages = [createPoolMessage, ...approveMessages, mintMessage];
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee,
    });
    if (result.code !== 0) {
      throw new Error(`${result}`);
    }
    const data = result.data as SendTransactionSuccessResponse<string[]>;
    if (
      data.data === null ||
      !Array.isArray(data.data) ||
      data.data.length < 4
    ) {
      return {
        code: result.code,
        hash: data.hash,
        tokenA,
        tokenB,
        tokenAAmount: "0",
        tokenBAmount: "0",
      };
    }
    const resultTokenAAmount =
      makeDisplayTokenAmount(tokenA, data.data[2]) || 0;
    const resultTokenBAmount =
      makeDisplayTokenAmount(tokenA, data.data[3]) || 0;
    return {
      code: result.code,
      hash: data.hash,
      tokenA,
      tokenB,
      tokenAAmount: resultTokenAAmount.toString(),
      tokenBAmount: resultTokenBAmount.toString(),
    };
  };

  addLiquidity = async (
    request: AddLiquidityRequest,
  ): Promise<AddLiquidityResponse> => {
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
      withStaking,
    } = request;
    const gasFee = 1;
    const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
    const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";

    const tokenAPath = tokenA.path;
    const tokenBPath = tokenB.path;

    const tokenAWrappedPath = tokenA.wrappedPath || checkGnotPath(tokenA.path);
    const tokenBWrappedPath = tokenB.wrappedPath || checkGnotPath(tokenB.path);

    // When GNOT, make a send to the pool contract.
    const sendAmount: string | null = isNativeToken(tokenA)
      ? tokenAAmountRaw
      : isNativeToken(tokenB)
      ? tokenBAmountRaw
      : null;

    const approveMessages = [
      PoolRepositoryImpl.makeApproveTokenMessage(
        tokenAWrappedPath,
        tokenAAmountRaw,
        caller,
      ),
      PoolRepositoryImpl.makeApproveTokenMessage(
        tokenBWrappedPath,
        tokenBAmountRaw,
        caller,
      ),
    ];

    const makeMintMessage = withStaking
      ? makePositionMintWithStakeMessage
      : makePositionMintMessage;

    const mintMessage = makeMintMessage(
      tokenAPath,
      tokenBPath,
      feeTier,
      minTick,
      maxTick,
      tokenAAmountRaw,
      tokenBAmountRaw,
      slippage.toString(),
      caller,
      sendAmount,
    );

    const messages = [...approveMessages, mintMessage];

    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee,
    });
    const data = result.data as SendTransactionSuccessResponse<string[]>;
    if (
      data.data === null ||
      !Array.isArray(data.data) ||
      data.data.length < 4
    ) {
      return {
        code: result.code,
        hash: data.hash,
        tokenA,
        tokenB,
        tokenAAmount: "0",
        tokenBAmount: "0",
      };
    }
    const resultTokenAAmount =
      makeDisplayTokenAmount(tokenA, data.data[2]) || 0;
    const resultTokenBAmount =
      makeDisplayTokenAmount(tokenA, data.data[3]) || 0;
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
      url: "/pools/" + poolPath,
    });
    return response.data;
  };

  createExternalIncentive = async (
    request: CreateExternalIncentiveRequest,
  ): Promise<WalletResponse<
    SendTransactionResponse<string[] | null>
  > | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const { poolPath, rewardToken, rewardAmount, startTime, endTime } = request;

    const rewardAmountRaw =
      makeRawTokenAmount(rewardToken, rewardAmount) || "0";

    const messages = [];
    let tokenPath = rewardToken.path;
    if (isNativeToken(rewardToken)) {
      tokenPath = rewardToken.wrappedPath;
      messages.push(
        makeDepositMessage(tokenPath, rewardAmountRaw, "ugnot", address),
      );
    }
    messages.push(
      makeStakerApproveMessage(tokenPath, rewardAmountRaw, address),
    );
    messages.push(
      makeCreateIncentiveMessage(
        poolPath,
        tokenPath,
        rewardAmountRaw,
        startTime,
        endTime,
        address,
      ),
    );

    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
    return response;
  };

  removeExternalIncentive = async (
    request: RemoveExternalIncentiveRequest,
  ): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { address } = account.data;
    const { poolPath, rewardToken } = request;

    const messages = [];
    let tokenPath = rewardToken.path;
    if (isNativeToken(rewardToken)) {
      tokenPath = rewardToken.wrappedPath;
    }
    messages.push(makeRemoveIncentiveMessage(poolPath, tokenPath, address));

    const response = await this.walletClient.sendTransaction({
      messages,
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
    const tokenAPath = tokenA.wrappedPath || tokenA.path;
    const tokenBPath = tokenB.wrappedPath || tokenB.path;
    const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
    const startPriceSqrt = tickToSqrtPriceX96(
      priceToNearTick(
        Number(startPrice),
        SwapFeeTierInfoMap[feeTier].tickSpacing,
      ),
    );

    return {
      caller,
      send: "",
      pkg_path: POOL_PATH,
      func: "CreatePool",
      args: [tokenAPath, tokenBPath, fee, startPriceSqrt.toString()],
    };
  }

  private static makeApproveGnosTokenMessage(caller: string) {
    return this.makeApproveTokenMessage(
      GNS_TOKEN_PATH,
      CREATE_POOL_FEE,
      caller,
    );
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
