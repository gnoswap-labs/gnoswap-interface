import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import {
  SendTransactionErrorResponse,
  SendTransactionResponse,
  SendTransactionSuccessResponse,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import {
  makeApproveMessage, TransactionMessage
} from "@common/clients/wallet-client/transaction-messages";
import { makeStakerApproveMessage } from "@common/clients/wallet-client/transaction-messages/pool";
import {
  makePositionCollectFeeMessage,
  makePositionDecreaseLiquidityMessage,
  makePositionIncreaseLiquidityMessage,
  makePositionRepositionLiquidityMessage,
} from "@common/clients/wallet-client/transaction-messages/position";
import {
  makeApporveStakeTokenMessage,
  makeCollectRewardMessage,
  makeStakeMessage,
  makeUnstakeMessage,
} from "@common/clients/wallet-client/transaction-messages/staker";
import { CommonError } from "@common/errors";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED } from "@common/values";
import {
  PACKAGE_POOL_ADDRESS,
  PACKAGE_POSITION_ADDRESS,
  PACKAGE_STAKER_ADDRESS,
  PACKAGE_STAKER_PATH,
  WRAPPED_GNOT_PATH,
} from "@constants/environment.constant";
import { GnoProvider } from "@gnolang/gno-js-client";
import { PositionBinMapper } from "@models/position/mapper/position-bin-mapper";
import { PositionHistoryMapper } from "@models/position/mapper/position-history-mapper";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PositionBinModel } from "@models/position/position-bin-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { PositionModel } from "@models/position/position-model";
import { ActivityResponse } from "@repositories/activity/responses/activity-responses";
import { checkGnotPath, isGNOTPath } from "@utils/common";
import { MAX_INT64, MAX_UINT64 } from "@utils/math.utils";
import { evaluateExpressionToNumber, makeABCIParams } from "@utils/rpc-utils";
import { makeRawTokenAmount } from "@utils/token-utils";

import { PositionRepository } from "./position-repository";
import {
  DecreaseLiquidityRequest,
  IncreaseLiquidityRequest,
  RepositionLiquidityRequest,
} from "./request";
import { ClaimAllRequest } from "./request/claim-all-request";
import { RemoveLiquidityRequest } from "./request/remove-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";
import {
  DecreaseLiquidityFailedResponse,
  DecreaseLiquiditySuccessResponse,
  IncreaseLiquidityFailedResponse,
  IncreaseLiquiditySuccessResponse,
  PositionBinResponse,
  PositionListResponse,
  PositionResponse,
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse,
} from "./response";

export class PositionRepositoryImpl implements PositionRepository {
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

