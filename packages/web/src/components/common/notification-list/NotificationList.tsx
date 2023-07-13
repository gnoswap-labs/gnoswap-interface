import React, { useEffect, useRef } from "react";
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
  onListToggle: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  txsGroupsInformation,
  onListToggle,
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeList = (e: MouseEvent) => {
      if (listRef.current && listRef.current.contains(e.target as Node)) {
        return;
      } else {
        e.stopPropagation();
        onListToggle();
      }
    };
    window.addEventListener("click", closeList, true);
    return () => {
      window.removeEventListener("click", closeList, true);
    };
  }, [listRef, onListToggle]);

  return (
    <NotificationListWrapper ref={listRef}>
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
