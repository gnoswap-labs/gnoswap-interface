import { PositionModel } from "@models/position/position-model";
import { ClaimAllRequest } from "./request/claim-all-request";
import { RemoveLiquidityReqeust } from "./request/remove-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";
import { SendTransactionResponse, WalletResponse } from "@common/clients/wallet-client/protocols";

export interface PositionRepository {
  getPositionsByAddress: (address: string) => Promise<PositionModel[]>;

  claimAll: (request: ClaimAllRequest) => Promise<string | null>;

  stakePositions: (request: StakePositionsRequest) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>> ;

  unstakePositions: (
    request: UnstakePositionsRequest,
  ) => Promise<string | null>;

  removeLiquidity: (request: RemoveLiquidityReqeust) => Promise<WalletResponse<SendTransactionResponse<string[] | null>>>;
}
