import { LaunchpadProjectItemInfo, nullLaunchpadProjectInfo } from "./launchpad-projects-info";

export interface LaunchpadProjectConditionInfo {
  tokenPath: string;
  leastTokenAmount: number;
}

export interface LaunchpadProjectDetailsItemInfo extends LaunchpadProjectItemInfo {
  conditions: LaunchpadProjectConditionInfo[];
  descriptionDetails: string | null;
  websiteUrl: string | null;
  twitterUrl: string | null;
  discordUrl: string | null;
  docsUrl: string | null;
}

export interface LaunchpadProjectDetailsInfo {
  project: LaunchpadProjectDetailsItemInfo;
}

// null objects
export const nullLaunchpadProjectDetailsIteminfo: LaunchpadProjectDetailsItemInfo = {
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
