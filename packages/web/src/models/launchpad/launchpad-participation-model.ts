import { TokenModel } from "@models/token/token-model";
import { LaunchpadStatusType } from "./launchpad-project-model";
import { PoolTierType } from "./launchpad-pool-model";

export interface LaunchpadParticipationModel {
  id: number;

  projectId: string;

  projectPoolId: string;

  depositId: string;

  poolTier: PoolTierType;

  status: LaunchpadStatusType;

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
