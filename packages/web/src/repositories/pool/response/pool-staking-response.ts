import { TokenModel } from "@models/token/token-model";

export interface PoolStakingResponse {
  incentiveId: string;
  incentiveType: string;
  tier: string;
  poolPath: string;
  rewardToken: TokenModel;
  incentivizedAmount: string;
  remainingAmount: string;
  startTimestamp: string;
  endTimestamp: string;
  unvestedAmount: string;
  estimatedPenaltyAmount: string;
  totalPenaltyAmount: string;
  collectedPenaltyAmount: string;
  claimablePenaltyAmount: string;
  createdBlockHeight: string;
}
