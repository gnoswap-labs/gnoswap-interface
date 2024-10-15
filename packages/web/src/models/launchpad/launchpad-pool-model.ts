export interface LaunchpadPoolModel {
  id: number;

  projectPoolId: string;

  status: "NONE" | "UPCOMING" | "ENDED" | "ONGOING";

  poolTier: "30" | "90" | "180";

  allocation: number;

  participant: number;

  depositAmount: number;

  distributedAmount: number;

  apr: number | null;

  createTime: string;

  startTime: string;

  endTime: string;

  claimableTime: string;
}
