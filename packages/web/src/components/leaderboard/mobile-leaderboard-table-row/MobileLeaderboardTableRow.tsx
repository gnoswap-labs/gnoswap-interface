import { TableColumn, Wrapper } from "./MobileLeaderboardTableRow.styles";
import UserColumn from "../user-column/UserColumn";
import PointComposition from "../point-composition/PointComposition";
import { Leader } from "@repositories/leaderboard/response/common/types";

const MobileLeaderboardTableRow = ({
  item,
  tdWidths,
  isMobile,
  me = false,
}: {
  item: Leader;
  tdWidths: number[];
  isMobile: boolean;
  me?: boolean;
}) => {
  const {
    rank,
    user,
    address,
    points,
    swapPoint,
    positionPoint,
    stakingPoint,
    referralPoint,
  } = item;

  return (
    <Wrapper>
      <TableColumn tdWidth={tdWidths[0]}>#{rank}</TableColumn>
      <UserColumn
        rank={rank}
        user={user}
        address={address}
        me={me}
        tdWidth={tdWidths[1]}
      />
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

export default MobileLeaderboardTableRow;
