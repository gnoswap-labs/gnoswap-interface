import { LAUNCHPAD_STATUS, LaunchpadProjectModel } from "@models/launchpad";

export interface LaunchpadProjectsInfo {
  projects: LaunchpadProjectModel[];
  lastCursor: string | null;
}

// null objects
export const nullLaunchpadProjectsInfo: LaunchpadProjectsInfo = {
  projects: [],
  lastCursor: null,
};

export const nullLaunchpadProjectInfo: LaunchpadProjectModel = {
  id: 0,
  projectID: "",
  status: LAUNCHPAD_STATUS.NONE,
  name: "",
  rewardTokenPath: "",
  rewardTokenSymbol: "",
  rewardTokenDecimals: 0,
  rewardTokenLogoURL: null,
  description: null,
  pools: [],
};
