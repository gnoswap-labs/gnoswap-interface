import { LaunchpadPoolModel } from "./launchpad-pool-model";
import { LaunchpadStatusType } from "./types";

export interface LaunchpadProjectModel {
  id: number;

  projectID: string;

  status: LaunchpadStatusType;

  name: string;

  rewardTokenPath: string;

  rewardTokenSymbol: string;

  rewardTokenDecimals: number;

  rewardTokenLogoURL: string | null;

  description: string | null;

  pools: LaunchpadPoolModel[];
}

export interface LaunchpadProjectDetailsModel extends LaunchpadProjectModel {
  conditions: LaunchpadProjectConditionModel[];

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
