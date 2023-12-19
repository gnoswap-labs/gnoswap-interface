/* eslint-disable @next/next/no-img-element */
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
import MissingLogo from "../missing-logo/MissingLogo";

interface ItemProps {
  groups: TransactionGroupsType;
  breakpoint: DEVICE_TYPE;
}

const NotificationItem: React.FC<ItemProps> = ({ groups, breakpoint }) => {
  const { title, txs } = groups;
  return (
    <TxsListItem key={title}>
      <TxsDateAgoTitle>{title}</TxsDateAgoTitle>
      {txs.map((item: TransactionModel, idx: number) =>
        breakpoint === DEVICE_TYPE.MOBILE ? (
          <TransactionItemsWrap
            onClick={() =>
              window.open(
                `https://gnoscan.io/transactions/details?txhash=${item.txHash}`,
                "_blank",
              )
            }
            key={idx}
          >
            <div className="list">
              <div className="coin-info">
                {item.txType === 1 ? (
                  <DoubleLogo>
                    <MissingLogo
                      symbol={item?.tokenInfo?.tokenA?.symbol}
                      url={item?.tokenInfo?.tokenA?.logoURI}
                      width={24}
                      mobileWidth={24}
                    />
                    <div className="right-logo">
                      <MissingLogo
                        symbol={item?.tokenInfo?.tokenB?.symbol}
                        url={item?.tokenInfo?.tokenB?.logoURI}
                        width={24}
                        mobileWidth={24}
                      />
                    </div>
                  </DoubleLogo>
                ) : (
                  <DoubleLogo>
                    <MissingLogo
                      symbol={item?.tokenInfo?.tokenA?.symbol}
                      url={item?.tokenInfo?.tokenA?.logoURI}
                      width={24}
                      mobileWidth={24}
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
          <TxsSummaryItem
            onClick={() =>
              window.open(
                `https://gnoscan.io/transactions/details?txhash=${item.txHash}`,
                "_blank",
              )
            }
            key={idx}
          >
            {item.txType === 1 ? (
              <DoubleLogoWrapperTest>
                <MissingLogo
                  symbol={item?.tokenInfo?.tokenA?.symbol}
                  url={item?.tokenInfo?.tokenA?.logoURI}
                  width={24}
                  mobileWidth={24}
                />
                <div className="right-logo">
                  <MissingLogo
                    symbol={item?.tokenInfo?.tokenB?.symbol}
                    url={item?.tokenInfo?.tokenB?.logoURI}
                    width={24}
                    mobileWidth={24}
                  />
                </div>
              </DoubleLogoWrapperTest>
            ) : (
              <DoubleLogoWrapperTest>
                <MissingLogo
                  symbol={item?.tokenInfo?.tokenA?.symbol}
                  url={item?.tokenInfo?.tokenA?.logoURI}
                  width={24}
                  mobileWidth={24}
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

export default NotificationItem;
