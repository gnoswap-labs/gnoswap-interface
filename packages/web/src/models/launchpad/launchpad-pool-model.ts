import { LaunchpadStatusType } from "./launchpad-project-model";

export const POOL_TIER = {
  TIER_30: "TIER_30",
  TIER_90: "TIER_90",
  TIER_180: "TIER_180",
} as const;
export type PoolTierType = (typeof POOL_TIER)[keyof typeof POOL_TIER];

export interface LaunchpadPoolModel {
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
