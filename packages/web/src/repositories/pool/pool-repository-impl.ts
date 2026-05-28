import { getGRC20Allowance } from "@common/clients/gno-provider";
import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { SendTransactionResponse, SendTransactionSuccessResponse, WalletResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { PoolError } from "@common/errors/pool";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED, DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT } from "@common/values";
import { PACKAGE_POOL_PATH, PACKAGE_STAKER_PATH } from "@constants/environment.constant";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import { GnoProvider } from "@gnolang/gno-js-client";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolStakingMapper } from "@models/pool/mapper/pool-staking-mapper";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolLiquidityTickModel } from "@models/pool/pool-liquidity-model";
import { IncentivizePoolModel, PoolModel } from "@models/pool/pool-model";
import { PoolStakingModel } from "@models/pool/pool-staking";
import {
  evaluateExpressionToNumber,
  evaluateExpressionToObject,
  evaluateExpressionToStrings,
  evaluateExpressionToUint256,
  makeABCIParams,
} from "@utils/rpc-utils";
import { generateSendTransactionParams, withTransactionGuard } from "@utils/transaction-utils";
import { PoolListResponse, PoolPricesResponse, PoolRepository, PoolResponse } from ".";
import {
  makeCollectExternalIncentivePenaltyMessageWithApproves,
  makeCreateExternalIncentiveMessageWithApproves,
  makeCreatePoolMessageWithApproves,
  makePositionMintMessageWithApproves,
  makeRemoveExternalIncentiveMessageWithApproves,
} from "./pool.message";
import { AddLiquidityRequest } from "./request/add-liquidity-request";
import { CollectExternalIncentivePenaltyRequest } from "./request/collect-external-incentive-penalty-request";
import { CreateExternalIncentiveRequest } from "./request/create-external-incentive-request";
import { CreatePoolRequest } from "./request/create-pool-request";
import { RemoveExternalIncentiveRequest } from "./request/remove-external-incentive-request";
import { AddLiquidityFailedResponse, AddLiquiditySuccessResponse } from "./response/add-liquidity-response";
import { CreatePoolFailedResponse, CreatePoolSuccessResponse } from "./response/create-pool-response";
import { PoolLiquidityTickResponse } from "./response/pool-liquidity-ticks-response";
import { PoolStakingResponse } from "./response/pool-staking-response";

export class PoolRepositoryImpl implements PoolRepository {
  private networkClient: NetworkClient | null;
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;

  constructor(networkClient: NetworkClient | null, rpcProvider: GnoProvider | null, walletClient: WalletClient | null) {
    this.networkClient = networkClient;
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
  }

