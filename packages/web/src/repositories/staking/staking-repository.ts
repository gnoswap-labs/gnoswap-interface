import { StakeRequest } from "./request";
import { UnstakeRequest } from "./request/unstake-request";
import { StakeResponse, UnstakeResponse } from "./response";

export interface StakingRepository {
  stakeBy: (request: StakeRequest) => Promise<StakeResponse>;

  unstakeBy: (request: UnstakeRequest) => Promise<UnstakeResponse>;
}
