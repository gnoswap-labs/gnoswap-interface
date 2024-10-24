import { ValuesType } from "utility-types";

export const LAUNCHPAD_REFETCH_INTERVAL = 60_000;

export const PROJECT_STATUS_TYPE = {
  UPCOMING: "UPCOMING",
  ENDED: "ENDED",
  ONGOING: "ONGOING",
};
export type PROJECT_STATUS_TYPE = ValuesType<typeof PROJECT_STATUS_TYPE>;
