import { getGRC20Allowance } from "@common/clients/gno-provider";
import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import {
  SendTransactionResponse,
  SendTransactionSuccessResponse,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import { makeNFTSetTokenUri } from "@common/clients/wallet-client/transaction-messages/position";
import { CommonError } from "@common/errors";
import { PoolError } from "@common/errors/pool";
import { DEFAULT_GAS_FEE } from "@common/values";
import { PACKAGE_POOL_PATH, PACKAGE_STAKER_PATH } from "@constants/environment.constant";
import { GnoProvider } from "@gnolang/gno-js-client";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolRPCMapper } from "@models/pool/mapper/pool-rpc-mapper";
import { PoolStakingMapper } from "@models/pool/mapper/pool-staking-mapper";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import { IncentivizePoolModel, PoolModel } from "@models/pool/pool-model";
import { PoolStakingModel } from "@models/pool/pool-staking";
import { evaluateExpressionToNumber, evaluateExpressionToObject, makeABCIParams } from "@utils/rpc-utils";
import { withSocialWalletApproval } from "@utils/transaction-utils";
import { PoolListResponse, PoolRepository, PoolResponse } from ".";
import {
  makeCreateExternalIncentiveMessageWithApproves,
  makeCreatePoolMessageWithApproves,
  makePositionMintMessageWithApproves,
  makeRemoveExternalIncentiveMessageWithApproves,
} from "./pool.message";
import { AddLiquidityRequest } from "./request/add-liquidity-request";
import { CreateExternalIncentiveRequest } from "./request/create-external-incentive-request";
import { CreatePoolRequest } from "./request/create-pool-request";
import { RemoveExternalIncentiveRequest } from "./request/remove-external-incentive-request";
import { AddLiquidityFailedResponse, AddLiquiditySuccessResponse } from "./response/add-liquidity-response";
import { CreatePoolFailedResponse, CreatePoolSuccessResponse } from "./response/create-pool-response";
import { PoolRPCResponse } from "./response/pool-rpc-response";
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

      const response = await (await this.rpcProvider.getStatus()).sync_info.latest_block_height;

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

  getPoolStakingList = async (poolPath: string): Promise<PoolStakingModel[]> => {
    if (!this.networkClient) {
      return [];
    }
    const response = await this.networkClient.get<{
      data: PoolStakingResponse[];
    }>({
      url: `/staking/${poolPath}`,
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
      url: `/staking/?provider=${address}`,
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

  getIncentivizePools = async (): Promise<IncentivizePoolModel[]> => {
    if (!this.networkClient) {
      return [];
    }
    const response = await this.networkClient.get<PoolListResponse>({
      url: "/incentivize/pools",
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
        url: `/pools/${encodeURIComponent(poolPath)}/bins?bins=${count || 40}`,
      })
      .then(response => response.data.data);
  };

  getPoolDetailRPCByPoolPath = async (poolPath: string): Promise<PoolDetailRPCModel | null> => {
    try {
      const poolPackagePath = PACKAGE_POOL_PATH;

      if (!poolPackagePath || !this.rpcProvider) {
        throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
      }

      const param = makeABCIParams("ApiGetPool", [poolPath]);
      const res = await this.rpcProvider.evaluateExpression(poolPackagePath, param);
      const responseData = evaluateExpressionToObject<{
        response: PoolRPCResponse;
      }>(res);

      return responseData ? PoolRPCMapper.detailFrom(responseData.response) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  createPool = async (
    request: CreatePoolRequest,
  ): Promise<WalletResponse<CreatePoolSuccessResponse | CreatePoolFailedResponse>> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { caller } = request;

    /**
     * Create GNS Token Approve for pool create fee
     * Add Create Pool message
     */
    const createPoolMessages = await makeCreatePoolMessageWithApproves(request, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    /**
     * Add Position Mint message
     */
    const mintMessages = await makePositionMintMessageWithApproves(request, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const nftSetUriMessage = makeNFTSetTokenUri(caller);

    const messages = [...createPoolMessages, ...mintMessages, nftSetUriMessage];

    return withSocialWalletApproval(this.walletClient, messages, () => {
      return this.walletClient!.sendTransaction({
        messages,
        gasFee: DEFAULT_GAS_FEE,
        memo: "",
      });
    });
  };

  addLiquidity = async (
    request: AddLiquidityRequest,
  ): Promise<WalletResponse<AddLiquiditySuccessResponse | AddLiquidityFailedResponse>> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { caller } = request;

    /**
     * Add Position Mint message
     */
    const mintMessages = await makePositionMintMessageWithApproves(request, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const nftSetUriMessage = makeNFTSetTokenUri(caller);

    const messages = [...mintMessages, nftSetUriMessage];

    return withSocialWalletApproval(this.walletClient, messages, () => {
      return this.walletClient!.sendTransaction({
        messages,
        gasFee: DEFAULT_GAS_FEE,
        memo: "",
      });
    });
  };

  createExternalIncentive = async (
    request: CreateExternalIncentiveRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>> | null> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const address = await this.getAddress();

    /**
     * Add create external incentive message
     */
    const messages = await makeCreateExternalIncentiveMessageWithApproves(
      { ...request, caller: address },
      (packagePath, owner, spender) => getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const response = await this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
    return response;
  };

  removeExternalIncentive = async (request: RemoveExternalIncentiveRequest): Promise<string | null> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const address = await this.getAddress();

    /**
     * Add remove external incentive message
     */
    const messages = await makeRemoveExternalIncentiveMessageWithApproves(
      {
        ...request,
        caller: address,
      },
      (packagePath, owner, spender) => getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const response = await this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
    if (response.code !== 0 || !response.data) {
      throw new PoolError("FAILED_TO_CREATE_INCENTIVE");
    }
    const data = response?.data as SendTransactionSuccessResponse<string[]>;
    return data?.hash || null;
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
