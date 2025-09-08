import { LaunchpadProjectModel } from "@models/launchpad";

export interface GetLaunchpadProjectsResponse {
  lastCursor: string | null;

  projects: LaunchpadProjectModel[];
}
