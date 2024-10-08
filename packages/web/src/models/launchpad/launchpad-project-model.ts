import { LaunchpadPoolModel } from "./launchpad-pool-model";

type LaunchpadStatusType = "NONE" | "UPCOMING" | "ONGOING" | "ENDED";

export interface LaunchpadProjectModel {
  id: number;

  projectId: string;

  status: LaunchpadStatusType;

  name: string;

  description: string | null;

  pools: LaunchpadPoolModel[];
}

export interface LaunchpadProjectDetailsModel {
  id: number;

  projectId: string;

  status: string;

  name: string;

  conditions: LaunchpadProjectConditionModel[];

  pools: LaunchpadPoolModel[];

  rewardTokenPath: string;

  description: string | null;

  descriptionDetails: string | null;

  websiteUrl: string | null;

  twitterUrl: string | null;

  discordUrl: string | null;

  docsUrl: string | null;
}

export interface LaunchpadProjectConditionModel {
  tokenPath: string;

  leastTokenAmount: number;
}
