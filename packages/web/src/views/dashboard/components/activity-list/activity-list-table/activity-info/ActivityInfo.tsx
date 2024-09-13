import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TFunction } from "i18next";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  ACTIVITY_INFO,
  MOBILE_ACTIVITY_INFO,
} from "@constants/skeleton.constant";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { ActivityData } from "@repositories/activity/responses/activity-responses";
import { DexEvent } from "@repositories/common";
import {
  formatOtherPrice,
  formatPoolPairAmount,
} from "@utils/new-number-utils";
import { formatAddress } from "@utils/string-utils";

import {
  HoverSection,
  IconButton,
  MobileActivitiesWrapper,
  MobileTableColumn,
  TableColumn,
  TableColumnTooltipContent,
  TokenInfoWrapper,
} from "./ActivityInfo.styles";

dayjs.extend(relativeTime);

export interface Activity {
  action: ReactNode;
  totalValue: string;
  tokenAmountOne: string;
  tokenAmountTwo: string;
  account: string;
  time: string;
  explorerUrl: string;
}

interface ActivityInfoProps {
  item: ActivityData;
  idx?: number;
  key?: number;
}

const ActivityInfo: React.FC<ActivityInfoProps> = ({ item }) => {
  const { t } = useTranslation();
  const { getTxUrl } = useGnoscanUrl();

  const {
    action,
    totalValue,
    tokenAmountOne,
    tokenAmountTwo,
    account,
    time,
    explorerUrl,
  } = formatActivity(item, t, getTxUrl(item.txHash));

  return (
    <TokenInfoWrapper>
      <HoverSection>
        <TableColumn className="left" tdWidth={ACTIVITY_INFO.list[0].width}>
          <span className="token-index">
            {action}
            <IconButton
              onClick={() => {
                window.open(explorerUrl, "_blank");
              }}
            >
              <IconOpenLink className="action-icon" />
            </IconButton>
          </span>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_INFO.list[1].width}>
          <span className="token-index">{totalValue}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_INFO.list[2].width}>
          <span className="token-index">{tokenAmountOne}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_INFO.list[3].width}>
          <span className="token-index">{tokenAmountTwo}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_INFO.list[4].width}>
          <Tooltip
            placement="top"
            FloatingContent={
              <TableColumnTooltipContent>{account}</TableColumnTooltipContent>
            }
          >
            <span className="token-index tooltip-label">
              {formatAddress(account || "")}
            </span>
          </Tooltip>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_INFO.list[5].width}>
          <DateTimeTooltip date={time}>
            <span className="token-index tooltip-label">
              {dayjs(time).fromNow()}
            </span>
          </DateTimeTooltip>
        </TableColumn>
      </HoverSection>
    </TokenInfoWrapper>
  );
};

export const MobileActivityInfo: React.FC<ActivityInfoProps> = ({ item }) => {
  const { t } = useTranslation();
  const {getTxUrl} = useGnoscanUrl();

  const {
    action,
    totalValue,
    tokenAmountOne,
    tokenAmountTwo,
    account,
    time,
    explorerUrl,
  } = formatActivity(item, t, getTxUrl(item.txHash));

  return (
    <MobileActivitiesWrapper>
      <HoverSection>
        <MobileTableColumn
          className="left"
          tdWidth={MOBILE_ACTIVITY_INFO.list[0].width}
        >
          <span className="cell">
            {action}
            <IconButton
              onClick={() => {
                window.open(explorerUrl, "_blank");
              }}
            >
              <IconOpenLink className="action-icon" />
            </IconButton>
          </span>
        </MobileTableColumn>
        <MobileTableColumn
          className="right"
          tdWidth={MOBILE_ACTIVITY_INFO.list[1].width}
        >
          <span className="cell">{totalValue}</span>
        </MobileTableColumn>
        <MobileTableColumn
          className="right"
          tdWidth={MOBILE_ACTIVITY_INFO.list[2].width}
        >
          <span className="cell token-amount">{tokenAmountOne}</span>
        </MobileTableColumn>
        <MobileTableColumn
          className="right"
          tdWidth={MOBILE_ACTIVITY_INFO.list[3].width}
        >
          <span className="cell token-amount">{tokenAmountTwo}</span>
        </MobileTableColumn>
        <MobileTableColumn
          className="right"
          tdWidth={MOBILE_ACTIVITY_INFO.list[4].width}
        >
          <Tooltip
            placement="top"
            FloatingContent={
              <TableColumnTooltipContent>{account}</TableColumnTooltipContent>
            }
          >
            <span className="cell">{formatAddress(account)}</span>
          </Tooltip>
        </MobileTableColumn>
        <MobileTableColumn
          className="right"
          tdWidth={MOBILE_ACTIVITY_INFO.list[5].width}
        >
          <DateTimeTooltip placement={"top-end"} date={time}>
            <span className="cell">{dayjs(time).fromNow()}</span>
          </DateTimeTooltip>
        </MobileTableColumn>
      </HoverSection>
    </MobileActivitiesWrapper>
  );
};
export default ActivityInfo;

