import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import {
  SendTransactionResponse,
  SendTransactionSuccessResponse,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED } from "@common/values";
import { GnoProvider } from "@gnolang/gno-js-client";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PositionModel } from "@models/position/position-model";
import { PositionRepository } from "./position-repository";
import { ClaimAllRequest } from "./request/claim-all-request";
import { RemoveLiquidityRequest } from "./request/remove-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";
import {
  DecreaseLiquidityResponse,
  IncreaseLiquidityResponse,
  PositionBinResponse,
  PositionListResponse,
} from "./response";
import {
  makeApporveStakeTokenMessage,
  makeCollectRewardMessage,
  makeStakeMessage,
  makeUnstakeMessage,
} from "@common/clients/wallet-client/transaction-messages/staker";
import {
  makePositionDecreaseLiquidityMessage,
  makePositionCollectFeeMessage,
  makePositionIncreaseLiquidityMessage,
} from "@common/clients/wallet-client/transaction-messages/position";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { PositionHistoryMapper } from "@models/position/mapper/position-history-mapper";
import { IPositionHistoryResponse } from "./response/position-history-response";
import {
  PACKAGE_POOL_ADDRESS,
  PACKAGE_STAKER_ADDRESS,
  TransactionMessage,
  WRAPPED_GNOT_PATH,
  makeApproveMessage,
} from "@common/clients/wallet-client/transaction-messages";
import { MAX_INT64, MAX_UINT64 } from "@utils/math.utils";
import { DecreaseLiquidityRequest, IncreaseLiquidityRequest } from "./request";
import { checkGnotPath, isGNOTPath } from "@utils/common";
import { makeRawTokenAmount } from "@utils/token-utils";
import { makeStakerApproveMessage } from "@common/clients/wallet-client/transaction-messages/pool";
import { PositionBinModel } from "@models/position/position-bin-model";
import { PositionBinMapper } from "@models/position/mapper/position-bin-mapper";

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

  getPositionHistory = async (
    lpTokenId: string,
  ): Promise<IPositionHistoryModel[]> => {
    const response = await this.networkClient.get<{
      data: IPositionHistoryResponse[];
    }>({
      url: "/positions/" + lpTokenId + "/history",
    });
    return PositionHistoryMapper.fromList(response.data.data);
  };

  getPositionBins = async (
    lpTokenId: string,
    count: 20 | 40,
  ): Promise<PositionBinModel[]> => {
    const response = await this.networkClient.get<{
      data: PositionBinResponse[];
    }>({
      url: "/positions/" + lpTokenId + `/bins?bins=${count}`,
    });
    return PositionBinMapper.fromList(response.data.data);
  };

  getPositionsByAddress = async (address: string): Promise<PositionModel[]> => {
    const response = await this.networkClient.get<{
      data: PositionListResponse;
    }>({
      url: "/users/" + address + "/position",
    });
    return PositionMapper.fromList(response.data.data);
  };

  claimAll = async (
    request: ClaimAllRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { positions, recipient } = request;
    const messages = positions.flatMap(position => {
      const hasSwapFee =
        position.reward.findIndex(reward => reward.rewardType === "SWAP_FEE") >
        -1;
      const hasReward =
        position.reward.findIndex(
          reward =>
            reward.rewardType === "STAKING" || reward.rewardType === "EXTERNAL",
        ) > -1;

      const approveMessages = [];
      const collectMessages = [];
      const tokenPaths = position.poolPath.split(":");
      if (hasSwapFee && tokenPaths.length === 3) {
        approveMessages.push(
          makeApproveMessage(
            tokenPaths[0],
            [PACKAGE_POOL_ADDRESS, MAX_UINT64.toString()],
            recipient,
          ),
        );
        approveMessages.push(
          makeApproveMessage(
            tokenPaths[1],
            [PACKAGE_POOL_ADDRESS, MAX_UINT64.toString()],
            recipient,
          ),
        );
        collectMessages.push(
          makePositionCollectFeeMessage(position.lpTokenId, recipient),
        );
      }
      if (hasReward) {
        // Reward token approve to Pool and Staker(When GNOT token)
        const rewardTokenMessages = position.reward.flatMap(reward => {
          const approveMessages: TransactionMessage[] = [];
          approveMessages.push(
            makeApproveMessage(
              checkGnotPath(reward.rewardToken.path),
              [PACKAGE_POOL_ADDRESS, MAX_UINT64.toString()],
              recipient,
            ),
          );

          if (reward.rewardToken.path === WRAPPED_GNOT_PATH) {
            approveMessages.push(
              makeApproveMessage(
                checkGnotPath(WRAPPED_GNOT_PATH),
                [PACKAGE_STAKER_ADDRESS, MAX_UINT64.toString()],
                recipient,
              ),
            );
          }
          return approveMessages;
        });
        approveMessages.push(...rewardTokenMessages);
        collectMessages.push(
          makeCollectRewardMessage(position.lpTokenId, recipient),
        );
      }
      const messages = [...approveMessages, ...collectMessages];
      return messages;
    });
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    return result as WalletResponse<SendTransactionResponse<string[] | null>>;
  };

  stakePositions = async (
    request: StakePositionsRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>>> => {
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
    return result as WalletResponse<SendTransactionResponse<string[] | null>>;
  };

  unstakePositions = async (
    request: UnstakePositionsRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { positions, caller } = request;
    const messages: TransactionMessage[] = [];

    const hasGNOTToken = positions.find(
      position =>
        isGNOTPath(position.pool.tokenA.path) ||
        isGNOTPath(position.pool.tokenB.path),
    );

    if (hasGNOTToken) {
      messages.push(
        makeStakerApproveMessage(
          WRAPPED_GNOT_PATH,
          MAX_UINT64.toString(),
          caller,
        ),
      );
    }

    messages.push(
      ...positions.map(position =>
        makeUnstakeMessage(position.lpTokenId, caller),
      ),
    );
    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    return result as WalletResponse<SendTransactionResponse<string[] | null>>;
  };

  increaseLiquidity = async (
    request: IncreaseLiquidityRequest,
  ): Promise<WalletResponse<IncreaseLiquidityResponse | null>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenId, tokenA, tokenB, tokenAAmount, tokenBAmount, caller } =
      request;

    const tokenAWrappedPath = tokenA.wrappedPath || checkGnotPath(tokenA.path);
    const tokenBWrappedPath = tokenB.wrappedPath || checkGnotPath(tokenB.path);

    const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
    const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";

    const sendAmount =
      tokenAWrappedPath === WRAPPED_GNOT_PATH
        ? tokenAAmountRaw
        : tokenBWrappedPath
          ? tokenBAmountRaw
          : null;

    // Make Approve messages that can be managed by a Pool package of tokens.
    const approveMessages = [
      makeApproveMessage(
        tokenAWrappedPath,
        [PACKAGE_POOL_ADDRESS, tokenAAmountRaw],
        caller,
      ),
      makeApproveMessage(
        tokenBWrappedPath,
        [PACKAGE_POOL_ADDRESS, tokenBAmountRaw],
        caller,
      ),
    ];

    const increaseLiquidityMessage = makePositionIncreaseLiquidityMessage(
      lpTokenId,
      tokenAAmountRaw,
      tokenBAmountRaw,
      "0",
      "0",
      caller,
      sendAmount,
    );

    const messages = [...approveMessages, increaseLiquidityMessage];

    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });

    const result = response as WalletResponse;
    if (result.code !== 0 || !result.data) {
      return {
        ...result,
        data: null,
      };
    }

    const data = (
      result.data as SendTransactionSuccessResponse<string[] | null>
    ).data;
    if (!data || data.length < 5) {
      return {
        ...result,
        data: null,
      };
    }

    return {
      ...result,
      data: {
        tokenID: data[0],
        liquidity: data[1],
        tokenAAmount: data[2],
        tokenBAmount: data[3],
        poolPath: data[4],
      },
    };
  };

  decreaseLiquidity = async (
    request: DecreaseLiquidityRequest,
  ): Promise<WalletResponse<DecreaseLiquidityResponse | null>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenId, tokenA, tokenB, decreaseRatio, caller } = request;

    const tokenAWrappedPath = tokenA.wrappedPath || checkGnotPath(tokenA.path);
    const tokenBWrappedPath = tokenB.wrappedPath || checkGnotPath(tokenB.path);

    // Make Approve messages that can be managed by a Pool package of tokens.
    const approveMessages = [
      makeApproveMessage(
        tokenAWrappedPath,
        [PACKAGE_POOL_ADDRESS, MAX_INT64.toString()],
        caller,
      ),
      makeApproveMessage(
        tokenBWrappedPath,
        [PACKAGE_POOL_ADDRESS, MAX_INT64.toString()],
        caller,
      ),
    ];

    const decreaseLiquidityMessage = makePositionDecreaseLiquidityMessage(
      lpTokenId,
      decreaseRatio,
      true,
      caller,
    );

    const messages = [...approveMessages, decreaseLiquidityMessage];

    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });

    const result = response as WalletResponse;
    if (result.code !== 0 || !result.data) {
      return {
        ...result,
        data: null,
      };
    }

    const data = (
      result.data as SendTransactionSuccessResponse<string[] | null>
    ).data;
    if (!data || data.length < 7) {
      return {
        ...result,
        data: null,
      };
    }

    return {
      ...result,
      data: {
        tokenID: data[0],
        removedLiquidity: data[1],
        collectedTokenAFee: data[2],
        collectedTokenBFee: data[3],
        removedTokenAAmount: data[4],
        removedTokenBAmount: data[5],
        poolPath: data[6],
      },
    };
  };

  removeLiquidity = async (
    request: RemoveLiquidityRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenIds, tokenPaths, caller } = request;
    const decreaseLiquidityRatio = 100;

    // Make Approve messages that can be managed by a Pool package of tokens.
    const approveMessages = tokenPaths.map(tokenPath =>
      makeApproveMessage(
        checkGnotPath(tokenPath),
        [PACKAGE_POOL_ADDRESS, MAX_INT64.toString()],
        caller,
      ),
    );

    // Make Decrease liquidity messages
    const decreaseLiquidityMessages = lpTokenIds.map(lpTokenId =>
      makePositionDecreaseLiquidityMessage(
        lpTokenId,
        decreaseLiquidityRatio,
        true,
        caller,
      ),
    );

    const messages = [...approveMessages, ...decreaseLiquidityMessages];

    const result = await this.walletClient.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      gasWanted: DEFAULT_GAS_WANTED,
    });
    return result as WalletResponse<SendTransactionResponse<string[] | null>>;
  };
}
