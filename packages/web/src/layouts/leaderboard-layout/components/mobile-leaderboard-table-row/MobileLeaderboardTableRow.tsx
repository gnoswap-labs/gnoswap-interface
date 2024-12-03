import { TableColumn, Wrapper } from "./MobileLeaderboardTableRow.styles";
import UserColumn from "../user-column/UserColumn";
import PointComposition from "../point-composition/PointComposition";
import { LeaderModel } from "@models/leaderboard/leader-model";

const MobileLeaderboardTableRow = ({
  item,
  tdWidths,
  isMobile,
  isMe = false,
}: {
  item: LeaderModel;
  tdWidths: number[];
  isMobile: boolean;
  isMe?: boolean;
}) => {
  const {
    rank,

    hide,

    mobileSpecificFormattedAddress,
    address,

    pointSum,
    swapFeePoint,
    poolRewardPoint,
    stakingRewardPoint,
    referralRewardPoint,
  } = item;

  return (
    <Wrapper hover={isMe}>
      <TableColumn tdWidth={tdWidths[0]}>#{rank}</TableColumn>
      <UserColumn
        rank={rank}
        user={mobileSpecificFormattedAddress}
        address={address}
        hide={hide}
        isMe={isMe}
        tdWidth={tdWidths[1]}
        style={hide ? { cursor: "auto" } : { cursor: "pointer" }}
      />
      <TableColumn tdWidth={tdWidths[2]}>
        <PointComposition
          points={pointSum}
          swapPoint={swapFeePoint}
          positionPoint={poolRewardPoint}
          stakingPoint={stakingRewardPoint}
          referralPoint={referralRewardPoint}
          isMobile={isMobile}
        />
      </TableColumn>
    </Wrapper>
  );
};

export default MobileLeaderboardTableRow;
