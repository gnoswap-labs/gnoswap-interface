import { TokenModel } from "@models/token/token-model";

export interface LaunchpadParticipationModel {
  id: number;

  projectId: string;

  projectPoolId: string;

  depositId: string;

  poolTier: "TIER_30" | "TIER_90" | "TIER_180";

  status: string;

  depositAmount: number;

  rewardToken: TokenModel | null;

  rewardTokenPath: string;

  createTime: string;

  startTime: string;

  endTime: string;

  claimableTime: string;

  createBlockHeight: number;

  startBlockHeight: number;

  endBlockHeight: number;

  claimableBlockHeight: number;

  claimableRewardAmount: number;

  claimedRewardAmount: number;

  depositAPR: number | null;
}
