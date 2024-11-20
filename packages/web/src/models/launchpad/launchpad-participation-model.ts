import { TokenModel } from "@models/token/token-model";

export interface LaunchpadParticipationModel {
  id: number;

  projectId: string;

  projectPoolId: string;

  depositId: string;

  poolTier: "TIER30" | "TIER90" | "TIER180";

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
