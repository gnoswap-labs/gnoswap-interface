import { DeleteAccountActivityRequest } from "./request/delete-account-activity-request";
import { AccountActivityRequest } from "./request";
import { AccountActivity } from "./response/account-activity-response";
import { TransactionGroupsType } from "@models/notification";

export interface NotificationRepository {
  getAccountOnchainActivity: (
    req: AccountActivityRequest,
  ) => Promise<AccountActivity[]>;

  getGroupedNotification: (
    req: AccountActivityRequest,
  ) => Promise<TransactionGroupsType[]>;
  appendRemovedTx: (txs: string[]) => void;
  clearNotification: (req: DeleteAccountActivityRequest) => void;
}
