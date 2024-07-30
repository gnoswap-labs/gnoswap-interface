import { TransactionModel } from "@models/account/account-history-model";
import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconCircleInMore from "@components/common/icons/IconCircleInMore";
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
import React, { useCallback, useMemo } from "react";
import MissingLogo from "../missing-logo/MissingLogo";
import { TransactionGroupsType } from "@models/notification";
import { formatPoolPairAmount } from "@utils/new-number-utils";
import { prettyNumberFloatInteger } from "@utils/number-utils";
import { capitalize } from "@utils/string-utils";
import { AccountActivity } from "@repositories/notification";
import { useTranslation } from "react-i18next";

interface ItemProps {
  groups: TransactionGroupsType;
  breakpoint: DEVICE_TYPE;
}

const NotificationItem: React.FC<ItemProps> = ({ groups, breakpoint }) => {
  const { t } = useTranslation();
  const { type, txs } = groups;
  const { getTxUrl } = useGnoscanUrl();

  const groupLabel = useMemo(() => {
    switch (type) {
      case "TODAY":
        return t("Modal:notif.group.today");
      case "PAST_7_DAYS":
        return t("Modal:notif.group.pass7");
      case "PAST_30_DAYS":
        return t("Modal:notif.group.pass30");
      case "GREATER_1_MONTH":
        return t("Modal:notif.group.greaterMonth");
    }
  }, [t, type]);

  const replaceToken = useCallback((symbol: string) => {
    if (symbol === "wugnot") return "GNOT";
    return symbol;
  }, []);

  const getNotificationMessage = useCallback(
    (tx: AccountActivity) => {
      const token0Amount = formatPoolPairAmount(tx?.tokenAAmount, {
        decimals: tx.tokenA.decimals,
        isKMB: false,
      });
      const token0symbol = replaceToken(tx?.tokenA?.symbol);

      const token1Amount = formatPoolPairAmount(tx?.tokenBAmount, {
        decimals: tx.tokenA.decimals,
        isKMB: false,
      });
      const token1symbol = replaceToken(tx?.tokenB?.symbol);

      const token0Display = Number(tx?.tokenAAmount)
        ? `<span>${token0Amount}</span> <span>${token0symbol}</span>`
        : "";
      const token1Display = Number(tx?.tokenBAmount)
        ? `<span>${token1Amount}</span> <span>${token1symbol}</span>`
        : "";
      const tokenStr = [token0Display, token1Display]
        .filter(item => item)
        .join(` ${t("common:conjunction:and")} `);

      switch (tx.actionType) {
        case "SWAP":
          return `${t("Modal:notif.action.swapped")} ${tokenStr}`;
        case "ADD":
          return `${t("Modal:notif.action.added")} ${tokenStr}`;
        case "REMOVE":
          return `${t("Modal:notif.action.removed")} ${tokenStr}`;
        case "STAKE":
          return `${t("Modal:notif.action.staked")} ${tokenStr}`;
        case "UNSTAKE":
          return `${t("Modal:notif.action.unstaked")} ${tokenStr}`;
        case "CLAIM":
          return `${t("Modal:notif.action.claimed")} ${tokenStr}`;
        case "WITHDRAW":
          return `${t("Modal:notif.action.sent")} ${token0Display}`;
        case "DEPOSIT":
          return `${t("Modal:notif.action.received")} ${token0Display}`;
        case "DECREASE":
          return `${t("Modal:notif.action.decreased")}  ${token0Display}`;
        case "INCREASE":
          return `${t("Modal:notif.action.increased")} ${token0Display}`;
        case "REPOSITION":
          return `${t("Modal:notif.action.repositioned")} ${tokenStr}`;
        default:
          return `${capitalize(tx.actionType)} ${prettyNumberFloatInteger(
            tx.tokenAAmount,
          )} ${replaceToken(tx.tokenA.symbol ?? tx.tokenB.symbol)}`;
      }
    },
    [replaceToken, t],
  );

  const actionFormat = useCallback(
    (transaction: TransactionModel) => {
      return getNotificationMessage(transaction.rawValue);
    },
    [getNotificationMessage],
  );

  return (
    <TxsListItem key={type}>
      <TxsDateAgoTitle>{groupLabel}</TxsDateAgoTitle>
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
              dangerouslySetInnerHTML={{ __html: actionFormat(item) || "" }}
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
