import { LaunchpadProjectInfo, nullLaunchpadProjectInfo } from "./launchpad-projects-info";

export interface LaunchpadProjectDetailsInfo {
  project: LaunchpadProjectInfo;
}

export const nullLaunchpadProjectDetailsInfo = {
  project: nullLaunchpadProjectInfo,
};
