import { TransactionGroupsType } from "@models/notification";
import { ActivityData } from "@repositories/activity/responses/activity-responses";

import { AccountActivityRequest } from "./request";
import { DeleteAccountActivityRequest } from "./request/delete-account-activity-request";

export interface NotificationRepository {
  getAccountOnchainActivity: (
    req: AccountActivityRequest,
  ) => Promise<ActivityData[]>;

  getGroupedNotification: (
    req: AccountActivityRequest,
  ) => Promise<TransactionGroupsType[]>;
  appendRemovedTx: (txs: string[]) => void;
  clearNotification: (req: DeleteAccountActivityRequest) => void;
}
