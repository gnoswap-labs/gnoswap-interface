import { PositionModel } from "@models/position/position-model";
import { ClaimAllRequest } from "./request/claim-all-request";
import { RemoveLiquidityRequest } from "./request/remove-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";
import {
  SendTransactionResponse,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";

export interface PositionRepository {
  getPositionsByAddress: (address: string) => Promise<PositionModel[]>;

  claimAll: (
    request: ClaimAllRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  stakePositions: (
    request: StakePositionsRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  unstakePositions: (
    request: UnstakePositionsRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;

  removeLiquidity: (
    request: RemoveLiquidityRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;
}
