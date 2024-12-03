import { ValuesType } from "utility-types";

export const TABLE_HEAD = {
  PROJECT: "Launchpad:projects.col.project",
  STATUS: "Launchpad:projects.col.status",
  APR: "Launchpad:projects.col.apr",
  PARTICIPANTS: "Launchpad:projects.col.participants",
  TOTAL_ALLOCATION: "Launchpad:projects.col.totalAllocation",
  TOTAL_DEPOSIT: "Launchpad:projects.col.totalDeposit",
  SWAP: "Launchpad:projects.col.swap",
} as const;

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;
