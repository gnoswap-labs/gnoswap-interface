import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import {
  SendTransactionErrorResponse,
  SendTransactionResponse,
  SendTransactionSuccessResponse,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import {
  makeApproveMessage,
  TransactionMessage,
} from "@common/clients/wallet-client/transaction-messages";
import {
  makeCreateIncentiveMessage,
  makeRemoveIncentiveMessage,
  makeStakerApproveMessage,
} from "@common/clients/wallet-client/transaction-messages/pool";
import {
  makeNFTSetTokenUri,
  makePositionMintMessage,
  makePositionMintWithStakeMessage,
} from "@common/clients/wallet-client/transaction-messages/position";
import { CommonError } from "@common/errors";
import { PoolError } from "@common/errors/pool";
import { GNOT_TOKEN } from "@common/values/token-constant";
import {
  GNS_TOKEN_PATH,
  PACKAGE_POOL_ADDRESS,
  PACKAGE_POOL_PATH,
  PACKAGE_POSITION_ADDRESS,
  PACKAGE_STAKER_PATH,
  WRAPPED_GNOT_PATH,
} from "@constants/environment.constant";
import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { GnoProvider } from "@gnolang/gno-js-client";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolRPCMapper } from "@models/pool/mapper/pool-rpc-mapper";
import { PoolStakingMapper } from "@models/pool/mapper/pool-staking-mapper";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import { IncentivizePoolModel, PoolModel } from "@models/pool/pool-model";
import { PoolStakingModel } from "@models/pool/pool-staking";
import { TokenModel } from "@models/token/token-model";
import {
  checkGnotPath,
  isGNOTPath,
  isWrapped,
  toNativePath,
} from "@utils/common";
import { tickToSqrtPriceX96 } from "@utils/math.utils";
import { isOrderedTokenPaths } from "@utils/pool-utils";
import {
  evaluateExpressionToNumber,
  evaluateExpressionToObject,
  makeABCIParams,
} from "@utils/rpc-utils";
import { priceToTick } from "@utils/swap-utils";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "@utils/token-utils";
import BigNumber from "bignumber.js";
import { PoolListResponse, PoolRepository, PoolResponse } from ".";
import { AddLiquidityRequest } from "./request/add-liquidity-request";
import { CreateExternalIncentiveRequest } from "./request/create-external-incentive-request";
import { CreatePoolRequest } from "./request/create-pool-request";
import { RemoveExternalIncentiveRequest } from "./request/remove-external-incentive-request";
import {
  AddLiquidityFailedResponse,
  AddLiquiditySuccessResponse,
} from "./response/add-liquidity-response";
import {
  CreatePoolFailedResponse,
  CreatePoolSuccessResponse,
} from "./response/create-pool-response";
import { PoolRPCResponse } from "./response/pool-rpc-response";
import { PoolStakingResponse } from "./response/pool-staking-response";

const POOL_PATH = PACKAGE_POOL_PATH || "";
const POOL_ADDRESS = PACKAGE_POOL_ADDRESS || "";

export class PoolRepositoryImpl implements PoolRepository {
  private networkClient: NetworkClient | null;
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;

  constructor(
    networkClient: NetworkClient | null,
    rpcProvider: GnoProvider | null,
    walletClient: WalletClient | null,
  ) {
    this.networkClient = networkClient;
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
  }

