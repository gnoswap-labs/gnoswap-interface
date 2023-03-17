import { TransactionModel } from "@/models/account/account-history-model";
import { ToggleState } from "@/states";
import {
  getTransactionGroups,
  notificationDummyList,
} from "@utils/notificationUtils";
import React, { useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import IconAlert from "../icons/IconAlert";
import NotificationList from "../notification-list/NotificationList";
import { AlertButton, NotificationWrapper } from "./NotificationButton.styles";

export interface TransactionGroupsType {
  title: string;
  txs: Array<TransactionModel>;
}

const NotificationButton = () => {
  const [toggle, setToggle] = useRecoilState(ToggleState.headerToggle);

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
    [notificationDummyList],
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
