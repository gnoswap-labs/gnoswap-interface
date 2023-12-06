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

interface ActivityInfoProps {
  item: Activity;
  idx?: number;
  key?: number;
}

const ActivityInfo: React.FC<ActivityInfoProps> = ({ item, idx, key }) => {
  const { action, totalValue, tokenAmountOne, tokenAmountTwo, account, time } =
    item;
  const adjective = ["for", "and"];
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
                alert("open Link");
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
                g1c4f5pn9zatmyxrndncv3zsq8qmk33vf4g9gm7h
              </TableColumnTooltipContent>
            }
          >
            <span className="token-index tooltip-label">{account}</span>
          </Tooltip>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_TD_WIDTH[5]}>
          <Tooltip
            placement="top"
            FloatingContent={
              <TableColumnTooltipContent>
                2023-06-13 18:05:11 (UTC+9)
              </TableColumnTooltipContent>
            }
          >
            <span className="token-index tooltip-label">{time}</span>
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
                g1c4f5pn9zatmyxrndncv3zsq8qmk33vf4g9gm7h
              </TableColumnTooltipContent>
            }
          >
            <span className="token-index">{account}</span>
          </Tooltip>
        </TableColumn>
        <TableColumn className="right" tdWidth={MOBILE_ACTIVITY_TD_WIDTH[5]}>
          <Tooltip
            placement="top"
            FloatingContent={
              <TableColumnTooltipContent>
                2023-06-13 18:05:11 (UTC+9)
              </TableColumnTooltipContent>
            }
          >
            <span className="token-index">{time}</span>
          </Tooltip>
        </TableColumn>
      </HoverSection>
    </TokenInfoWrapper>
  );
};
export default ActivityInfo;
