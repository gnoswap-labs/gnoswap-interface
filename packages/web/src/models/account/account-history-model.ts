import { TokenPairInfo } from "@models/token/token-pair-info";
import { NotificationType, StatusOptions } from "@common/values/data-constant";

export interface AccountHistoryModel {
  txs: Array<TransactionModel>;
}
export interface TransactionModel {
  txType: NotificationType;
  txHash: string;
  tokenInfo: TokenPairInfo;
  status: StatusOptions;
  createdAt: string;
  content?: string;
  isRead?: boolean;
}
