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
import { numberToInteger } from "@utils/string-utils";

const formatUsdValue = (value: string | number) => {
  if (value == null) return "-";
  return `$${numberToInteger(value)}`;
};

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

  const displayValues = React.useMemo(() => {
    const stakingTotal =
      data.stakingRewardsUsd && data.governanceRewardsUsd
        ? Number(data.stakingRewardsUsd) + Number(data.governanceRewardsUsd)
        : data.stakingRewardsUsd ?? data.governanceRewardsUsd ?? null;

    return {
      swap: formatUsdValue(data.swapFeeUsd),
      position: formatUsdValue(data.providedLiquidityFeeUsd),
      staking: formatUsdValue(stakingTotal),
    };
  }, [data.swapFeeUsd, data.providedLiquidityFeeUsd, data.stakingRewardsUsd, data.governanceRewardsUsd]);

  return (
    <TableWrapper>
      <TableColumn tdWidth={tdWidths.at(0)}>#{data.rank}</TableColumn>
      <Hover style={isLeaderboardHidden(data.hiddenYn) ? { cursor: "auto" } : {}}>
        <UserColumn user={data} isMe={isMe} tdWidth={tdWidths.at(1)} style={{ justifyContent: "flex-start" }} />
      </Hover>
      <Hover style={{ cursor: "auto" }}>
        <TableColumn tdWidth={tdWidths.at(2)} style={{ justifyContent: "flex-start" }}>
          {displayValues.swap}
        </TableColumn>
        <TableColumn tdWidth={tdWidths.at(3)}>{displayValues.position}</TableColumn>
        <TableColumn tdWidth={tdWidths.at(4)}>{displayValues.staking}</TableColumn>
        <TableColumn tdWidth={tdWidths.at(5)}>
          <PointComposition
            totalPoint={data.totalPoint}
            swapPoint={data.paidSwapFeePoint}
            positionPoint={data.providedLiquidityFeePoint}
            stakingPoint={data.stakingRewardsPoint}
            governancePoint={data.governanceRewardsPoint}
            referralPoint={data.referralPoint}
            isMobile={isMobile}
          />
        </TableColumn>
      </Hover>
    </TableWrapper>
  );
};

export default LeaderboardTableRow;
