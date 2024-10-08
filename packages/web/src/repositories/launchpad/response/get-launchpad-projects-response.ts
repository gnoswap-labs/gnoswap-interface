import { LaunchpadProjectResponse } from "./launchpad-response";

export interface GetLaunchpadProjectsResponse {
  lastCursor: string | null;

  projects: LaunchpadProjectResponse[];
}