  getPositionHistory = async (
    lpTokenId: string,
  ): Promise<IPositionHistoryModel[]> => {
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

  getPositionBins = async (
    lpTokenId: string,
    count: 20 | 40,
  ): Promise<PositionBinModel[]> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<{
      data: PositionBinResponse[];
    }>({
      url: "/positions/" + lpTokenId + `/bins?bins=${count}`,
    });
    return PositionBinMapper.fromList(response.data.data);
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
      isClosed?: boolean;
      poolPath?: string;
    },
  ): Promise<PositionModel[]> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const queries = [
      options?.isClosed !== undefined ? `closed=${options.isClosed}` : "",
      options?.poolPath !== undefined ? `poolPath=${options.poolPath}` : "",
    ];
    const queryString = queries.filter(item => !!item).join("&");

    const response = await this.networkClient.get<{
      data: PositionListResponse;
    }>({
      url:
        "/users/" +
        address +
        "/position" +
        (queryString ? `?${queryString}` : ""),
    });
    if (!response?.data?.data) {
      return [];
    }
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
        position.reward.findIndex(reward =>
          ["INTERNAL", "EXTERNAL"].includes(reward.rewardType),
        ) > -1;

      const approveMessages = [];
      const collectMessages = [];
      const tokenPaths = position.poolPath.split(":");
      const includedTokenPaths: string[] = [...tokenPaths];
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
          const rewardTokenWrappedPath = checkGnotPath(reward.rewardToken.path);
          if (includedTokenPaths.includes(rewardTokenWrappedPath)) {
            return [];
          }

          const approveMessages: TransactionMessage[] = [];
          approveMessages.push(
            makeApproveMessage(
              rewardTokenWrappedPath,
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

          includedTokenPaths.push(rewardTokenWrappedPath);
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
    const { positions, isGetWGNOT, caller } = request;
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

    const includedTokenPaths: string[] = [];

    // Reward token approve to Pool and Staker(When GNOT token)
    const collectRewardApproveMessages = positions.flatMap(position =>
      position.reward.flatMap(reward => {
        const rewardTokenWrappedPath = checkGnotPath(reward.rewardToken.path);
        if (includedTokenPaths.includes(rewardTokenWrappedPath)) {
          return [];
        }

        const messages: TransactionMessage[] = [];
        messages.push(
          makeApproveMessage(
            rewardTokenWrappedPath,
            [PACKAGE_POOL_ADDRESS, MAX_UINT64.toString()],
            caller,
          ),
        );

        if (reward.rewardToken.path === WRAPPED_GNOT_PATH) {
          messages.push(
            makeApproveMessage(
              checkGnotPath(WRAPPED_GNOT_PATH),
              [PACKAGE_STAKER_ADDRESS, MAX_UINT64.toString()],
              caller,
            ),
          );
        }
        includedTokenPaths.push(rewardTokenWrappedPath);
        return messages;
      }),
    );

    messages.push(
      ...collectRewardApproveMessages,
      ...positions.map(position =>
        makeUnstakeMessage(position.lpTokenId, isGetWGNOT, caller),
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
  ): Promise<
    WalletResponse<
      IncreaseLiquiditySuccessResponse | IncreaseLiquidityFailedResponse | null
    >
  > => {
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
      request.slippage,
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
      const { hash } = result.data as SendTransactionErrorResponse;
      return {
        ...result,
        data: { hash },
      };
    }

    const { data, hash } = result.data as SendTransactionSuccessResponse<
      string[] | null
    >;
    if (!data || data.length < 5) {
      return {
        ...result,
        data: null,
      };
    }

    return {
      ...result,
      data: {
        hash: hash,
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
  ): Promise<
    WalletResponse<
      DecreaseLiquiditySuccessResponse | DecreaseLiquidityFailedResponse | null
    >
  > => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const {
      lpTokenId,
      tokenA,
      tokenB,
      tokenAAmount,
      tokenBAmount,
      slippage,
      decreaseRatio,
      caller,
      existWrappedToken,
    } = request;

    const tokenAWrappedPath = tokenA.wrappedPath || checkGnotPath(tokenA.path);
    const tokenBWrappedPath = tokenB.wrappedPath || checkGnotPath(tokenB.path);

    const tokenAAmountRaw = makeRawTokenAmount(tokenA, tokenAAmount) || "0";
    const tokenBAmountRaw = makeRawTokenAmount(tokenB, tokenBAmount) || "0";

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

    // If the GNOT token is included, the Position package must include the token approve.
    if (isGNOTPath(tokenAWrappedPath) || isGNOTPath(tokenBWrappedPath)) {
      approveMessages.push(
        makeApproveMessage(
          WRAPPED_GNOT_PATH,
          [PACKAGE_POSITION_ADDRESS, MAX_INT64.toString()],
          caller,
        ),
      );
    }

    const decreaseLiquidityMessage = makePositionDecreaseLiquidityMessage(
      lpTokenId,
      decreaseRatio,
      tokenAAmountRaw,
      tokenBAmountRaw,
      slippage,
      existWrappedToken,
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
      const { hash } = result.data as SendTransactionErrorResponse;
      return {
        ...result,
        data: { hash },
      };
    }

    const { data, hash } = result.data as SendTransactionSuccessResponse<
      string[] | null
    >;
    if (!data || data.length < 7) {
      return {
        ...result,
        data: null,
      };
    }

    return {
      ...result,
      data: {
        hash,
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

  repositionLiquidity = async (
    request: RepositionLiquidityRequest,
  ): Promise<
    WalletResponse<
      RepositionLiquiditySuccessResponse | RepositionLiquidityFailedResponse
    >
  > => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const {
      lpTokenId,
      tokenA,
      tokenB,
      minTick,
      maxTick,
      tokenAAmount,
      tokenBAmount,
      slippage,
      caller,
    } = request;

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

    const increaseLiquidityMessage = makePositionRepositionLiquidityMessage(
      lpTokenId,
      minTick,
      maxTick,
      tokenAAmountRaw,
      tokenBAmountRaw,
      slippage,
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
        minTick: Number(data[2]),
        maxTick: Number(data[3]),
        tokenAAmount: data[4],
        tokenBAmount: data[5],
      },
    };
  };

  removeLiquidity = async (
    request: RemoveLiquidityRequest,
  ): Promise<WalletResponse<SendTransactionResponse<string[] | null>>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const { lpTokenIds, tokenPaths, caller, existWrappedToken } = request;
    const decreaseLiquidityRatio = 100;

    // Make Approve messages that can be managed by a Pool package of tokens.
    const approveMessages = tokenPaths.map(tokenPath =>
      makeApproveMessage(
        checkGnotPath(tokenPath),
        [PACKAGE_POOL_ADDRESS, MAX_INT64.toString()],
        caller,
      ),
    );

    // If the GNOT token is included, the Position package must include the token approve.
    if (tokenPaths.some(isGNOTPath)) {
      approveMessages.push(
        makeApproveMessage(
          WRAPPED_GNOT_PATH,
          [PACKAGE_POSITION_ADDRESS, MAX_INT64.toString()],
          caller,
        ),
      );
    }

    // Make Decrease liquidity messages
    const decreaseLiquidityMessages = lpTokenIds.map(lpTokenId =>
      makePositionDecreaseLiquidityMessage(
        lpTokenId,
        decreaseLiquidityRatio,
        "0",
        "0",
        0,
        existWrappedToken,
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
}
