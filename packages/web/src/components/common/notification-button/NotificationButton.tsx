import React, { useMemo } from "react";
import { TransactionModel } from "@models/account/account-history-model";
import {
  getTransactionGroups,
  notificationDummyList,
} from "@utils/notification-utils";
import IconAlert from "@components/common/icons/IconAlert";
import NotificationList from "@components/common/notification-list/NotificationList";
import { AlertButton, NotificationWrapper } from "./NotificationButton.styles";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";

export interface TransactionGroupsType {
  title: string;
  txs: Array<TransactionModel>;
}

const NotificationButton = ({ breakpoint }: { breakpoint: DEVICE_TYPE }) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);

  const onListToggle = () => {
    setToggle(prev => ({
      ...prev,
      notification: !prev.notification,
    }));
  };

  // TODO : Moving data logic to HeaderContainer
  const txsGroupsInformation: TransactionGroupsType[] = [];
  const txsList = useMemo(
    () => getTransactionGroups(notificationDummyList),
    [],
  );
  if (txsList.length) txsGroupsInformation.push(...txsList);

  return (
    <NotificationWrapper>
      <AlertButton onClick={onListToggle}>
        <IconAlert className="notification-icon" />
        <div className="point-unread"/>
      </AlertButton>
      {toggle.notification && (
        <NotificationList
          txsGroupsInformation={txsGroupsInformation}
          onListToggle={onListToggle}
          breakpoint={breakpoint}
        />
      )}
    </NotificationWrapper>
  );
};

export default NotificationButton;
