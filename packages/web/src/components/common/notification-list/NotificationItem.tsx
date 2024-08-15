import React, { useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

import { NotificationType } from "@common/values";
import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconCircleInMore from "@components/common/icons/IconCircleInMore";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { TransactionModel } from "@models/account/account-history-model";
import { TransactionGroupsType } from "@models/notification";
import { ActivityData } from "@repositories/activity/responses/activity-responses";
import { DexEvent, DexEventType } from "@repositories/common";
import { DEVICE_TYPE } from "@styles/media";
import { formatPoolPairAmount } from "@utils/new-number-utils";

import MissingLogo from "../missing-logo/MissingLogo";
import {
  DoubleLogo as DoubleLogoLocal,
  DoubleLogoDense,
  TransactionItemsWrap,
  TxsDateAgoTitle,
  TxsListItem,
  TxsSummaryItem
} from "./NotificationList.styles";

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

  const actionKeyMap: { [key: string]: string } = {
    [DexEvent.SWAP]: "Modal:notif.action.swapped",
    [DexEvent.ADD]: "Modal:notif.action.added",
    [DexEvent.REMOVE]: "Modal:notif.action.removed",
    [DexEvent.DECREASE]: "Modal:notif.action.decreased",
    [DexEvent.INCREASE]: "Modal:notif.action.increased",
    [DexEvent.REPOSITION]: "Modal:notif.action.repositioned",
    [DexEvent.CLAIM]: "Modal:notif.action.feesClaimed",
    [DexEvent.STAKE]: "Modal:notif.action.staked",
    [DexEvent.UNSTAKE]: "Modal:notif.action.unstaked",
    [DexEvent.CLAIM_STAKING]: "Modal:notif.action.rewardsClaimed",
    [DexEvent.DEPOSIT]: "Modal:notif.action.received",
    [DexEvent.WITHDRAW]: "Modal:notif.action.sent",
  };

  const getNotificationMessage = useCallback(
    (tx: ActivityData) => {
      const token0Amount = formatPoolPairAmount(tx?.tokenAAmount, {
        decimals: tx.tokenA.decimals,
        isKMB: false,
      });
      const token0symbol = replaceToken(tx?.tokenA?.symbol);
      const token0Display = Number(tx?.tokenAAmount) ? (
        <span className="accent">
          {" "}
          {token0Amount} {token0symbol}
        </span>
      ) : null;

      const token1Amount = formatPoolPairAmount(tx?.tokenBAmount, {
        decimals: tx.tokenA.decimals,
        isKMB: false,
      });
      const token1symbol = replaceToken(tx?.tokenB?.symbol);
      const token1Display = Number(tx?.tokenBAmount) ? (
        <span className="accent">
          {" "}
          {token1Amount} {token1symbol}
        </span>
      ) : null;

      const relatedTokens = tx.usedTokens || 0;

      let conjunction = "";
      if (relatedTokens === 2 && token0Display && token1Display) {
        conjunction = ` ${
          tx.actionType === DexEvent.SWAP
            ? t("common:conjunction.for")
            : t("common:conjunction.and")
        }`;
      } else if (relatedTokens > 2) {
        conjunction = ", ";
      }

      const tail = relatedTokens > 2 && (
        <>
          {", "}
          <span className="accent">{"..."}</span>
        </>
      );

      return (
        <>
          {token0Display}
          {conjunction}
          {token1Display}
          {tail}
        </>
      );
    },
    [replaceToken, t],
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
                  {item.txType === NotificationType.CreatePool ? (
                    <DoubleLogoLocal>
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
                      {item.rawValue.usedTokens &&
                        item.rawValue.usedTokens > 2 && (
                          <div className="more-token">
                            +{item.rawValue.usedTokens - 2}
                          </div>
                        )}
                    </DoubleLogoLocal>
                  ) : (
                    <DoubleLogoLocal>
                      <MissingLogo
                        symbol={item?.tokenInfo?.tokenA?.symbol}
                        url={item?.tokenInfo?.tokenA?.logoURI}
                        width={24}
                        mobileWidth={24}
                      />
                    </DoubleLogoLocal>
                  )}
                  <div className="content-wrap">
                    <Trans
                      i18nKey={
                        actionKeyMap[
                          item.rawValue.actionType as DexEventType
                        ] || "Undefined Task"
                      }
                    />
                    {getNotificationMessage(item.rawValue)}
                  </div>
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
            {item.txType === NotificationType.CreatePool ? (
              <DoubleLogoDense>
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
                {item.rawValue.usedTokens && item.rawValue.usedTokens > 2 && (
                  <div className="more-token">
                    +{item.rawValue.usedTokens - 2}
                  </div>
                )}
              </DoubleLogoDense>
            ) : (
              <DoubleLogoDense>
                <MissingLogo
                  symbol={item?.tokenInfo?.tokenA?.symbol}
                  url={item?.tokenInfo?.tokenA?.logoURI}
                  width={24}
                  mobileWidth={24}
                />
              </DoubleLogoDense>
            )}
            <div className="summary-content">
              <Trans
                i18nKey={
                  actionKeyMap[item.rawValue.actionType as DexEventType] ||
                  "Undefined Task"
                }
              />
              {getNotificationMessage(item.rawValue)}
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
          </TxsSummaryItem>
        );
      })}
    </TxsListItem>
  );
};

export default NotificationItem;
