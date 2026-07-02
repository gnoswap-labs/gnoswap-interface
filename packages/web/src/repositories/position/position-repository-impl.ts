import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { SendTransactionResponse, WalletResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED } from "@common/values";
import { PACKAGE_STAKER_PATH } from "@constants/environment.constant";
import { PositionHistoryMapper } from "@models/position/mapper/position-history-mapper";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { PositionModel } from "@models/position/position-model";
import { ActivityResponse } from "@repositories/activity/responses/activity-responses";
import { evaluateExpressionToNumber, makeABCIParams } from "@utils/rpc-utils";

import { getGRC20Allowance } from "@common/clients/gno-provider";
import { GnoProvider } from "@gnolang/gno-js-client";
import { PositionRepository } from "./position-repository";
import {
  makeClaimAllMessageWithApprovesByIds,
  makeClaimMessageWithApproves,
  makeDecreaseLiquidityMessagesWithApproves,
  makeIncreaseLiquidityMessagesWithApproves,
  makeRemoveLiquidityMessagesWithApproves,
  makeRepositionLiquidityMessagesWithApproves,
  makeStakePositionsMessagesWithApproves,
  makeUnStakePositionsMessagesWithApproves,
} from "./position.message";
import { DecreaseLiquidityRequest, IncreaseLiquidityRequest, RepositionLiquidityRequest } from "./request";
import { ClaimAllRequest } from "./request/claim-all-request";
import { RemoveLiquidityRequest } from "./request/remove-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";
import {
  DecreaseLiquidityFailedResponse,
  DecreaseLiquiditySuccessResponse,
  IncreaseLiquidityFailedResponse,
  IncreaseLiquiditySuccessResponse,
  PositionListResponse,
  PositionResponse,
  PositionRewardsResponse,
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse,
} from "./response";
import { ClaimRequest } from "./request/claim-request";
import { withTransactionGuard, generateSendTransactionParams } from "@utils/transaction-utils";

export class PositionRepositoryImpl implements PositionRepository {
  private networkClient: NetworkClient | null;
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;

  constructor(networkClient: NetworkClient | null, rpcProvider: GnoProvider | null, walletClient: WalletClient | null) {
    this.networkClient = networkClient;
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
  }

  getPositionHistory = async (lpTokenId: string): Promise<IPositionHistoryModel[]> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<{
      data: ActivityResponse;
    }>({
      url: "/positions/" + lpTokenId + "/history",
    });
    return PositionHistoryMapper.fromList(response.data.data);
  };

  getPositionById = async (lpTokenId: string): Promise<PositionModel> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<{
      data: PositionResponse;
    }>({
      url: "/positions/" + lpTokenId,
    });
    return PositionMapper.from(response.data.data);
  };

  getPositionsByAddress = async (
    address: string,
    options?: {
      poolPath?: string;
      page?: number;
      limit?: number;
      /** API option: when true, include closed positions in the server response. */
      withClosed?: boolean;
      withAvailableStake?: boolean;
    },
  ): Promise<{ positions: PositionModel[]; totalCount: number }> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const queries = [
      options?.poolPath !== undefined ? `poolPath=${options.poolPath}` : "",
      options?.page !== undefined ? `page=${options.page}` : "",
      options?.limit !== undefined ? `limit=${options.limit}` : "",
      options?.withClosed !== undefined ? `withClosed=${options.withClosed}` : "",
      options?.withAvailableStake !== undefined ? `withAvailableStake=${options.withAvailableStake}` : "",
    ];
    const queryString = queries.filter(item => !!item).join("&");

    const response = await this.networkClient.get<{
      data: PositionListResponse;
    }>({
      url: "/users/" + address + "/position" + (queryString ? `?${queryString}` : ""),
    });

    if (!response?.data?.data) {
      return { positions: [], totalCount: 0 };
    }

    const { positions, totalCount } = response.data.data;
    return {
      positions: PositionMapper.fromList(positions),
      totalCount,
    };
  };

  getPositionRewardsByAddress = async (address: string): Promise<PositionRewardsResponse | null> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient.get<{
      data: PositionRewardsResponse;
    }>({
      url: "/users/" + address + "/position/reward",
    });

    return response?.data?.data ?? null;
  };

  sendClaim = async (request: ClaimRequest): Promise<WalletResponse<SendTransactionResponse<string[] | null>>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    if (this.rpcProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { gasFee, gasUsed, position, recipient } = request;
    const makeTxMessageRequests = {
      caller: recipient,
      position,
    };

    const messages = await makeClaimMessageWithApproves(makeTxMessageRequests, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
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

  sendClaimAll = async (
    request: ClaimAllRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    if (this.rpcProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const {
      gasFee,
      gasUsed,
      swapFeeTokenPaths,
      hasGnotStakingReward,
      positionsWithSwapFee,
      positionsWithStakingReward,
      recipient,
    } = request;
    const makeTxMessageRequests = {
      caller: recipient,
      swapFeeTokenPaths,
      hasGnotStakingReward,
      positionsWithSwapFee,
      positionsWithStakingReward,
    };

    const messages = await makeClaimAllMessageWithApprovesByIds(makeTxMessageRequests, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
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

  stakePositions = async (
    request: StakePositionsRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { gasFee, gasUsed, ...requests } = request;

    const messages = makeStakePositionsMessagesWithApproves({ ...requests });

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  unstakePositions = async (
    request: UnstakePositionsRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    if (this.rpcProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { gasFee, gasUsed, ...requests } = request;

    const messages = await makeUnStakePositionsMessagesWithApproves({ ...requests }, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  increaseLiquidity = async (
    request: IncreaseLiquidityRequest,
  ): Promise<WalletResponse<IncreaseLiquiditySuccessResponse | IncreaseLiquidityFailedResponse | null>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    if (this.rpcProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { gasFee, gasUsed, ...requests } = request;

    const messages = await makeIncreaseLiquidityMessagesWithApproves({ ...requests }, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  decreaseLiquidity = async (
    request: DecreaseLiquidityRequest,
  ): Promise<WalletResponse<DecreaseLiquiditySuccessResponse | DecreaseLiquidityFailedResponse | null>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    if (this.rpcProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { gasFee, gasUsed, ...requests } = request;

    const messages = await makeDecreaseLiquidityMessagesWithApproves({ ...requests }, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  repositionLiquidity = async (
    request: RepositionLiquidityRequest,
  ): Promise<WalletResponse<RepositionLiquiditySuccessResponse | RepositionLiquidityFailedResponse>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    if (this.rpcProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { gasFee, gasUsed, ...requests } = request;

    const messages = await makeRepositionLiquidityMessagesWithApproves({ ...requests }, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  removeLiquidity = async (
    request: RemoveLiquidityRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    if (this.rpcProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { gasFee, gasUsed, ...requests } = request;

    const messages = await makeRemoveLiquidityMessagesWithApproves({ ...requests }, (packagePath, owner, spender) =>
      getGRC20Allowance(this.rpcProvider!, packagePath, owner, spender),
    );

    const gasWanted = Number(gasUsed) || DEFAULT_GAS_WANTED;

    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      gasWanted: Number(gasWanted.toFixed()),
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
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
}
