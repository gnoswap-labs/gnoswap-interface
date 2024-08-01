import { PositionModel } from "@models/position/position-model";
import { ClaimAllRequest } from "./request/claim-all-request";
import { RemoveLiquidityRequest } from "./request/remove-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";
import {
  SendTransactionResponse,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import {
  DecreaseLiquidityFailedResponse,
  DecreaseLiquiditySuccessResponse,
  IncreaseLiquidityFailedResponse,
  IncreaseLiquiditySuccessResponse,
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse,
} from "./response";
import {
  DecreaseLiquidityRequest,
  IncreaseLiquidityRequest,
  RepositionLiquidityRequest,
} from "./request";
import { PositionBinModel } from "@models/position/position-bin-model";

export interface PositionRepository {
  getPositionsByAddress: (
    address: string,
    options?: { isClosed?: boolean; poolPath?: string },
  ) => Promise<PositionModel[]>;

  getPositionBins: (
    lpTokenId: string,
    count: 20 | 40,
  ) => Promise<PositionBinModel[]>;

  getPositionById: (lpTokenId: string) => Promise<PositionModel>;

  claimAll: (
    request: ClaimAllRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  stakePositions: (
    request: StakePositionsRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  unstakePositions: (
    request: UnstakePositionsRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  increaseLiquidity: (
    request: IncreaseLiquidityRequest,
  ) => Promise<
    WalletResponse<
      IncreaseLiquiditySuccessResponse | IncreaseLiquidityFailedResponse | null
    >
  >;

  decreaseLiquidity: (
    request: DecreaseLiquidityRequest,
  ) => Promise<
    WalletResponse<
      DecreaseLiquiditySuccessResponse | DecreaseLiquidityFailedResponse | null
    >
  >;

  repositionLiquidity: (
    request: RepositionLiquidityRequest,
  ) => Promise<
    WalletResponse<
      RepositionLiquiditySuccessResponse | RepositionLiquidityFailedResponse
    >
  >;

  removeLiquidity: (
    request: RemoveLiquidityRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  getPositionHistory: (lpTokenId: string) => Promise<IPositionHistoryModel[]>;

  getUnstakingFee: () => Promise<number>;
}
