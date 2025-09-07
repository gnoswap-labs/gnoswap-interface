import { LaunchpadProjectItemInfo, nullLaunchpadProjectInfo } from "./launchpad-projects-info";

export interface LaunchpadProjectDetailsInfo {
  project: LaunchpadProjectItemInfo;
}

// null objects
export const nullLaunchpadProjectDetailsInfo = {
  project: nullLaunchpadProjectInfo,
};
