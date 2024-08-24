import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { ReactNode } from "react";

import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  ACTIVITY_INFO,
  MOBILE_ACTIVITY_INFO,
} from "@constants/skeleton.constant";
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
  item: Activity;
  idx?: number;
  key?: number;
}

const ActivityInfo: React.FC<ActivityInfoProps> = ({ item }) => {
  const { action, totalValue, tokenAmountOne, tokenAmountTwo, account, time } =
    item;

  return (
    <TokenInfoWrapper>
      <HoverSection>
        <TableColumn className="left" tdWidth={ACTIVITY_INFO.list[0].width}>
          <span className="token-index">
            {action}
            <IconButton
              onClick={() => {
                window.open(item.explorerUrl, "_blank");
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
  const { action, totalValue, tokenAmountOne, tokenAmountTwo, account, time } =
    item;

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
                window.open(item.explorerUrl, "_blank");
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
