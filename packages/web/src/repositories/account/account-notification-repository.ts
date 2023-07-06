import { StatusOptions } from "@common/values/data-constant";
import {
  AccountHistoryModel,
  TransactionModel,
} from "@models/account/account-history-model";

export interface AccountNotificationRepository {
  getNotificationsByAddress: (address: string) => Promise<AccountHistoryModel>;

  createNotification: (
    address: string,
    transaction: TransactionModel,
  ) => Promise<boolean>;

  updateNotificationStatus: (
    address: string,
    txHash: string,
    status: StatusOptions,
  ) => Promise<boolean>;

  deleteAllNotifications: (address: string) => Promise<boolean>;
}
