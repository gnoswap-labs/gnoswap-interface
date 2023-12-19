import { TransactionGroupsType } from "@components/common/notification-button/NotificationButton";
import { AccountActivityRequest } from "./request";
import { AccountActivity } from "./response/account-activity-response";

export interface NotificationRepository {
  getAccountOnchainActivity: (
    req: AccountActivityRequest,
  ) => Promise<AccountActivity[]>;

  getGroupedNotification: (
    req: AccountActivityRequest,
  ) => Promise<TransactionGroupsType[]>;
  appendRemovedTx: (txs: string[]) => void;
}
