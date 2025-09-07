import { LaunchpadPoolModel } from "./launchpad-pool-model";

export const LAUNCHPAD_STATUS = {
  NONE: "NONE",
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  ENDED: "ENDED",
} as const;
export type LaunchpadStatusType = (typeof LAUNCHPAD_STATUS)[keyof typeof LAUNCHPAD_STATUS];

export interface LaunchpadProjectModel {
  id: number;

  projectId: string;

  status: LaunchpadStatusType;

  name: string;

  rewardTokenPath: string;

  rewardTokenSymbol: string;

  rewardTokenDecimals: number;

  rewardTokenLogoUrl: string | null;

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
