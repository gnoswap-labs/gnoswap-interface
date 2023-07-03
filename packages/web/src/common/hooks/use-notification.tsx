import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { TransactionModel } from "@/models/account/account-history-model";
import { AccountState } from "@/states";
import { isErrorResponse } from "@utils/validationUtils";
import { StatusOptions } from "@/common/values/data-constant";
import { useGnoswapContext } from "./use-gnoswap-context";

export const useNotification = () => {
  const { accountService } = useGnoswapContext();

  const [address] = useRecoilState(AccountState.address);
  const [notifications, setNotifications] = useRecoilState(
    AccountState.notifications,
  );

  const isUpdateNotifications = () => {
    if (!address || !notifications) {
      return false;
    }
    if (notifications.txs.filter(tx => tx.status === "PENDING").length === 0) {
      return false;
    }
    return true;
  };

  const initNotifications = useCallback(() => {
    if (!address) {
      return;
    }
    accountService.getNotifications(address).then(response => {
      if (isErrorResponse(response)) {
        return;
      }
      setNotifications(response);
    });
  }, [address, accountService, setNotifications]);

  const createNotification = (notification: TransactionModel) => {
    if (!address) {
      return;
    }
    return accountService
      .createNotification(address, notification)
      .then(initNotifications);
  };

  /**
   * TODO: Need to get the transaction results from Gnoland
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateNotifications = async () => {
    if (!isUpdateNotifications()) {
      return;
    }
    const pendingTransactions =
      notifications?.txs.filter(tx => tx.status === "PENDING") ?? [];

    for (const tx of pendingTransactions) {
      await updateNotificationStatus(tx, "SUCCESS");
    }
    initNotifications();
  };

  const updateNotificationStatus = (
    notification: TransactionModel,
    status: StatusOptions,
  ) => {
    if (!address) {
      return;
    }
    const { txHash } = notification;
    return accountService.updateNotificationStatus(address, txHash, status);
  };

  const clearNotifications = () => {
    if (!address) {
      return;
    }
    return accountService
      .deleteAllNotification(address)
      .then(initNotifications);
  };

  return {
    notifications,
    initNotifications,
    createNotification,
    updateNotificationStatus,
    clearNotifications,
  };
};
