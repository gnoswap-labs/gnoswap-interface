import { SendTransactionResponse, TransactionMessage, WalletResponse } from "@common/clients/wallet-client/protocols";
import { PositionModel } from "@models/position/position-model";

import { DecreaseLiquidityRequest, IncreaseLiquidityRequest, RepositionLiquidityRequest } from "./request";
import { IncreaseLiquidityMessagesRequest } from "./request/increase-liquidity-request";
import { ClaimAllRequest } from "./request/claim-all-request";
import { ClaimRequest } from "./request/claim-request";
import { RemoveLiquidityRequest } from "./request/remove-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";
import {
  DecreaseLiquidityFailedResponse,
  DecreaseLiquiditySuccessResponse,
  GetPositionHistoryResult,
  GetPositionsByAddressResult,
  IncreaseLiquidityFailedResponse,
  IncreaseLiquiditySuccessResponse,
  PositionRewardsResponse,
  PositionSummaryResponse,
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse,
} from "./response";

export interface GetPositionsByAddressOptions {
  poolPath?: string;
  page?: number;
  limit?: number;
  /** API option: when true, include closed positions in the server response. */
  withClosed?: boolean;
  withAvailableStake?: boolean;
  /** API option: when true, only include staked positions. */
  stakedOnly?: boolean;
}

export interface PositionRepository {
  getPositionsByAddress: (
    address: string,
    options?: GetPositionsByAddressOptions,
  ) => Promise<GetPositionsByAddressResult>;

  /** Fetches every page of `getPositionsByAddress` and merges the results. */
  getAllPositionsByAddress: (
    address: string,
    options?: Omit<GetPositionsByAddressOptions, "page" | "limit">,
  ) => Promise<GetPositionsByAddressResult>;

  getPositionRewardsByAddress: (address: string) => Promise<PositionRewardsResponse | null>;

  getPositionSummaryByAddress: (address: string, poolPath?: string) => Promise<PositionSummaryResponse>;

  getPositionById: (lpTokenId: string, timeout?: number) => Promise<PositionModel>;

  sendClaim: (request: ClaimRequest) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  sendClaimAll: (request: ClaimAllRequest) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  stakePositions: (request: StakePositionsRequest) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  unstakePositions: (
    request: UnstakePositionsRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  /** The messages `increaseLiquidity` would broadcast, approvals included. */
  makeIncreaseLiquidityMessages: (request: IncreaseLiquidityMessagesRequest) => Promise<TransactionMessage[]>;

  increaseLiquidity: (
    request: IncreaseLiquidityRequest,
  ) => Promise<WalletResponse<IncreaseLiquiditySuccessResponse | IncreaseLiquidityFailedResponse | null>>;

  decreaseLiquidity: (
    request: DecreaseLiquidityRequest,
  ) => Promise<WalletResponse<DecreaseLiquiditySuccessResponse | DecreaseLiquidityFailedResponse | null>>;

  repositionLiquidity: (
    request: RepositionLiquidityRequest,
  ) => Promise<WalletResponse<RepositionLiquiditySuccessResponse | RepositionLiquidityFailedResponse>>;

  removeLiquidity: (
    request: RemoveLiquidityRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  getPositionHistory: (lpTokenId: string, page?: number, limit?: number) => Promise<GetPositionHistoryResult>;

  getUnstakingFee: () => Promise<number>;
}
