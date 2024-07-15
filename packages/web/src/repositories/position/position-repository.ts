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
  DecreaseLiquidityResponse,
  IncreaseLiquidityResponse,
  RepositionLiquidityResponse,
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
  ) => Promise<WalletResponse<IncreaseLiquidityResponse | null>>;

  decreaseLiquidity: (
    request: DecreaseLiquidityRequest,
  ) => Promise<WalletResponse<DecreaseLiquidityResponse | null>>;

  repositionLiquidity: (
    request: RepositionLiquidityRequest,
  ) => Promise<WalletResponse<RepositionLiquidityResponse | null>>;

  removeLiquidity: (
    request: RemoveLiquidityRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  getPositionHistory: (lpTokenId: string) => Promise<IPositionHistoryModel[]>;

  getUnstakingFee: () => Promise<number>;
}
