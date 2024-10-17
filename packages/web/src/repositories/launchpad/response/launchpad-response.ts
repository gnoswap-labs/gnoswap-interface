type LaunchpadStatusType = "NONE" | "UPCOMING" | "ONGOING" | "ENDED";

export interface LaunchpadProjectResponse {
  id: number;

  projectId: string;

  status: LaunchpadStatusType;

  name: string;

  rewardTokenPath: string;

  rewardTokenSymbol: string;

  rewardTokenDecimals: number;

  rewardTokenLogoUrl: string | null;

  description: string | null;

  pools: LaunchpadPoolResponse[];
}

export interface LaunchpadProjectDetailsResponse {
  id: number;

  projectId: string;

  status: string;

  name: string;

  conditions: LaunchpadProjectConditionResponse[];

  pools: LaunchpadPoolResponse[];

  rewardTokenPath: string;

  rewardTokenSymbol: string;

  rewardTokenDecimals: number;

  rewardTokenLogoUrl: string | null;

  description: string | null;

  descriptionDetails: string | null;

  websiteUrl: string | null;

  twitterUrl: string | null;

  discordUrl: string | null;

  docsUrl: string | null;
}

export interface LaunchpadPoolResponse {
  id: number;

  projectPoolId: string;

  status: "NONE" | "UPCOMING" | "ENDED" | "ONGOING";

  poolTier: "TIER30" | "TIER90" | "TIER180";

  allocation: number;

  participant: number;

  depositAmount: number;

  distributedAmount: number;

  apr: number | null;

  createTime: string;

  createBlockHeight: number;

  startTime: string;

  startBlockHeight: number;

  endTime: string;

  endBlockHeight: number;

  claimableThreshold: number;
}

export interface LaunchpadProjectConditionResponse {
  tokenPath: string;

  leastTokenAmount: number;
}

export interface LaunchpadParticipationResponse {
  id: number;

  projectId: string;

  projectPoolId: string;

  depositId: string;

  poolTier: "TIER30" | "TIER90" | "TIER180";

  status: string;

  depositAmount: number;

  rewardToken: string;

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
