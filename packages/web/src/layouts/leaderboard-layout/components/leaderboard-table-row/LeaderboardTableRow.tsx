import React from "react";
import {
  HoverOnBgSection,
  HoverSection,
  TableColumn,
  Wrapper,
  WrapperHoverBackground,
} from "./LeaderboardTableRow.styles";
import PointComposition, { PointCompositionItem } from "../point-composition/PointComposition";
import DelegationPoint from "../delegation-point/DelegationPoint";
import StakingPoint from "../staking-point/StakingPoint";
import SwapPoint from "../swap-point/SwapPoint";
import UserColumn from "../user-column/UserColumn";
import { LeaderboardUser } from "@repositories/leaderboard/response/common/types";
import { getGlobalCapRatio, isLeaderboardHidden } from "@utils/leaderboard-utils";

const LeaderboardTableRow = ({
  myAddress,
  data,
  tdWidths,
  isMobile,
  isMe = false,
  rankOffset = 0,
}: {
  myAddress: string | undefined;
  data: LeaderboardUser;
  tdWidths: number[];
  isMobile: boolean;
  isMe?: boolean;
  rankOffset?: number;
}) => {
  const Hover = isMe ? HoverSection : HoverOnBgSection;
  const TableWrapper = isMe ? WrapperHoverBackground : Wrapper;

  const pointItems = React.useMemo<PointCompositionItem[]>(
    () => [
      { label: "Leaderboard:list.column.staking", point: data.positionStakingPoint },
      { label: "Leaderboard:list.column.delegation", point: data.gnsDelegationPoint },
      { label: "Leaderboard:list.column.swap", point: data.swapPoint },
      { label: "Leaderboard:list.column.referral", point: data.referralPoint },
    ],
    [data.positionStakingPoint, data.gnsDelegationPoint, data.swapPoint, data.referralPoint],
  );

  const globalCapRatio = React.useMemo(
    () => getGlobalCapRatio(data.swapPoint, data.swapRawPoint, data.swapCapPoint),
    [data.swapPoint, data.swapRawPoint, data.swapCapPoint],
  );

  const displayRankNumber = React.useMemo(() => {
    const rank = Number(data.rank);
    if (!Number.isFinite(rank) || rank <= 0) return "-";
    if (!rankOffset || rank > rankOffset) return rank;
    return rank + rankOffset;
  }, [data.rank, rankOffset]);

  const displayRank = React.useMemo(() => {
    if (displayRankNumber === "-") return displayRankNumber;
    return `#${displayRankNumber}`;
  }, [displayRankNumber]);

  const displayUser = React.useMemo(() => {
    if (displayRankNumber === "-" || displayRankNumber === data.rank) return data;
    return { ...data, rank: displayRankNumber };
  }, [data, displayRankNumber]);

  return (
    <TableWrapper>
      <TableColumn tdWidth={tdWidths.at(0)}>{displayRank}</TableColumn>
      <Hover style={isLeaderboardHidden(data.hiddenYn) ? { cursor: "auto" } : {}}>
        <UserColumn
          myAddress={myAddress}
          user={displayUser}
          isMe={isMe}
          tdWidth={tdWidths.at(1)}
          style={{ justifyContent: "flex-start" }}
        />
      </Hover>
      <Hover style={{ cursor: "auto" }}>
        {!isMobile && (
          <>
            <TableColumn tdWidth={tdWidths.at(2)} style={{ justifyContent: "flex-start" }}>
              <SwapPoint swapPoint={data.swapPoint} swapRawPoint={data.swapRawPoint} swapCapPoint={data.swapCapPoint} />
            </TableColumn>
            <TableColumn tdWidth={tdWidths.at(3)}>
              <StakingPoint positionStakingPoint={data.positionStakingPoint} holdingDetail={data.holdingDetail} />
            </TableColumn>
            <TableColumn tdWidth={tdWidths.at(4)}>
              <DelegationPoint gnsDelegationPoint={data.gnsDelegationPoint} holdingDetail={data.holdingDetail} />
            </TableColumn>
          </>
        )}
        <TableColumn tdWidth={tdWidths.at(isMobile ? 2 : 5)}>
          <PointComposition
            totalPoint={data.totalPoint}
            items={pointItems}
            globalCapRatio={globalCapRatio}
            isProvisional={data.isProvisional}
            isMobile={isMobile}
          />
        </TableColumn>
      </Hover>
    </TableWrapper>
  );
};

export default LeaderboardTableRow;
