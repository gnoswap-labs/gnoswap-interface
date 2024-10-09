import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { NotificationType } from "@common/values";
import { XGNS_TOKEN } from "@common/values/token-constant";
import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconCircleInMore from "@components/common/icons/IconCircleInMore";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { TransactionModel } from "@models/account/account-history-model";
import { TransactionGroupsType } from "@models/notification";
import { ActivityData } from "@repositories/activity/responses/activity-responses";
import { DexEvent, DexEventType } from "@repositories/common";
import { DEVICE_TYPE } from "@styles/media";
import { formatPoolPairAmount } from "@utils/new-number-utils";

import {
  DoubleLogo as DoubleLogoLocal,
  DoubleLogoDense,
  TransactionItemsWrap,
  TxsDateAgoTitle,
  TxsListItem,
  TxsSummaryItem,
} from "./NotificationItem.styles";

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

  const isGovernanceNoti = (actionType: string) => {
    return (
      actionType === DexEvent.DELEGATE ||
      actionType === DexEvent.UNDELEGATE ||
      actionType === DexEvent.COLLECT_UNDEL ||
      actionType === DexEvent.VOTE ||
      actionType === DexEvent.PROPOSE_TEXT ||
      actionType === DexEvent.PROPOSE_COMM_POOL_SPEND ||
      actionType === DexEvent.PROPOSE_PARAM_CHANGE ||
      actionType === DexEvent.EXECUTE_PROPOSAL ||
      actionType === DexEvent.CANCEL_PROPOSAL
    );
  };

  const actionKeyMap: { [key: string]: string } = {
    // Swap
    [DexEvent.SWAP]: "Modal:notif.action.swapped",
    // Pool
    [DexEvent.ADD]: "Modal:notif.action.added",
    [DexEvent.REMOVE]: "Modal:notif.action.removed",
    [DexEvent.DECREASE]: "Modal:notif.action.decreased",
    [DexEvent.INCREASE]: "Modal:notif.action.increased",
    [DexEvent.REPOSITION]: "Modal:notif.action.repositioned",
    [DexEvent.CLAIM_FEE]: "Modal:notif.action.feesClaimed",
    [DexEvent.ADD_INCENTIVE]: "Modal:notif.action.incentivized",
    // Staking
    [DexEvent.STAKE]: "Modal:notif.action.staked",
    [DexEvent.UNSTAKE]: "Modal:notif.action.unstaked",
    [DexEvent.CLAIM_REWARD]: "Modal:notif.action.rewardsClaimed",
    // Wallet
    [DexEvent.ASSET_RECEIVE]: "Modal:notif.action.received",
    [DexEvent.ASSET_SEND]: "Modal:notif.action.sent",
    // Governance
    [DexEvent.DELEGATE]: "Delegated",
    [DexEvent.UNDELEGATE]: "Unelegated",
    [DexEvent.COLLECT_UNDEL]: "Claimed",
    [DexEvent.COLLECT_GOV_REWARD]: "Modal:notif.action.rewardsClaimed",
    [DexEvent.VOTE]: "Voted",
    [DexEvent.PROPOSE_TEXT]: "Created",
    [DexEvent.PROPOSE_COMM_POOL_SPEND]: "Created",
    [DexEvent.PROPOSE_PARAM_CHANGE]: "Created",
    [DexEvent.EXECUTE_PROPOSAL]: "Excuted",
    [DexEvent.CANCEL_PROPOSAL]: "Cancelled",
    // Launchpad
    [DexEvent.LAUNCHPAD_COLLECT_REWARD]: "Modal:notif.action.rewardsClaimed",
    [DexEvent.LAUNCHPAD_DEPOSIT]: "Modal:notif.action.deposited",
  };

  const getNotificationMessage = useCallback(
    (tx: ActivityData) => {
      const getSwapRelatedMessage = () => {
        // Launchpad Deposit
        if (tx.actionType === DexEvent.LAUNCHPAD_DEPOSIT) {
          const tokenAAmount = formatPoolPairAmount(tx?.tokenAAmount, {
            decimals: tx.tokenA.decimals,
            isKMB: false,
          });
          const tokenASymbol = tx?.tokenA?.symbol;
          return (
            <span className="accent">{` ${tokenAAmount} ${tokenASymbol}`}</span>
          );
        }

        const token0Amount = formatPoolPairAmount(tx?.tokenAAmount, {
          decimals: tx.tokenA.decimals,
          isKMB: false,
        });
        const token0symbol = tx?.tokenA?.symbol;
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
        const token1symbol = tx?.tokenB?.symbol;
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
      };

      const getGovernanceRelatedMessage = () => {
        switch (tx.actionType) {
          case DexEvent.DELEGATE:
            return (
              <>
                <span className="accent">
                  {` ${formatPoolPairAmount(tx?.tokenAAmount, {
                    decimals: tx.tokenA.decimals,
                    isKMB: false,
                  })} GNS `}
                </span>
                for
                <span className="accent">
                  {` ${formatPoolPairAmount(tx?.tokenAAmount, {
                    decimals: tx.tokenA.decimals,
                    isKMB: false,
                  })} xGNS`}
                </span>
              </>
            );
          case DexEvent.UNDELEGATE:
            return (
              <>
                <span className="accent">
                  {` ${formatPoolPairAmount(tx?.tokenAAmount, {
                    decimals: tx.tokenA.decimals,
                    isKMB: false,
                  })} xGNS `}
                </span>
                for
                <span className="accent">
                  {` ${formatPoolPairAmount(tx?.tokenAAmount, {
                    decimals: tx.tokenA.decimals,
                    isKMB: false,
                  })} GNS`}
                </span>
              </>
            );
          case DexEvent.COLLECT_UNDEL:
            return (
              <span className="accent">
                {` ${formatPoolPairAmount(tx?.tokenAAmount, {
                  decimals: tx.tokenA.decimals,
                  isKMB: false,
                })} GNS `}
              </span>
            );
          case DexEvent.PROPOSE_TEXT:
          case DexEvent.PROPOSE_COMM_POOL_SPEND:
          case DexEvent.PROPOSE_PARAM_CHANGE:
          case DexEvent.EXECUTE_PROPOSAL:
          case DexEvent.CANCEL_PROPOSAL:
            return (
              <>
                <span className="accent">{` #${tx?.tokenAAmount} `}</span>
                Proposal
              </>
            );
          case DexEvent.VOTE:
            return (
              <>
                <span className="accent">{` ${formatPoolPairAmount(
                  tx?.tokenAAmount,
                  {
                    decimals: tx.tokenA.decimals,
                    isKMB: false,
                  },
                )} xGNS `}</span>
                for
                <span className="accent">{` ${tx?.tokenBAmount
                  .slice(0, 1)
                  .toUpperCase()}${tx?.tokenBAmount.slice(1)}`}</span>
              </>
            );
          default:
            return "-";
        }
      };

      // COLLECT_GOV_REWARD use getSwapRelatedMessage()
      return (
        <>
          {t(actionKeyMap[tx.actionType as DexEventType] || "Undefined Task")}
          {isGovernanceNoti(tx.actionType)
            ? getGovernanceRelatedMessage()
            : getSwapRelatedMessage()}
        </>
      );
    },
    [t],
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
                      {isGovernanceNoti(item.rawValue.actionType) &&
                      item.rawValue.actionType !== "DELEGATE" ? (
                        <MissingLogo
                          symbol={XGNS_TOKEN.symbol}
                          url={XGNS_TOKEN.logoURI}
                          width={24}
                          mobileWidth={24}
                        />
                      ) : (
                        <MissingLogo
                          symbol={item?.tokenInfo?.tokenA?.symbol}
                          url={item?.tokenInfo?.tokenA?.logoURI}
                          width={24}
                          mobileWidth={24}
                        />
                      )}
                    </DoubleLogoLocal>
                  )}
                  <div className="content-wrap">
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
                {isGovernanceNoti(item.rawValue.actionType) &&
                item.rawValue.actionType !== "DELEGATE" ? (
                  <MissingLogo
                    symbol={XGNS_TOKEN.symbol}
                    url={XGNS_TOKEN.logoURI}
                    width={24}
                    mobileWidth={24}
                  />
                ) : (
                  <MissingLogo
                    symbol={item?.tokenInfo?.tokenA?.symbol}
                    url={item?.tokenInfo?.tokenA?.logoURI}
                    width={24}
                    mobileWidth={24}
                  />
                )}
              </DoubleLogoDense>
            )}
            <div className="summary-content">
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
