// TODO : remove eslint-disable after work
/* eslint-disable */
import React from "react";
import { type Activity } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import {
  HoverSection,
  TableColumn,
  TokenInfoWrapper,
  IconButton,
  TableColumnTooltipContent,
} from "./ActivityInfo.styles";
import {
  ACTIVITY_TD_WIDTH,
  MOBILE_ACTIVITY_TD_WIDTH,
} from "@constants/skeleton.constant";
import Tooltip from "@components/common/tooltip/Tooltip";
import { formatAddress } from "@utils/string-utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getLocalizeTime } from "@utils/chart";
import { getDateUtcToLocal } from "@common/utils/date-util";
dayjs.extend(relativeTime);

interface ActivityInfoProps {
  item: Activity;
  idx?: number;
  key?: number;
}

const ActivityInfo: React.FC<ActivityInfoProps> = ({ item, idx, key }) => {
  const { action, totalValue, tokenAmountOne, tokenAmountTwo, account, time } =
    item;
  const adjective = ["for", "and"];
  const timeFormat = getDateUtcToLocal(time);
  return (
    <TokenInfoWrapper key={key}>
      <HoverSection>
        <TableColumn className="left" tdWidth={ACTIVITY_TD_WIDTH[0]}>
          <span className="token-index">
            {action.split(" ").some(i => adjective.includes(i))
              ? action.split(" ").map((text, idx) => {
                  return idx === action.split(" ").length - 1 ||
                    idx === action.split(" ").length - 3 ? (
                    <span className="symbol-text">{text}</span>
                  ) : (
                    text + " "
                  );
                })
              : action.split(" ").map((text, idx) => {
                  return idx === action.split(" ").length - 1 ? (
                    <span className="symbol-text">{text}</span>
                  ) : (
                    text + " "
                  );
                })}
            <IconButton
              onClick={() => {
                window.open(item.explorerUrl, "_blank");
              }}
            >
              <IconOpenLink className="action-icon" />
            </IconButton>
          </span>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_TD_WIDTH[1]}>
          <span className="token-index">{totalValue}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_TD_WIDTH[2]}>
          <span className="token-index">{tokenAmountOne}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_TD_WIDTH[3]}>
          <span className="token-index">{tokenAmountTwo}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_TD_WIDTH[4]}>
          <Tooltip
            placement="top"
            FloatingContent={
              <TableColumnTooltipContent>
                {account}
              </TableColumnTooltipContent>
            }
          >
            <span className="token-index tooltip-label">{formatAddress(account)}</span>
          </Tooltip>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_TD_WIDTH[5]}>
          <Tooltip
            placement="top"
            FloatingContent={
              <TableColumnTooltipContent>
                {`${timeFormat.value} (UTC+${timeFormat.offsetHours})`}
              </TableColumnTooltipContent>
            }
          >
            <span className="token-index tooltip-label">{dayjs(time).fromNow()}</span>
          </Tooltip>
        </TableColumn>
      </HoverSection>
    </TokenInfoWrapper>
  );
};

export const MobileActivityInfo: React.FC<ActivityInfoProps> = ({
  item,
  idx,
  key,
}) => {
  const { action, totalValue, tokenAmountOne, tokenAmountTwo, account, time } =
    item;
  const adjective = ["for", "and"];
  const timeFormat = getDateUtcToLocal(time);
  return (
    <TokenInfoWrapper key={key}>
      <HoverSection>
        <TableColumn className="left" tdWidth={MOBILE_ACTIVITY_TD_WIDTH[0]}>
          <span className="token-index">
            {action.split(" ").some(i => adjective.includes(i))
              ? action.split(" ").map((text, idx) => {
                  return idx === action.split(" ").length - 1 ||
                    idx === action.split(" ").length - 3 ? (
                    <span className="symbol-text">{text}</span>
                  ) : (
                    text + " "
                  );
                })
              : action.split(" ").map((text, idx) => {
                  return idx === action.split(" ").length - 1 ? (
                    <span className="symbol-text">{text}</span>
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
        </TableColumn>
        <TableColumn className="right" tdWidth={MOBILE_ACTIVITY_TD_WIDTH[1]}>
          <span className="token-index">{totalValue}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={MOBILE_ACTIVITY_TD_WIDTH[2]}>
          <span className="token-index">{tokenAmountOne}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={MOBILE_ACTIVITY_TD_WIDTH[3]}>
          <span className="token-index">{tokenAmountTwo}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={MOBILE_ACTIVITY_TD_WIDTH[4]}>
          <Tooltip
            placement="top"
            FloatingContent={
              <TableColumnTooltipContent>
                {account}
              </TableColumnTooltipContent>
            }
          >
            <span className="token-index">{formatAddress(account)}</span>
          </Tooltip>
        </TableColumn>
        <TableColumn className="right" tdWidth={MOBILE_ACTIVITY_TD_WIDTH[5]}>
          <Tooltip
            placement="top"
            FloatingContent={
              <TableColumnTooltipContent>
                {`${timeFormat.value} (UTC+${timeFormat.offsetHours})`}
              </TableColumnTooltipContent>
            }
          >
            <span className="token-index">{dayjs(time).fromNow()}</span>
          </Tooltip>
        </TableColumn>
      </HoverSection>
    </TokenInfoWrapper>
  );
};
export default ActivityInfo;
