import { TokenPairInfo } from "@models/token/token-pair-info";
import { NotificationType, StatusOptions } from "@common/values/data-constant";
import { ActivityData } from "@repositories/activity/responses/activity-responses";

export interface AccountHistoryModel {
  txs: Array<TransactionModel>;
}
export interface TransactionModel {
  txType: NotificationType;
  txHash: string;
  tokenInfo: TokenPairInfo;
  status: StatusOptions;
  createdAt: string;
  isRead?: boolean;
  rawValue: ActivityData;
}
