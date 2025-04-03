import React from "react";
import {
  HoverOnBgSection,
  HoverSection,
  TableColumn,
  Wrapper,
  WrapperHoverBackground,
} from "./LeaderboardTableRow.styles";
import PointComposition from "../point-composition/PointComposition";
import UserColumn from "../user-column/UserColumn";
import { LeaderboardUser } from "@repositories/leaderboard/response/common/types";
import { isLeaderboardHidden } from "@utils/leaderboard-utils";
import { numberToFormat } from "@utils/string-utils";

const LeaderboardTableRow = ({
  data,
  tdWidths,
  isMobile,
  isMe = false,
}: {
  data: LeaderboardUser;
  tdWidths: number[];
  isMobile: boolean;
  isMe?: boolean;
}) => {
  const Hover = isMe ? HoverSection : HoverOnBgSection;
  const TableWrapper = isMe ? WrapperHoverBackground : Wrapper;

  const displaySwapVolume = React.useMemo(() => {
    if (!data.swapFeeUsd) return "-";
    return `$${numberToFormat(data.swapFeeUsd)}`;
  }, [data.swapFeeUsd]);

  const displayPositionValue = React.useMemo(() => {
    if (!data.providedLiquidityFeeUsd) return "-";
    return `$${numberToFormat(data.providedLiquidityFeeUsd)}`;
  }, [data.providedLiquidityFeeUsd]);

  const displayStakingValue = React.useMemo(() => {
    if (!data.stakingRewardsUsd) return "-";
    return `$${numberToFormat(data.stakingRewardsUsd)}`;
  }, [data.stakingRewardsUsd]);

  return (
    <TableWrapper>
      <TableColumn tdWidth={tdWidths.at(0)}>#{data.rank}</TableColumn>
      <Hover style={isLeaderboardHidden(data.hiddenYn) ? { cursor: "auto" } : {}}>
        <UserColumn user={data} isMe={isMe} tdWidth={tdWidths.at(1)} style={{ justifyContent: "flex-start" }} />
      </Hover>
      <Hover style={{ cursor: "auto" }}>
        <TableColumn tdWidth={tdWidths.at(2)} style={{ justifyContent: "flex-start" }}>
          {displaySwapVolume}
        </TableColumn>
        <TableColumn tdWidth={tdWidths.at(3)}>{displayPositionValue}</TableColumn>
        <TableColumn tdWidth={tdWidths.at(4)}>{displayStakingValue}</TableColumn>
        <TableColumn tdWidth={tdWidths.at(5)}>
          <PointComposition
            totalPoint={data.totalPoint}
            swapPoint={data.paidSwapFeePoint}
            positionPoint={data.providedLiquidityFeePoint}
            stakingPoint={data.stakingRewardsPoint}
            referralPoint={data.referralPoint}
            isMobile={isMobile}
          />
        </TableColumn>
      </Hover>
    </TableWrapper>
  );
};

export default LeaderboardTableRow;
