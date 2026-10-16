import React from "react";
import {
  HoverOnBgSection,
  HoverSection,
  TableColumn,
  Wrapper,
  WrapperHoverBackground,
} from "./LeaderboardTableRow.styles";
import PointComposition, { PointCompositionItem } from "../point-composition/PointComposition";
import SwapPoint from "../swap-point/SwapPoint";
import UserColumn from "../user-column/UserColumn";
import { LeaderboardUser } from "@repositories/leaderboard/response/common/types";
import { formatLeaderboardPoint, isLeaderboardHidden, isRoundLeaderboardUser } from "@utils/leaderboard-utils";
import { formatOtherPrice } from "@utils/new-number-utils";

const formatUsdValue = (value: string | number | null) => {
  if (value == null || value === "") return "-";
  return formatOtherPrice(value, { isKMB: false });
};

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
  const isRound = isRoundLeaderboardUser(data);

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

  const pointItems = React.useMemo<PointCompositionItem[]>(() => {
    if (isRound) {
      return [
        { label: "Leaderboard:list.column.swap", point: data.swapPoint },
        { label: "Leaderboard:list.column.swapRaw", point: data.swapRawPoint },
        { label: "Leaderboard:list.column.swapCap", point: data.swapCapPoint },
        { label: "Leaderboard:list.column.staking", point: data.positionStakingPoint },
        { label: "Leaderboard:list.column.delegation", point: data.gnsDelegationPoint },
        { label: "Leaderboard:list.column.referral", point: data.referralPoint },
      ];
    }

    return [
      { label: "Leaderboard:list.column.swap", point: data.paidSwapFeePoint },
      { label: "Leaderboard:list.column.position", point: data.providedLiquidityFeePoint },
      { label: "Leaderboard:list.column.staking", point: data.stakingRewardsPoint },
      { label: "Leaderboard:list.column.xGNS", point: data.governanceRewardsPoint },
      { label: "Leaderboard:list.column.referral", point: data.referralPoint },
    ];
  }, [isRound, data]);

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
              {isRound ? (
                <SwapPoint
                  swapPoint={data.swapPoint}
                  swapRawPoint={data.swapRawPoint}
                  swapCapPoint={data.swapCapPoint}
                />
              ) : (
                displayValues.swap
              )}
            </TableColumn>
            <TableColumn tdWidth={tdWidths.at(3)}>
              {isRound ? formatLeaderboardPoint(data.positionStakingPoint) : displayValues.position}
            </TableColumn>
            <TableColumn tdWidth={tdWidths.at(4)}>
              {isRound ? formatLeaderboardPoint(data.gnsDelegationPoint) : displayValues.staking}
            </TableColumn>
          </>
        )}
        <TableColumn tdWidth={tdWidths.at(isMobile ? 2 : 5)}>
          <PointComposition totalPoint={data.totalPoint} items={pointItems} isMobile={isMobile} />
        </TableColumn>
      </Hover>
    </TableWrapper>
  );
};

export default LeaderboardTableRow;