const formatActivity = (
  res: ActivityData,
  t: TFunction<"translation", undefined>,
  explorerUrl: string,
): Activity => {
  const tokenASymbol = res.tokenA.symbol;
  const tokenBSymbol = res.tokenB.symbol;
  const shouldShowTokenAAmount =
    res.actionType !== DexEvent.CLAIM_FEE ||
    (!!res.tokenAAmount && !!Number(res.tokenAAmount));
  const shouldShowTokenBAmount =
    res.actionType !== DexEvent.CLAIM_FEE ||
    (!!res.tokenBAmount && !!Number(res.tokenBAmount));

  const actionText = (() => {
    const action = (() => {
      switch (res.actionType) {
        // Swap
        case DexEvent.SWAP:
          return t("business:onchainActi.action.swap");
        // Pool
        case DexEvent.ADD:
          return t("business:onchainActi.action.add");
        case DexEvent.REMOVE:
          return t("business:onchainActi.action.remove");
        case DexEvent.DECREASE:
          return t("business:onchainActi.action.decrease");
        case DexEvent.INCREASE:
          return t("business:onchainActi.action.increase");
        case DexEvent.REPOSITION:
          return t("business:onchainActi.action.reposition");
        case DexEvent.CLAIM_FEE:
          return t("business:onchainActi.action.claimFees");
        case DexEvent.ADD_INCENTIVE:
          return t("business:onchainActi.action.incentivize");
        // Staking
        case DexEvent.STAKE:
          return t("business:onchainActi.action.stake");
        case DexEvent.UNSTAKE:
          return t("business:onchainActi.action.unstake");
        case DexEvent.CLAIM_REWARD:
          return t("business:onchainActi.action.claimRewards");
        // Governance
        case DexEvent.DELEGATE:
          return t("business:onchainActi.action.stake");
        case DexEvent.UNDELEGATE:
          return t("business:onchainActi.action.unstake");
        case DexEvent.COLLECT_UNDEL:
        case DexEvent.COLLECT_GOV_REWARD:
          return t("business:onchainActi.action.claimRewards");
      }
    })();

    const tokenAText =
      shouldShowTokenAAmount && tokenASymbol ? " " + tokenASymbol : "";
    const tokenBText =
      shouldShowTokenBAmount && tokenBSymbol ? " " + tokenBSymbol : "";

    const relatedTokens = res.usedTokens || 0;

    let conjunction = "";
    if (relatedTokens === 2 && tokenAText && tokenBText) {
      conjunction = ` ${
        res.actionType === DexEvent.SWAP
          ? t("common:conjunction.for")
          : t("common:conjunction.and")
      }`;
    } else if (relatedTokens > 2) {
      conjunction = ", ";
    }

    const tail = relatedTokens > 2 && ", ...";

    return (
      <span>
        {action}
        <span className="symbol-text">{tokenAText}</span>
        {conjunction}
        <span className="symbol-text">{tokenBText}</span>
        {tail}
      </span>
    );
  })();

  const tokenAAmount =
    tokenASymbol && shouldShowTokenAAmount
      ? `${formatPoolPairAmount(res.tokenAAmount, {
          decimals: res.tokenA.decimals,
        })} ${res.tokenA.symbol}`
      : "-";

  const tokenBAmount =
    tokenBSymbol && shouldShowTokenBAmount
      ? `${formatPoolPairAmount(res.tokenBAmount, {
          decimals: res.tokenB.decimals,
        })} ${res.tokenB.symbol}`
      : "-";

  return {
    action: actionText,
    totalValue:
      res.totalUsd === "0"
        ? "<$0.01"
        : formatOtherPrice(res.totalUsd, {
            isKMB: false,
          }),
    tokenAmountOne: tokenAAmount,
    tokenAmountTwo: tokenBAmount,
    account: res.account,
    time: res.time,
    explorerUrl,
  };
};
