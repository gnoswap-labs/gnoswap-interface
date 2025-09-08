import { nullLaunchpadProjectInfo } from "./launchpad-projects-info";
import { LaunchpadProjectDetailsModel } from "@models/launchpad";

export interface LaunchpadProjectDetailsInfo {
  project: LaunchpadProjectDetailsModel;
}

// null objects
export const nullLaunchpadProjectDetailsIteminfo: LaunchpadProjectDetailsModel = {
  ...nullLaunchpadProjectInfo,
  conditions: [],
  descriptionDetails: null,
  websiteUrl: null,
  twitterUrl: null,
  discordUrl: null,
  docsUrl: null,
};

export const nullLaunchpadProjectDetailsInfo = {
  project: nullLaunchpadProjectDetailsIteminfo,
};
