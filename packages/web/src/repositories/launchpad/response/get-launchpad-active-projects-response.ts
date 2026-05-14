import { LaunchpadPoolModel } from "@models/launchpad";

export interface LaunchpadActiveProjectPool extends LaunchpadPoolModel {
  createBlockHeight: number;
  startBlockHeight: number;
  endBlockHeight: number;
  /** Seconds after deposit before rewards become claimable. */
  claimableThreshold: number;
  apr: number;
  status: "UPCOMING" | "ONGOING" | "ENDED";
}

export interface GetLaunchpadActiveProjectsResponse {
  id: number;
  projectID: string;
  status: "UPCOMING" | "ONGOING" | "ENDED";
  name: string;
  description: string;
  pools: LaunchpadActiveProjectPool[];
}
