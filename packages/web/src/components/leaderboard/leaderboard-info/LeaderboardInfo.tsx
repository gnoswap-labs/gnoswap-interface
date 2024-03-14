import { HoverSection, TableColumn, Wrapper } from "./LeaderboardInfo.styles";
import { Leader } from "@containers/leaderboard-list-container/LeaderboardListContainer";
import PointComposition from "../point-composition/PointComposition";
import UserColumn from "../user-column/UserColumn";

export default function LeaderboardInfo({
  item,
  tdWidths,
  isMobile,
  children,
}: {
  item: Leader;
  tdWidths: number[];
  isMobile: boolean;
  children?: React.ReactNode;
}) {
  const {
    rank,
    user,
    volume,
    position,
    staking,
    points,
    swapPoint,
    positionPoint,
    stakingPoint,
    referralPoint,
  } = item;

  return (
    <Wrapper>
      <TableColumn tdWidth={tdWidths.at(0)}>#{rank}</TableColumn>
      <HoverSection>
        <UserColumn
          rank={rank}
          user={user}
          tdWidth={tdWidths.at(1)}
          style={{ justifyContent: "flex-start" }}
        >
          {children}
        </UserColumn>
      </HoverSection>
      <HoverSection style={{ cursor: "auto" }}>
        <TableColumn
          tdWidth={tdWidths.at(2)}
          style={{ justifyContent: "flex-start" }}
        >
          {volume}
        </TableColumn>
        <TableColumn tdWidth={tdWidths.at(3)}>{position}</TableColumn>
        <TableColumn tdWidth={tdWidths.at(4)}>{staking}</TableColumn>
        <TableColumn tdWidth={tdWidths.at(5)}>
          <PointComposition
            points={points}
            swapPoint={swapPoint}
            positionPoint={positionPoint}
            stakingPoint={stakingPoint}
            referralPoint={referralPoint}
            isMobile={isMobile}
          />
        </TableColumn>
      </HoverSection>
    </Wrapper>
  );
}
