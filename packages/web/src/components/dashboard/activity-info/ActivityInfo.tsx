// TODO : remove eslint-disable after work
/* eslint-disable */
import React from "react";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { type Activity } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import {
  HoverSection,
  TableColumn,
  TokenInfoWrapper,
  IconButton,
} from "./ActivityInfo.styles";
import { ACTIVITY_TD_WIDTH } from "@constants/skeleton.constant";

interface ActivityInfoProps {
  item: Activity;
  idx: number;
}

const ActivityInfo: React.FC<ActivityInfoProps> = ({ item, idx }) => {
  const { action, totalValue, tokenAmountOne, tokenAmountTwo, account, time } =
    item;
  return (
    <TokenInfoWrapper>
      <HoverSection>
        <TableColumn className="left" tdWidth={ACTIVITY_TD_WIDTH[0]}>
          <span className="token-index">
            {action}
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
          <span className="token-index">{account}</span>
        </TableColumn>
        <TableColumn className="right" tdWidth={ACTIVITY_TD_WIDTH[5]}>
          <span className="token-index">{time}</span>
        </TableColumn>
      </HoverSection>
    </TokenInfoWrapper>
  );
};

export default ActivityInfo;
