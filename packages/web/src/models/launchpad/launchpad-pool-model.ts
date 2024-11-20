export interface LaunchpadPoolModel {
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
