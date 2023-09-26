import { TokenPairInfo } from "@models/token/token-pair-info";
import { TokenInfo } from "@models/token/token-info";
import { NotificationType, StatusOptions } from "@common/values/data-constant";

export interface AccountHistoryModel {
  txs: Array<TransactionModel>;
}
export interface TransactionModel {
  txType: NotificationType;
  txHash: string;
  tokenInfo: TokenInfo | TokenPairInfo;
  status: StatusOptions;
  createdAt: string;
  content?: string;
}
