import { TransactionModel } from "@models/account/account-history-model";
import { ValuesType } from "utility-types";

export const TransactionGroupsLabel = {
  TODAY: "TODAY",
  PASS_7_DAYS: "PAST_7_DAYS",
  PASS_30_DAYS: "PAST_30_DAYS",
  GREATER_1_MONTH: "GREATER_1_MONTH",
} as const;

export type TransactionGroupsLabelType = ValuesType<
  typeof TransactionGroupsLabel
>;

export interface TransactionGroupsType {
  type: TransactionGroupsLabelType;
  txs: Array<TransactionModel>;
}
