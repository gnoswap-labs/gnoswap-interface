import React, { useMemo } from "react";
import { TransactionModel } from "@/models/account/account-history-model";
import {
  getTransactionGroups,
  notificationDummyList,
} from "@utils/notificationUtils";
import IconAlert from "@components/common/icons/IconAlert";
import NotificationList from "@components/common/notification-list/NotificationList";
import { AlertButton, NotificationWrapper } from "./NotificationButton.styles";
import { useAtom } from "jotai";
import { ToggleAtom } from "@atoms/index";

export interface TransactionGroupsType {
  title: string;
  txs: Array<TransactionModel>;
}

const NotificationButton = () => {
  const [toggle, setToggle] = useAtom(ToggleAtom.headerToggle);

  const menuOpenToggleHandler = () =>
    setToggle(prev => ({
      ...prev,
      walletConnect: false,
      notification: !prev.notification,
    }));

  // TODO : Moving data logic to HeaderContainer
  const txsGroupsInformation: TransactionGroupsType[] = [];
  const txsList = useMemo(
    () => getTransactionGroups(notificationDummyList),
    [],
  );
  if (txsList.length) txsGroupsInformation.push(...txsList);

  return (
    <NotificationWrapper>
      <AlertButton onClick={menuOpenToggleHandler}>
        <IconAlert className="notification-icon" />
      </AlertButton>
      {toggle.notification && (
        <NotificationList txsGroupsInformation={txsGroupsInformation} />
      )}
    </NotificationWrapper>
  );
};

export default NotificationButton;