  getLatestBlockHeight = async (): Promise<string> => {
    try {
      if (!PACKAGE_POOL_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const status = await this.rpcProvider.getStatus();
      const response = status.sync_info.latest_block_height;

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
      const response = await this.rpcProvider.evaluateExpression(PACKAGE_POOL_PATH, param);

      return evaluateExpressionToNumber(response);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  getIncentiveCreationDeposit = async (): Promise<string> => {
    if (!this.networkClient) {
      return DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT;
    }

    try {
      const response = await this.networkClient.get<{
        data: { depositGnsAmount: string };
      }>({
        url: "/incentivize/deposit",
      });

      return response?.data?.data?.depositGnsAmount || DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT;
    } catch (error) {
      console.error(error);
      return DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT;
    }
  };

  getPoolStakingList = async (poolPath: string): Promise<PoolStakingModel[]> => {
    if (!this.networkClient) {
      return [];
    }
    const response = await this.networkClient.get<{
      data: PoolStakingResponse[];
    }>({
      url: `/staking/${poolPath}?all=true`,
    });
    const pools = response?.data?.data ? response.data.data.map(PoolStakingMapper.fromResponse) : [];
    return pools;
  };

  getPoolStakingListByAddress = async (address: string): Promise<PoolStakingModel[]> => {
    if (!this.networkClient) {
      return [];
    }
    const response = await this.networkClient.get<{
      data: PoolStakingResponse[];
    }>({
      url: `/staking?address=${address}`,
    });
    const pools = response?.data?.data ? response.data.data.map(PoolStakingMapper.fromResponse) : [];
    return pools;
  };

  getWithdrawalFee = async (): Promise<number> => {
    try {
      if (!PACKAGE_POOL_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetWithdrawalFee", []);
      const response = await this.rpcProvider.evaluateExpression(PACKAGE_POOL_PATH, param);

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
      const response = await this.rpcProvider.evaluateExpression(PACKAGE_STAKER_PATH, param);

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
      const response = await this.rpcProvider.evaluateExpression(PACKAGE_STAKER_PATH, param);

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
    const pools = response?.data?.data ? response.data.data.map(PoolMapper.fromResponse) : [];
    return pools;
  };

  getIncentivizePools = async (address?: string): Promise<IncentivizePoolModel[]> => {
    if (!this.networkClient) {
      return [];
    }
    const url = address
      ? `/pools?incentivized=true&address=${encodeURIComponent(address)}`
      : "/pools?incentivized=true";
    const response = await this.networkClient.get<PoolListResponse>({
      url,
    });

    const pools = response?.data?.data ? response.data.data.map(PoolMapper.toIncentivePool) : [];
    return pools;
  };

  getPoolDetailByPoolPath = async (poolPath: string): Promise<PoolDetailModel> => {
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

  getBinsOfPoolByPath = async (poolPath: string, count?: number): Promise<PoolBinModel[]> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    return this.networkClient
      .get<{ data: PoolBinModel[] }>({
        url: `/pools/${encodeURIComponent(poolPath)}/bins?binSize=${count || 40}`,
      })
      .then(response => response.data.data);
  };

  getLiquidityTicksOfPoolByPath = async (poolPath: string): Promise<PoolLiquidityTickModel[]> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    return this.networkClient
      .get<{ data: PoolLiquidityTickResponse[] }>({
        url: `/pools/${encodeURIComponent(poolPath)}/ticks`,
      })
      .then(response =>
        response.data.data.map(tick => ({
          tick: tick.tick,
          liquidityNet: tick.liquidityNet,
        })),
      );
  };

  getPoolPriceByPoolPath = async (poolPath: string, period?: CHART_DAY_SCOPE_TYPE): Promise<PoolPricesResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    return this.networkClient
      .get<{ data: PoolPricesResponse }>({
        url: `/pools/${encodeURIComponent(poolPath)}/prices?period=${period || CHART_DAY_SCOPE_TYPE["7D"]}`,
      })
      .then(response => response.data.data);
  };

  getPoolLiquidity = async (poolPath: string): Promise<string> => {
    try {
      if (!PACKAGE_POOL_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetLiquidity", [poolPath]);
      const response = await this.rpcProvider.evaluateExpression(PACKAGE_POOL_PATH, param);

      const results = evaluateExpressionToStrings(response);
      return results.length > 0 ? results[0] : "0";
    } catch (error) {
      console.error(error);
      return "0";
    }
  };

  getPoolTicks = async (
    poolPath: string,
    tickLower: number = -887272,
    tickUpper: number = 887272,
  ): Promise<number[]> => {
    try {
      if (!PACKAGE_POOL_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetInitializedTicksInRange", [poolPath, tickLower, tickUpper]);
      const response = await this.rpcProvider.evaluateExpression(PACKAGE_POOL_PATH, param);

      return evaluateExpressionToObject<number[]>(response) || [];
    } catch (error) {
      console.error(error);
      throw new PoolError("FAILED_TO_GET_TICKS");
    }
  };

  getPoolTickSpacing = async (poolPath: string): Promise<number> => {
    try {
      if (!PACKAGE_POOL_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetTickSpacing", [poolPath]);
      const response = await this.rpcProvider.evaluateExpression(PACKAGE_POOL_PATH, param);

      return evaluateExpressionToNumber(response);
    } catch (error) {
      console.error(error);
      throw new PoolError("FAILED_TO_GET_TICK_SPACING");
    }
  };

  getPoolSqrtPriceX96 = async (poolPath: string): Promise<bigint> => {
    try {
      if (!PACKAGE_POOL_PATH || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("GetSlot0SqrtPriceX96", [poolPath]);
      const response = await this.rpcProvider.evaluateExpression(PACKAGE_POOL_PATH, param);

      return evaluateExpressionToUint256(response);
    } catch (error) {
      console.error(error);
      throw new PoolError("FAILED_TO_GET_SQRT_PRICE_X96");
    }
  };

  createPool = async (
    request: CreatePoolRequest,
  ): Promise<WalletResponse<CreatePoolSuccessResponse | CreatePoolFailedResponse>> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { gasFee, gasUsed, caller, ...requests } = request;
    const makeTxMessageRequests = {
      caller,
      ...requests,
    };

    /**
     * Create GNS Token Approve for pool create fee
     * Add Create Pool message
     */
    const createPoolMessages = await makeCreatePoolMessageWithApproves(
      makeTxMessageRequests,
      (packagePath, owner, spender) => getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    /**
     * Add Position Mint message
     */
    const mintMessages = await makePositionMintMessageWithApproves(
      makeTxMessageRequests,
      (packagePath, owner, spender) => getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const messages = [...createPoolMessages, ...mintMessages];

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
      memo: "",
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  addLiquidity = async (
    request: AddLiquidityRequest,
  ): Promise<WalletResponse<AddLiquiditySuccessResponse | AddLiquidityFailedResponse>> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { gasFee, gasUsed, caller, ...requests } = request;
    const makeTxMessageRequests = {
      caller,
      ...requests,
    };

    /**
     * Add Position Mint message
     */
    const mintMessages = await makePositionMintMessageWithApproves(
      makeTxMessageRequests,
      (packagePath, owner, spender) => getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const messages = [...mintMessages];

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
      memo: "",
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  createExternalIncentive = async (
    request: CreateExternalIncentiveRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>> | null> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const address = await this.getAddress();

    const { gasFee, gasUsed, ...requests } = request;
    const makeTxMessageRequests = {
      caller: address,
      ...requests,
    };

    /**
     * Add create external incentive message
     */
    const messages = await makeCreateExternalIncentiveMessageWithApproves(
      makeTxMessageRequests,
      (packagePath, owner, spender) => getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
      memo: "",
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  removeExternalIncentive = async (request: RemoveExternalIncentiveRequest): Promise<string | null> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const address = await this.getAddress();

    const { gasFee, gasUsed, ...requests } = request;
    const makeTxMessageRequests = {
      caller: address,
      ...requests,
    };

    /**
     * Add remove external incentive message
     */
    const messages = await makeRemoveExternalIncentiveMessageWithApproves(
      makeTxMessageRequests,
      (packagePath, owner, spender) => getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
      memo: "",
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    }).then(response => {
      if (response.code !== 0 || !response.data) {
        throw new PoolError("FAILED_TO_REMOVE_INCENTIVE");
      }
      const data = response?.data as SendTransactionSuccessResponse<string[]>;
      return data?.hash || null;
    });
  };

  collectExternalIncentivePenalty = async (request: CollectExternalIncentivePenaltyRequest): Promise<string | null> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const address = await this.getAddress();

    const { gasFee, gasUsed, ...requests } = request;
    const makeTxMessageRequests = {
      caller: address,
      ...requests,
    };

    const messages = await makeCollectExternalIncentivePenaltyMessageWithApproves(
      makeTxMessageRequests,
      (packagePath, owner, spender) => getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
      memo: "",
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    }).then(response => {
      if (response.code !== 0 || !response.data) {
        throw new PoolError("FAILED_TO_COLLECT_INCENTIVE");
      }
      const data = response?.data as SendTransactionSuccessResponse<string[]>;
      return data?.hash || null;
    });
  };

  private async getAddress(): Promise<string> {
    if (!this.walletClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const address = await this.walletClient.getAddress();
    if (!address) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    return address;
  }
}
