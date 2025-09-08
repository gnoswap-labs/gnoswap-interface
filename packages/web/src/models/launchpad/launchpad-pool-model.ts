import { PoolTierType, LaunchpadStatusType } from "./types";

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
