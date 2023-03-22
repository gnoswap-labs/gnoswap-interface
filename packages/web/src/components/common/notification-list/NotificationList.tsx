import React from "react";
import {
  ClearButton,
  NoDataText,
  NotificationHeader,
  NotificationListWrapper,
} from "./NotificationList.styles";
import TransactionItems from "./TransactionItems";
import { TransactionGroupsType } from "@components/common/notification-button/NotificationButton";

interface NotificationListProps {
  txsGroupsInformation: TransactionGroupsType[];
}

const NotificationList: React.FC<NotificationListProps> = ({
  txsGroupsInformation,
}) => {
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
