import { SendTransactionResponse, WalletResponse } from "@common/clients/wallet-client/protocols";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { PositionModel } from "@models/position/position-model";

import { DecreaseLiquidityRequest, IncreaseLiquidityRequest, RepositionLiquidityRequest } from "./request";
import { ClaimAllRequest } from "./request/claim-all-request";
import { ClaimRequest } from "./request/claim-request";
import { RemoveLiquidityRequest } from "./request/remove-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";
import {
  DecreaseLiquidityFailedResponse,
  DecreaseLiquiditySuccessResponse,
  GetPositionsByAddressResult,
  IncreaseLiquidityFailedResponse,
  IncreaseLiquiditySuccessResponse,
  PositionRewardsResponse,
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse,
} from "./response";

export interface PositionRepository {
  getPositionsByAddress: (
    address: string,
    options?: {
      poolPath?: string;
      page?: number;
      limit?: number;
      /** API option: when true, include closed positions in the server response. */
      withClosed?: boolean;
      withAvailableStake?: boolean;
    },
  ) => Promise<GetPositionsByAddressResult>;

  getPositionRewardsByAddress: (address: string) => Promise<PositionRewardsResponse | null>;

  getPositionById: (lpTokenId: string) => Promise<PositionModel>;

  sendClaim: (request: ClaimRequest) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  sendClaimAll: (request: ClaimAllRequest) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  stakePositions: (request: StakePositionsRequest) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  unstakePositions: (
    request: UnstakePositionsRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

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

  getPositionHistory: (lpTokenId: string) => Promise<IPositionHistoryModel[]>;

  getUnstakingFee: () => Promise<number>;
}
