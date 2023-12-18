import React, { useRef } from "react";
import {
  ClearButton,
  NoDataText,
  NotificationHeader,
  NotificationListWrapper,
  Overlay,
} from "./NotificationList.styles";
import { TransactionGroupsType } from "@components/common/notification-button/NotificationButton";
import { DEVICE_TYPE } from "@styles/media";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  txsGroupsInformation: TransactionGroupsType[];
  onClearAll: () => void;
  onListToggle: () => void;
  breakpoint: DEVICE_TYPE;
}

const NotificationList: React.FC<NotificationListProps> = ({
  txsGroupsInformation,
  onListToggle,
  breakpoint,
  onClearAll,
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <NotificationListWrapper ref={listRef} width={window?.innerWidth}>
        <NotificationHeader>
          <span className="notification-title">Notification</span>
          <ClearButton
            disabled={txsGroupsInformation.length === 0}
            onClick={onClearAll}
          >
            Clear All
          </ClearButton>
        </NotificationHeader>
        {txsGroupsInformation.length > 0 ? (
          <div className="list-container">
            <div className="list-content">
              {txsGroupsInformation.map(groups => (
                <NotificationItem
                  key={groups.title}
                  groups={groups}
                  breakpoint={breakpoint}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <NoDataText>No data</NoDataText>
          </>
        )}
      </NotificationListWrapper>
      <Overlay onClick={onListToggle} />
    </>
  );
};

export default NotificationList;
