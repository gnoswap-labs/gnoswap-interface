import { LaunchpadPoolResponse } from "./launchpad-response";

export interface LaunchpadActiveProjectPool extends LaunchpadPoolResponse {
  createBlockHeight: number;
  startBlockHeight: number;
  endBlockHeight: number;
  claimableThreshold: number;
  apr: number;
  status: "UPCOMING" | "ONGOING" | "ENDED";
}

export interface GetLaunchpadActiveProjectsResponse {
  id: number;
  projectId: string;
  status: "UPCOMING" | "ONGOING" | "ENDED";
  name: string;
  description: string;
  pools: LaunchpadActiveProjectPool[];
}
