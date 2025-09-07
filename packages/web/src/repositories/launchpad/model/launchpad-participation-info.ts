import { PoolTierType as LaunchpadPoolTierType } from "./launchpad-projects-info";

export interface LaunchpadParticipationItemInfo {
  id: number;
  projectId: string;
  projectPoolId: string;
  depositId: string;
  poolTier: LaunchpadPoolTierType;
  status: string;
  depositAmount: number;
  rewardToken: string;
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

export interface LaunchpadParticipationInfo {
  participationInfos: LaunchpadParticipationItemInfo[];
}

// null objects
export const nullLaunchpadParticipationInfo: LaunchpadParticipationInfo = {
  participationInfos: [],
};
