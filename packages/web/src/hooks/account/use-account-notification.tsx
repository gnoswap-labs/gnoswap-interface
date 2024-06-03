import { useCallback, useMemo } from "react";
import { TransactionModel } from "@models/account/account-history-model";
import { isErrorResponse } from "@utils/validation-utils";
import { StatusOptions } from "@common/values/data-constant";
import { AccountState } from "@states/index";
import { useAtom } from "jotai";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";

export const useNotification = () => {
  const { account } = useWallet();
  const { accountRepository } = useGnoswapContext();

  const [notifications, setNotifications] = useAtom(AccountState.notifications);

  const address = useMemo(() => {
    if (!account) {
      return null;
    }
    return account.address;
  }, [account]);

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
    accountRepository.getNotificationsByAddress(address).then(response => {
      if (isErrorResponse(response)) {
        return;
      }
      setNotifications(response);
    });
  }, [accountRepository, address, setNotifications]);

  const createNotification = (notification: TransactionModel) => {
    if (!address) {
      return;
    }
    return accountRepository
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
    return accountRepository.updateNotificationStatus(address, txHash, status);
  };

  const clearNotifications = () => {
    if (!address) {
      return;
    }
    return accountRepository
      .deleteAllNotifications(address)
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
