import { TransactionModel } from "@models/account/account-history-model";
import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconCircleInMore from "@components/common/icons/IconCircleInMore";
import { TransactionGroupsType } from "@components/common/notification-button/NotificationButton";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
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
  const { getTxUrl } = useGnoscanUrl();

  return (
    <TxsListItem key={title}>
      <TxsDateAgoTitle>{title}</TxsDateAgoTitle>
      {txs.map((item: TransactionModel, idx: number) => {
        const shouldShowTokenALogo =
          !!item.rawValue &&
          !!item.rawValue.tokenAAmount &&
          !!Number(item.rawValue.tokenAAmount);
        const shouldShowTokenBLogo =
          !!item.rawValue &&
          !!item.rawValue.tokenBAmount &&
          !!Number(item.rawValue.tokenBAmount);

        if (breakpoint === DEVICE_TYPE.MOBILE) {
          return (
            <TransactionItemsWrap
              onClick={() => window.open(getTxUrl(item.txHash), "_blank")}
              key={idx}
            >
              <div className="list">
                <div className="coin-info">
                  {item.txType === 1 ? (
                    <DoubleLogo>
                      {shouldShowTokenALogo && (
                        <MissingLogo
                          symbol={item?.tokenInfo?.tokenA?.symbol}
                          url={item?.tokenInfo?.tokenA?.logoURI}
                          width={24}
                          mobileWidth={24}
                        />
                      )}
                      {shouldShowTokenBLogo && (
                        <MissingLogo
                          symbol={item?.tokenInfo?.tokenB?.symbol}
                          url={item?.tokenInfo?.tokenB?.logoURI}
                          width={24}
                          mobileWidth={24}
                          className={
                            shouldShowTokenALogo ? "right-logo" : undefined
                          }
                          missingLogoClassName={
                            shouldShowTokenALogo ? "right-logo" : undefined
                          }
                        />
                      )}
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
                  <div
                    className="content-wrap"
                    dangerouslySetInnerHTML={{ __html: item.content || "" }}
                  />
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
          );
        }

        return (
          <TxsSummaryItem
            onClick={() => window.open(getTxUrl(item.txHash), "_blank")}
            key={idx}
          >
            {item.txType === 1 ? (
              <DoubleLogoWrapperTest>
                {shouldShowTokenALogo && (
                  <MissingLogo
                    symbol={item?.tokenInfo?.tokenA?.symbol}
                    url={item?.tokenInfo?.tokenA?.logoURI}
                    width={24}
                    mobileWidth={24}
                  />
                )}
                {shouldShowTokenBLogo && (
                  <MissingLogo
                    symbol={item?.tokenInfo?.tokenB?.symbol}
                    url={item?.tokenInfo?.tokenB?.logoURI}
                    width={24}
                    mobileWidth={24}
                    className={shouldShowTokenALogo ? "right-logo" : undefined}
                    missingLogoClassName={
                      shouldShowTokenALogo ? "right-logo" : undefined
                    }
                  />
                )}
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
            <div
              className="summary-content"
              dangerouslySetInnerHTML={{ __html: item.content || "" }}
            />
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
        );
      })}
    </TxsListItem>
  );
};

export default NotificationItem;
