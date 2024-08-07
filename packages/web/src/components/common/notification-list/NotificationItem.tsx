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
import { Trans, useTranslation } from "react-i18next";
import { NotificationType } from "@common/values";
import { DexEvent } from "@repositories/common";

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
      const token0Display = Number(tx?.tokenAAmount)
        ? `<accent>${token0Amount} ${token0symbol}</accent>`
        : "";

      const token1Amount = formatPoolPairAmount(tx?.tokenBAmount, {
        decimals: tx.tokenA.decimals,
        isKMB: false,
      });
      const token1symbol = replaceToken(tx?.tokenB?.symbol);
      const token1Display = Number(tx?.tokenBAmount)
        ? `<accent>${token1Amount} ${token1symbol}</accent>`
        : "";

      const getSwapPair = () =>
        [token0Display, token1Display]
          .filter(item => item)
          .join(` ${t("common:conjunction:for")} `);

      const getPair = () =>
        [token0Display, token1Display]
          .filter(item => item)
          .join(` ${t("common:conjunction:and")} `);

      switch (tx.actionType) {
        case DexEvent.SWAP:
          return `${t("Modal:notif.action.swapped")} ${getSwapPair()}`;
        case DexEvent.ADD:
          return `${t("Modal:notif.action.added")} ${getPair()}`;
        case DexEvent.REMOVE:
          return `${t("Modal:notif.action.removed")} ${getPair()}`;
        case DexEvent.DECREASE:
          return `${t("Modal:notif.action.decreased")}  ${getPair()}`;
        case DexEvent.INCREASE:
          return `${t("Modal:notif.action.increased")} ${getPair()}`;
        case DexEvent.REPOSITION:
          return `${t("Modal:notif.action.repositioned")} ${getPair()}`;
        case DexEvent.CLAIM:
        case DexEvent.CLAIM_STAKING:
          return `${t("Modal:notif.action.claimed")} ${getPair()}`;
        case DexEvent.STAKE:
          return `${t("Modal:notif.action.staked")} ${getPair()}`;
        case DexEvent.UNSTAKE:
          return `${t("Modal:notif.action.unstaked")} ${getPair()}`;
        case DexEvent.DEPOSIT:
          return `${t("Modal:notif.action.received")} ${token0Display}`;
        case DexEvent.WITHDRAW:
          return `${t("Modal:notif.action.sent")} ${token0Display}`;
        default:
          return `${capitalize(tx.actionType)} ${prettyNumberFloatInteger(
            tx.tokenAAmount,
          )} ${replaceToken(tx.tokenA.symbol ?? tx.tokenB.symbol)}`;
      }
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
            {item.txType === NotificationType.CreatePool ? (
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
            <div className="summary-content">
              <Trans components={{ accent: <span className="accent" /> }}>
                {getNotificationMessage(item.rawValue)}
              </Trans>
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
