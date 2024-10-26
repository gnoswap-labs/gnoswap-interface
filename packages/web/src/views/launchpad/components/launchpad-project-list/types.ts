import { ValuesType } from "utility-types";

export const TABLE_HEAD = {
  PROJECT: "Project",
  STATUS: "Status",
  APR: "APR",
  PARTICIPANTS: "Particiapnts",
  TOTAL_ALLOCATION: "Total Allocation",
  TOTAL_DEPOSIT: "Total Deposit",
  SWAP: "Swap",
} as const;

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;
