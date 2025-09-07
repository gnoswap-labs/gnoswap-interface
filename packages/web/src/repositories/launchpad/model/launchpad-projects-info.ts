export const LAUNCHPAD_STATUS = {
  NONE: "NONE",
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  ENDED: "ENDED",
} as const;
export type LaunchpadStatusType = (typeof LAUNCHPAD_STATUS)[keyof typeof LAUNCHPAD_STATUS];

export const POOL_TIER = {
  TIER_30: "TIER_30",
  TIER_90: "TIER_90",
  TIER_180: "TIER_180",
} as const;
export type PoolTierType = (typeof POOL_TIER)[keyof typeof POOL_TIER];

export interface LaunchpadProjectConditionInfo {
  tokenPath: string;
  leastTokenAmount: number;
}

export interface LaunchpadPoolInfo {
  id: number;
  projectPoolId: string;
  status: LaunchpadStatusType;
  poolTier: PoolTierType;
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

export interface LaunchpadProjectItemInfo {
  id: number;
  projectId: string;
  status: LaunchpadStatusType;
  name: string;
  rewardTokenPath: string;
  rewardTokenSymbol: string;
  rewardTokenDecimals: number;
  rewardTokenLogoUrl: string | null;
  description: string | null;
  pools: LaunchpadPoolInfo[];
}

export interface LaunchpadProjectsInfo {
  projects: LaunchpadProjectItemInfo[];
  lastCursor: string | null;
}

// null objects
export const nullLaunchpadProjectsInfo: LaunchpadProjectsInfo = {
  projects: [],
  lastCursor: null,
};

export const nullLaunchpadProjectInfo: LaunchpadProjectItemInfo = {
  id: 0,
  projectId: "",
  status: LAUNCHPAD_STATUS.NONE,
  name: "",
  rewardTokenPath: "",
  rewardTokenSymbol: "",
  rewardTokenDecimals: 0,
  rewardTokenLogoUrl: null,
  description: null,
  pools: [],
};
