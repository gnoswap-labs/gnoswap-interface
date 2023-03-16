import React, { useMemo } from "react";
import { TransactionModel } from "@/models/account/account-history-model";
import {
  ClearButton,
  NoDataText,
  NotificationHeader,
  NotificationListWrapper,
} from "./NotificationList.styles";
import {
  getTransactionGroups,
  notificationDummyList,
} from "@utils/notificationUtils";
import TransactionItems from "./TransactionItems";

export interface TransactionGroupsType {
  title: string;
  txs: Array<TransactionModel>;
}

const NotificationList = () => {
  // TODO : Moving data logic to HeaderContainer
  const txsGroupsInformation: TransactionGroupsType[] = [];
  const txsList = useMemo(
    () => getTransactionGroups(notificationDummyList),
    [notificationDummyList],
  );
  if (txsList.length) txsGroupsInformation.push(...txsList);

  return (
    <NotificationListWrapper>
      <NotificationHeader>
        <span className="notification-title">Notification</span>
        {txsGroupsInformation.length > 0 && (
          <ClearButton>Clear All</ClearButton>
        )}
      </NotificationHeader>
      {txsGroupsInformation && txsGroupsInformation.length > 0 ? (
        <>
          {txsGroupsInformation.map(groups => (
            <TransactionItems key={groups.title} groups={groups} />
          ))}
        </>
      ) : (
        <>
          <NoDataText>No notifications found</NoDataText>
        </>
      )}
    </NotificationListWrapper>
  );
};

export default NotificationList;
