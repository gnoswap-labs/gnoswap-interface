import React, { useRef } from "react";
import {
  ClearButton,
  NoDataText,
  NotificationHeader,
  NotificationListWrapper,
  Overlay,
} from "./NotificationList.styles";
import TransactionItems from "./TransactionItems";
import { TransactionGroupsType } from "@components/common/notification-button/NotificationButton";
import { DEVICE_TYPE } from "@styles/media";

interface NotificationListProps {
  txsGroupsInformation: TransactionGroupsType[];
  onListToggle: () => void;
  breakpoint: DEVICE_TYPE;
}

const NotificationList: React.FC<NotificationListProps> = ({
  txsGroupsInformation,
  onListToggle,
  breakpoint,
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <NotificationListWrapper ref={listRef} width={window?.innerWidth}>
        <NotificationHeader>
          <span className="notification-title">Notification</span>
          {txsGroupsInformation.length > 0 && (
            <ClearButton>Clear All</ClearButton>
          )}
        </NotificationHeader>
        {txsGroupsInformation && txsGroupsInformation.length > 0 ? (
          <div className="list-container">
            <div className="list-content">
              {txsGroupsInformation.map(groups => (
                <TransactionItems
                  key={groups.title}
                  groups={groups}
                  breakpoint={breakpoint}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <NoDataText>No notifications found</NoDataText>
          </>
        )}
      </NotificationListWrapper>
      <Overlay onClick={onListToggle} />
    </>
  );
};

export default NotificationList;
