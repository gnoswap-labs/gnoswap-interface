import React, { useRef } from "react";
import {
  ClearButton,
  NoDataText,
  NotificationHeader,
  NotificationListWrapper,
  Overlay,
} from "./NotificationList.styles";
import { DEVICE_TYPE } from "@styles/media";
import NotificationItem from "./NotificationItem";
import { useTranslation } from "react-i18next";
import { TransactionGroupsType } from "@models/notification";

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
  const { t } = useTranslation();
  const listRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <NotificationListWrapper
        emptyData={txsGroupsInformation.length === 0 || !txsGroupsInformation}
        ref={listRef}
        width={window?.innerWidth}
      >
        <NotificationHeader>
          <span className="notification-title">{t("Modal:notif.title")}</span>
          <ClearButton onClick={onClearAll}>
            {t("Modal:notif.clear")}
          </ClearButton>
        </NotificationHeader>
        {txsGroupsInformation.length > 0 ? (
          <div className="list-container">
            <div className="list-content">
              {txsGroupsInformation.map(groups => (
                <NotificationItem
                  key={groups.type}
                  groups={groups}
                  breakpoint={breakpoint}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <NoDataText>{t("Modal:notif.empty")}</NoDataText>
          </>
        )}
      </NotificationListWrapper>
      <Overlay onClick={onListToggle} />
    </>
  );
};

export default NotificationList;
