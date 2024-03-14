import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import {
  TableHeader,
  TableWrapper,
  ListBody,
  ListHead,
  ScrollWrapper,
} from "./LeaderboardListTable.styles";
import {
  LEADERBOARD_TD_WIDTH,
  LEADER_INFO,
  MOBILE_LEADERBOARD_TD_WIDTH,
  MOBILE_LEADER_INFO,
  TABLET_LEADERBOARD_TD_WIDTH,
  TABLET_LEADER_INFO,
} from "@constants/skeleton.constant";
import {
  Leader,
  TABLE_HEAD,
  TABLE_HEAD_MOBILE,
} from "@containers/leaderboard-list-container/LeaderboardListContainer";
import LeaderboardInfo from "../leaderboard-info/LeaderboardInfo";
import LeaderboardInfoMobile from "../leaderboard-info-mobile/LeaderboardInfo";
import IconMeLogo from "@components/common/icons/IconMeLogo";
import React from "react";
import { useConnection } from "@hooks/connection/use-connection";
import { useWindowSize } from "@hooks/common/use-window-size";

export default function LeaderboardListTable({
  me,
  leaders,
  isFetched,
}: {
  me: Leader;
  leaders: Leader[];
  isFetched: boolean;
}) {
  const { connected } = useConnection();
  const { isMobile, isTablet } = useWindowSize();

  const heads = (isMobile && TABLE_HEAD_MOBILE) || TABLE_HEAD;

  const skeleton =
    (isMobile && MOBILE_LEADER_INFO) ||
    (isTablet && TABLET_LEADER_INFO) ||
    LEADER_INFO;

  const widths =
    (isMobile && MOBILE_LEADERBOARD_TD_WIDTH) ||
    (isTablet && TABLET_LEADERBOARD_TD_WIDTH) ||
    LEADERBOARD_TD_WIDTH;

  const displayList = (item: Leader, children?: React.ReactNode) =>
    isMobile ? (
      <LeaderboardInfoMobile
        key={item.user}
        item={item}
        tdWidths={widths}
        isMobile={isMobile}
      >
        {children}
      </LeaderboardInfoMobile>
    ) : (
      <LeaderboardInfo
        key={item.user}
        item={item}
        tdWidths={widths}
        isMobile={isMobile}
      >
        {children}
      </LeaderboardInfo>
    );

  return (
    <TableWrapper>
      <ScrollWrapper>
        <ListHead>
          {Object.values(heads).map((head, index) => (
            <TableHeader key={index} tdWidth={widths[index]}>
              <span>{head}</span>
            </TableHeader>
          ))}
        </ListHead>
        <ListBody>
          {isFetched ? (
            <>
              {connected && displayList(me, <IconMeLogo />)}
              {leaders.map(displayList)}
            </>
          ) : (
            <TableSkeleton info={skeleton} />
          )}
        </ListBody>
      </ScrollWrapper>
    </TableWrapper>
  );
}
