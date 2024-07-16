import { TokenModel } from "@models/token/token-model";

export interface PoolStakingResponse {
  incentiveType: string;
  tier: string;
  poolPath: string;
  rewardToken: TokenModel;
  incentivizedAmount: string;
  remainingAmount: string;
  startTimestamp: string;
  endTimestamp: string;
}
