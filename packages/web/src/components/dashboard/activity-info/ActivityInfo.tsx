import React, { useMemo } from "react";
import { type Activity } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import {
  HoverSection,
  TableColumn,
  TokenInfoWrapper,
  IconButton,
  TableColumnTooltipContent,
  MobileActivitiesWrapper,
  MobileTableColumn,
} from "./ActivityInfo.styles";
import Tooltip from "@components/common/tooltip/Tooltip";
import { formatAddress } from "@utils/string-utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getDateDiff } from "@common/utils/date-util";
import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";
import {
  ACTIVITY_INFO,
  MOBILE_ACTIVITY_INFO,
} from "@constants/skeleton.constant";
dayjs.extend(relativeTime);

interface ActivityInfoProps {
  item: Activity;
  idx?: number;
  key?: number;
}

const ActivityInfo: React.FC<ActivityInfoProps> = ({ item }) => {
  const { action, totalValue, tokenAmountOne, tokenAmountTwo, account, time } =
    item;
  const adjective = useMemo(() => ["for", "and"], []);

  const actionText = useMemo(() => {
    if (action.split(" ").some(i => adjective.includes(i))) {
      return action.split(" ").map((text, idx) => {
        return idx === action.split(" ").length - 1 ||
          idx === action.split(" ").length - 3 ? (
          <span key={idx} className="symbol-text">
            {text}
          </span>
        ) : (
          text + " "
        );
      });
    }

    return action.split(" ").map((text, idx) => {
      return idx === action.split(" ").length - 1 ? (
        <span key={idx} className="symbol-text">
          {text}
        </span>
      ) : (
        text + " "
      );
    });
  }, [action, adjective]);

  return (
    <TokenInfoWrapper>
      <HoverSection>
        <TableColumn className="left" tdWidth={ACTIVITY_INFO.list[0].width}>
          <span className="token-index">
            {actionText}
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
              {getDateDiff(time)}
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
  const adjective = ["for", "and"];

  return (
    <MobileActivitiesWrapper>
      <HoverSection>
        <MobileTableColumn
          className="left"
          tdWidth={MOBILE_ACTIVITY_INFO.list[0].width}
        >
          <span className="cell">
            {action.split(" ").some(i => adjective.includes(i))
              ? action.split(" ").map((text, idx) => {
                  return idx === action.split(" ").length - 1 ||
                    idx === action.split(" ").length - 3 ? (
                    <span key={idx} className="symbol-text">
                      {text}
                    </span>
                  ) : (
                    text + " "
                  );
                })
              : action.split(" ").map((text, idx) => {
                  return idx === action.split(" ").length - 1 ? (
                    <span key={idx} className="symbol-text">
                      {text}
                    </span>
                  ) : (
                    text + " "
                  );
                })}
            <IconButton
              onClick={() => {
                alert("open Link");
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
