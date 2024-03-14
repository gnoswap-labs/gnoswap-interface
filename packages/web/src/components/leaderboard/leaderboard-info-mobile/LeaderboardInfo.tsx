import { TableColumn, Wrapper } from "./LeaderboardInfo.styles";
import { Leader } from "@containers/leaderboard-list-container/LeaderboardListContainer";
import UserColumn from "../user-column/UserColumn";
import PointComposition from "../point-composition/PointComposition";

const LeaderboardInfoMobile = ({
  item,
  tdWidths,
  isMobile,
  children,
}: {
  item: Leader;
  tdWidths: number[];
  isMobile: boolean;
  children?: React.ReactNode;
}) => {
  const {
    rank,
    user,
    points,
    swapPoint,
    positionPoint,
    stakingPoint,
    referralPoint,
  } = item;

  return (
    <Wrapper>
      <TableColumn tdWidth={tdWidths[0]}>#{rank}</TableColumn>
      <UserColumn rank={rank} user={user} tdWidth={tdWidths[1]}>
        {children}
      </UserColumn>
      <TableColumn tdWidth={tdWidths[2]}>
        <PointComposition
          points={points}
          swapPoint={swapPoint}
          positionPoint={positionPoint}
          stakingPoint={stakingPoint}
          referralPoint={referralPoint}
          isMobile={isMobile}
        />
      </TableColumn>
    </Wrapper>
  );
};

export default LeaderboardInfoMobile;
