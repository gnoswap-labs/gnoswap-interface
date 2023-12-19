import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { SendTransactionSuccessResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED } from "@common/values";
import { GnoProvider } from "@gnolang/gno-js-client";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PositionModel } from "@models/position/position-model";
import { PositionRepository } from "./position-repository";
import { ClaimAllRequest } from "./request/claim-all-request";
import { RemoveLiquidityReqeust } from "./request/remove-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";
import { PositionListResponse } from "./response";
import {
  makeApporveStakeTokenMessage,
  makeCollectRewardMessage,
  makeStakeMessage,
  makeUnstakeMessage,
} from "@common/clients/wallet-client/transaction-messages/staker";
import {
  makePositionBurnMessage,
  makePositionCollectFeeMessage,
} from "@common/clients/wallet-client/transaction-messages/position";

export class PositionRepositoryImpl implements PositionRepository {
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

  getPositionsByAddress = async (address: string): Promise<PositionModel[]> => {
    const response = await this.networkClient.get<PositionListResponse>({
      url: "/positions/" + address,
    });
    return PositionMapper.fromList(response.data);
  };

  claimAll = async (request: ClaimAllRequest): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { positions, receipient } = request;
    const messages = positions.flatMap(position => {
      const messages = [];
      const hasSwapFee =
        position.rewards.findIndex(reward => reward.rewardType === "SWAP_FEE") >
        -1;
      const hasReward =
        position.rewards.findIndex(
          reward =>
            reward.rewardType === "STAKING" || reward.rewardType === "EXTERNAL",
        ) > -1;
      if (hasSwapFee) {
        messages.push(
          makePositionCollectFeeMessage(position.lpTokenId, receipient),
        );
      }
      if (hasReward) {
        messages.push(makeCollectRewardMessage(position.lpTokenId, receipient));
      }
      return messages;
    });
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    const hash = (result.data as SendTransactionSuccessResponse)?.hash || null;
    if (!hash) {
      throw new Error(`${result}`);
    }
    return hash;
  };

  stakePositions = async (
    request: StakePositionsRequest,
  ): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenIds, caller } = request;
    const messages = lpTokenIds.flatMap(lpTokenId => [
      makeApporveStakeTokenMessage(lpTokenId, caller),
      makeStakeMessage(lpTokenId, caller),
    ]);
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    const hash = (result.data as SendTransactionSuccessResponse)?.hash || null;
    if (!hash) {
      throw new Error(JSON.stringify(result));
    }
    return hash;
  };

  unstakePositions = async (
    request: UnstakePositionsRequest,
  ): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenIds, caller } = request;
    const messages = lpTokenIds.map(lpTokenId =>
      makeUnstakeMessage(lpTokenId, caller),
    );
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    const hash = (result.data as SendTransactionSuccessResponse)?.hash || null;
    if (!hash) {
      throw new Error(`${result}`);
    }
    return hash;
  };

  removeLiquidity = async (
    request: RemoveLiquidityReqeust,
  ): Promise<string | null> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenIds, caller } = request;
    const messages = lpTokenIds.map(lpTokenId =>
      makePositionBurnMessage(lpTokenId, caller),
    );
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    const hash = (result.data as SendTransactionSuccessResponse)?.hash || null;
    if (!hash) {
      throw new Error(`${result}`);
    }
    return hash;
  };
}
