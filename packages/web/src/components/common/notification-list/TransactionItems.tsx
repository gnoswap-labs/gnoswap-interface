import { TransactionModel } from "@models/account/account-history-model";
import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconCircleInMore from "@components/common/icons/IconCircleInMore";
import { TransactionGroupsType } from "@components/common/notification-button/NotificationButton";
import {
  DoubleLogoWrapperTest,
  TxsDateAgoTitle,
  TxsListItem,
  TxsSummaryItem,
  TransactionItemsWrap,
  DoubleLogo,
} from "./NotificationList.styles";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";

interface ItemProps {
  groups: TransactionGroupsType;
  breakpoint: DEVICE_TYPE;
}

const TransactionItems: React.FC<ItemProps> = ({ groups, breakpoint }) => {
  const { title, txs } = groups;
  return (
    <TxsListItem key={title}>
      <TxsDateAgoTitle>{title}</TxsDateAgoTitle>
      {txs.map((item: TransactionModel, idx: number) =>
        breakpoint === DEVICE_TYPE.MOBILE ? (
          <TransactionItemsWrap key={idx}>
            <div className="list">
              <div className="coin-info">
                {item.txType === 1 ? (
                  <DoubleLogo>
                    <img
                      src="https://picsum.photos/id/7/24/24"
                      alt="logo-image"
                    />
                    <img
                      src="https://picsum.photos/id/101/24/24"
                      alt="logo-image"
                      className="right-logo"
                    />
                  </DoubleLogo>
                ) : (
                  <DoubleLogo>
                    <img
                      src="https://picsum.photos/id/101/24/24"
                      alt="logo"
                      className="summary-logo-test"
                    />
                  </DoubleLogo>
                )}
                <div className="content-wrap">{item.content}</div>
              </div>
            </div>
            {item.status === "SUCCESS" ? (
              <IconCircleInCheck className="success-icon status-icon" />
            ) : item.status === "FAILED" ? (
              <IconCircleInCancel className="failed-icon status-icon" />
            ) : (
              item.status === "PENDING" && (
                <IconCircleInMore className="pending-icon status-icon" />
              )
            )}
          </TransactionItemsWrap>
        ) : (
          <TxsSummaryItem key={idx}>
            {item.txType === 1 ? (
              <DoubleLogoWrapperTest>
                <img src="https://picsum.photos/id/7/24/24" alt="logo-image" />
                <img
                  src="https://picsum.photos/id/101/24/24"
                  alt="logo-image"
                  className="right-logo"
                />
              </DoubleLogoWrapperTest>
            ) : (
              <DoubleLogoWrapperTest>
                <img
                  src="https://picsum.photos/id/101/24/24"
                  alt="logo"
                  className="summary-logo-test"
                />
              </DoubleLogoWrapperTest>
            )}
            <span className="summary-content">{item.content}</span>
            {item.status === "SUCCESS" ? (
              <IconCircleInCheck className="success-icon status-icon" />
            ) : item.status === "FAILED" ? (
              <IconCircleInCancel className="failed-icon status-icon" />
            ) : (
              item.status === "PENDING" && (
                <IconCircleInMore className="pending-icon status-icon" />
              )
            )}
          </TxsSummaryItem>
        ),
      )}
    </TxsListItem>
  );
};

export default TransactionItems;
