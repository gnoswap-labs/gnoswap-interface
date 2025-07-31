import { ValuesType } from "utility-types";

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface LaunchpadProjectSortOption {
  key: TABLE_HEAD;
  direction: SortDirection;
}

export const TABLE_HEAD = {
  PROJECT: "Launchpad:projects.col.project",
  STATUS: "Launchpad:projects.col.status",
  APR: "Launchpad:projects.col.apr",
  PARTICIPANTS: "Launchpad:projects.col.participants",
  TOTAL_ALLOCATION: "Launchpad:projects.col.totalAllocation",
  TOTAL_DEPOSIT: "Launchpad:projects.col.totalDeposit",
  SWAP: "Launchpad:projects.col.swap",
} as const;

export const SORT_SUPPORT_HEAD: TABLE_HEAD[] = [
  TABLE_HEAD.APR,
  TABLE_HEAD.PARTICIPANTS,
  TABLE_HEAD.TOTAL_ALLOCATION,
  TABLE_HEAD.TOTAL_DEPOSIT,
];

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;