  getLatestBlockHeight = async (): Promise<string> => {
    try {
      if (!PACKAGE_POOL_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const response = await (
        await this.rpcProvider.getStatus()
      ).sync_info.latest_block_height;

      return response;
    } catch (error) {
      console.error(error);
      return "0";
    }
  };

  getCreationFee = async (): Promise<number> => {
    try {
      if (!PACKAGE_POOL_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetPoolCreationFee", []);
      const response = await this.rpcProvider.evaluateExpression(
        PACKAGE_POOL_PATH,
        param,
      );

      return evaluateExpressionToNumber(response);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  getPoolStakingList = async (
    poolPath: string,
  ): Promise<PoolStakingModel[]> => {
    if (!this.networkClient) {
      return [];
    }
    const response = await this.networkClient.get<{
      data: PoolStakingResponse[];
    }>({
      url: `/staking/${poolPath}`,
    });
    const pools = response?.data?.data
      ? response.data.data.map(PoolStakingMapper.fromResponse)
      : [];
    return pools;
  };

  getWithdrawalFee = async (): Promise<number> => {
    try {
      if (!PACKAGE_POOL_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetWithdrawalFee", []);
      const response = await this.rpcProvider.evaluateExpression(
        PACKAGE_POOL_PATH,
        param,
      );

      return evaluateExpressionToNumber(response);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  getUnstakingFee = async (): Promise<number> => {
    try {
      if (!PACKAGE_STAKER_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetUnstakingFee", []);
      const response = await this.rpcProvider.evaluateExpression(
        PACKAGE_STAKER_PATH,
        param,
      );

      return evaluateExpressionToNumber(response);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  getChainStatus = async (): Promise<number> => {
    try {
      if (!PACKAGE_STAKER_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetUnstakingFee", []);
      const response = await this.rpcProvider.evaluateExpression(
        PACKAGE_STAKER_PATH,
        param,
      );

      return evaluateExpressionToNumber(response);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  getPools = async (): Promise<PoolModel[]> => {
    if (!this.networkClient) {
      return [];
    }
    const response = await this.networkClient.get<PoolListResponse>({
      url: "/pools",
    });
    const pools = response?.data?.data
      ? response.data.data.map(PoolMapper.fromResponse)
      : [];
    return pools;
  };

  getIncentivizePools = async (): Promise<IncentivizePoolModel[]> => {
    if (!this.networkClient) {
      return [];
    }
    const response = await this.networkClient.get<PoolListResponse>({
      url: "/incentivize/pools",
    });

    const pools = response?.data?.data
      ? response.data.data.map(PoolMapper.toIncentivePool)
      : [];
    return pools;
  };

  getPoolDetailByPoolPath = async (
    poolPath: string,
  ): Promise<PoolDetailModel> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const pool = await this.networkClient
      .get<{ data: PoolResponse }>({
        url: "/pools/" + encodeURIComponent(poolPath),
      })
      .then(response => PoolMapper.detailFromResponse(response.data.data));
    return pool;
  };

  getBinsOfPoolByPath = async (
    poolPath: string,
    count?: number,
  ): Promise<PoolBinModel[]> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    return this.networkClient
      .get<{ data: PoolBinModel[] }>({
        url: `/pools/${encodeURIComponent(poolPath)}/bins?bins=${count || 40}`,
      })
      .then(response => response.data.data);
  };

  getPoolDetailRPCByPoolPath = async (
    poolPath: string,
  ): Promise<PoolDetailRPCModel | null> => {
    try {
      const poolPackagePath = PACKAGE_POOL_PATH;

      if (!poolPackagePath || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("ApiGetPool", [poolPath]);
      const res = await this.rpcProvider.evaluateExpression(
        poolPackagePath,
        param,
      );
      const responseData = evaluateExpressionToObject<{
        response: PoolRPCResponse;
      }>(res);

      return responseData
        ? PoolRPCMapper.detailFrom(responseData.response)
        : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  createPool = async (
    request: CreatePoolRequest,
  ): Promise<
    WalletResponse<CreatePoolSuccessResponse | CreatePoolFailedResponse>
  > => {
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
      createPoolFee,
    } = request;
    const gasFee = 1;
    const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
    const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";

    const tokenAPath = toNativePath(tokenA.path);
    const tokenBPath = toNativePath(tokenB.path);

    const tokenAWrappedPath = tokenA.wrappedPath || checkGnotPath(tokenA.path);
    const tokenBWrappedPath = tokenB.wrappedPath || checkGnotPath(tokenB.path);

    // When GNOT, make a send to the pool contract.
    const sendAmount: string | null = isWrapped(tokenAWrappedPath)
      ? tokenAAmountRaw
      : isWrapped(tokenBWrappedPath)
      ? tokenBAmountRaw
      : null;

    const createPoolMessages = [];

    /**
     * Create GNS Token Approve for pool create fee
     */
    if (createPoolFee > 0) {
      const gnsApproveAmount = createPoolFee.toString();
      createPoolMessages.push(
        PoolRepositoryImpl.makeApproveGnosTokenMessage(
          gnsApproveAmount,
          caller,
        ),
      );
    }

    /**
     * Add Create Pool message
     */
    createPoolMessages.push(
      PoolRepositoryImpl.makeCreatePoolMessage(
        tokenA,
        tokenB,
        feeTier,
        startPrice,
        caller,
      ),
    );

    const approveMessages: TransactionMessage[] = [];

    if (BigNumber(tokenAAmountRaw).isGreaterThan(0)) {
      approveMessages.push(
        PoolRepositoryImpl.makeApproveTokenMessage(
          tokenAWrappedPath,
          tokenAAmountRaw,
          caller,
        ),
      );
    }
    if (BigNumber(tokenBAmountRaw).isGreaterThan(0)) {
      approveMessages.push(
        PoolRepositoryImpl.makeApproveTokenMessage(
          tokenBWrappedPath,
          tokenBAmountRaw,
          caller,
        ),
      );
    }

    if ([tokenAPath, tokenBPath].includes(GNOT_TOKEN.path)) {
      approveMessages.push(
        makeApproveMessage(
          WRAPPED_GNOT_PATH,
          [PACKAGE_POSITION_ADDRESS, sendAmount || "0"],
          caller,
        ),
      );
    }

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
      slippage,
      caller,
      sendAmount,
    );

    const mintMessages = [mintMessage];

    const nftSetUriMessage = makeNFTSetTokenUri(caller);

    const messages = [
      ...createPoolMessages,
      ...approveMessages,
      ...mintMessages,
      nftSetUriMessage,
    ];
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee,
    });
    if (result.code !== 0) {
      const { hash } = result.data as SendTransactionErrorResponse;
      return {
        ...result,
        data: { hash },
      };
    }
    const { data, hash } = result.data as SendTransactionSuccessResponse<
      string[]
    >;
    if (data === null || !Array.isArray(data) || data.length < 4) {
      return {
        ...result,
        data: {
          hash: hash,
          tokenA,
          tokenB,
          tokenAAmount: "0",
          tokenBAmount: "0",
        },
      };
    }
    const resultTokenAAmount = makeDisplayTokenAmount(tokenA, data[2]) || 0;
    const resultTokenBAmount = makeDisplayTokenAmount(tokenA, data[3]) || 0;
    return {
      ...result,
      data: {
        hash: hash,
        tokenA,
        tokenB,
        tokenAAmount: resultTokenAAmount.toString(),
        tokenBAmount: resultTokenBAmount.toString(),
      },
    };
  };

  addLiquidity = async (
    request: AddLiquidityRequest,
  ): Promise<
    WalletResponse<AddLiquiditySuccessResponse | AddLiquidityFailedResponse>
  > => {
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

    const tokenAPath = toNativePath(tokenA.path);
    const tokenBPath = toNativePath(tokenB.path);

    const tokenAWrappedPath = tokenA.wrappedPath || checkGnotPath(tokenA.path);
    const tokenBWrappedPath = tokenB.wrappedPath || checkGnotPath(tokenB.path);

    // When GNOT, make a send to the pool contract.
    const sendAmount: string | null = isWrapped(tokenAWrappedPath)
      ? tokenAAmountRaw
      : isWrapped(tokenBWrappedPath)
      ? tokenBAmountRaw
      : null;

    const approveMessages: TransactionMessage[] = [];

    if (BigNumber(tokenAAmountRaw).isGreaterThan(0)) {
      approveMessages.push(
        PoolRepositoryImpl.makeApproveTokenMessage(
          tokenAWrappedPath,
          tokenAAmountRaw,
          caller,
        ),
      );
    }

    if (BigNumber(tokenBAmountRaw).isGreaterThan(0)) {
      approveMessages.push(
        PoolRepositoryImpl.makeApproveTokenMessage(
          tokenBWrappedPath,
          tokenBAmountRaw,
          caller,
        ),
      );
    }

    if ([tokenAPath, tokenBPath].includes(GNOT_TOKEN.path)) {
      approveMessages.push(
        makeApproveMessage(
          WRAPPED_GNOT_PATH,
          [PACKAGE_POSITION_ADDRESS, sendAmount || "0"],
          caller,
        ),
      );
    }

    // Make mint transaction message
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
      slippage,
      caller,
      sendAmount,
    );
    const mintMessages = [mintMessage];

    const nftSetUriMessage = makeNFTSetTokenUri(caller);

    const messages = [...approveMessages, ...mintMessages, nftSetUriMessage];

    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee,
    });

    if (result.code !== 0) {
      const { hash } = result.data as SendTransactionErrorResponse;
      return {
        ...result,
        data: { hash },
      };
    }

    const { data, hash } = result.data as SendTransactionSuccessResponse<
      string[]
    >;
    if (data === null || !Array.isArray(data) || data.length < 4) {
      return {
        ...result,
        data: {
          hash: hash,
          tokenA,
          tokenB,
          tokenAAmount: "0",
          tokenBAmount: "0",
        },
      };
    }
    const resultTokenAAmount = makeDisplayTokenAmount(tokenA, data[2]) || 0;
    const resultTokenBAmount = makeDisplayTokenAmount(tokenA, data[3]) || 0;
    return {
      ...result,
      data: {
        hash: hash,
        tokenA,
        tokenB,
        tokenAAmount: resultTokenAAmount.toString(),
        tokenBAmount: resultTokenBAmount.toString(),
      },
    };
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

    const GNS_DEPOSIT_AMOUNT = 1_000_000_000;

    const messages = [];
    const tokenPath = checkGnotPath(rewardToken.path);
    if (tokenPath === GNS_TOKEN_PATH) {
      messages.push(
        makeStakerApproveMessage(
          tokenPath,
          BigNumber(rewardAmountRaw).plus(GNS_DEPOSIT_AMOUNT).toString(),
          address,
        ),
      );
    } else {
      messages.push(
        makeStakerApproveMessage(tokenPath, rewardAmountRaw, address),
      );
      messages.push(
        makeStakerApproveMessage(
          GNS_TOKEN_PATH,
          GNS_DEPOSIT_AMOUNT.toString(),
          address,
        ),
      );
    }
    messages.push(
      makeCreateIncentiveMessage(
        poolPath,
        tokenPath,
        rewardAmountRaw,
        startTime,
        endTime,
        address,
        isGNOTPath(tokenPath),
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
    const tokenPath = checkGnotPath(rewardToken.path);

    if (isGNOTPath(tokenPath)) {
      messages.push(makeStakerApproveMessage(tokenPath, tokenPath, address));
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
    startPriceStr: string,
    caller: string,
  ) {
    const tokenAPath = tokenA.wrappedPath || tokenA.path;
    const tokenBPath = tokenB.wrappedPath || tokenB.path;
    const fee = `${SwapFeeTierInfoMap[feeTier].fee}`;
    const startPrice = BigNumber(startPriceStr).toNumber();

    /**
     * If the token path pairs are out of order, adjust the price and token order.
     */
    const isOrdered = isOrderedTokenPaths(tokenAPath, tokenBPath);
    if (!isOrdered) {
      const reverseStartPriceSqrt =
        startPrice !== 0 ? tickToSqrtPriceX96(priceToTick(1 / startPrice)) : 0;

      return {
        caller,
        send: "",
        pkg_path: POOL_PATH,
        func: "CreatePool",
        args: [tokenBPath, tokenAPath, fee, reverseStartPriceSqrt.toString()],
      };
    }

    const startPriceSqrt = tickToSqrtPriceX96(priceToTick(startPrice));

    return {
      caller,
      send: "",
      pkg_path: POOL_PATH,
      func: "CreatePool",
      args: [tokenAPath, tokenBPath, fee, startPriceSqrt.toString()],
    };
  }

  private static makeApproveGnosTokenMessage(amount: string, caller: string) {
    return this.makeApproveTokenMessage(GNS_TOKEN_PATH, amount, caller);
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
