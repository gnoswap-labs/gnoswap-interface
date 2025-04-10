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

const formatUsdValue = (value: string | number) => {
  if (value == null || value === "") return "-";
  return `$${numberToFormat(value, { decimals: 2, forceDecimals: true, truncateDecimals: true })}`;
};

const LeaderboardTableRow = ({
  myAddress,
  data,
  tdWidths,
  isMobile,
  isMe = false,
}: {
  myAddress: string | undefined;
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

  const displayRank = React.useMemo(() => {
    if (!data.rank) return "-";
    return `#${data.rank}`;
  }, [data.rank]);

  return (
    <TableWrapper>
      <TableColumn tdWidth={tdWidths.at(0)}>{displayRank}</TableColumn>
      <Hover style={isLeaderboardHidden(data.hiddenYn) ? { cursor: "auto" } : {}}>
        <UserColumn
          myAddress={myAddress}
          user={data}
          isMe={isMe}
          tdWidth={tdWidths.at(1)}
          style={{ justifyContent: "flex-start" }}
        />
      </Hover>
      <Hover style={{ cursor: "auto" }}>
        {!isMobile && (
          <>
            <TableColumn tdWidth={tdWidths.at(2)} style={{ justifyContent: "flex-start" }}>
              {displayValues.swap}
            </TableColumn>
            <TableColumn tdWidth={tdWidths.at(3)}>{displayValues.position}</TableColumn>
            <TableColumn tdWidth={tdWidths.at(4)}>{displayValues.staking}</TableColumn>
          </>
        )}
        <TableColumn tdWidth={tdWidths.at(isMobile ? 2 : 5)}>
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
