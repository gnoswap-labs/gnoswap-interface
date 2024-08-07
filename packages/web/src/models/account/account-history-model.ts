import { TokenPairInfo } from "@models/token/token-pair-info";
import { NotificationType, StatusOptions } from "@common/values/data-constant";
import { AccountActivity } from "@repositories/notification";

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
  rawValue: AccountActivity;
}
