import { PoolTierType, LaunchpadStatusType } from "./types";

export interface LaunchpadPoolModel {
  id: number;

  projectPoolID: string;

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

  /** Seconds after deposit before rewards become claimable. */
  claimableThreshold: number;
}
