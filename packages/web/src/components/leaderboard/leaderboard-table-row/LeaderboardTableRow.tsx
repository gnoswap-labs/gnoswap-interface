import {
  HoverOnBgSection,
  HoverSection,
  TableColumn,
  Wrapper,
  WrapperHoverBackground,
} from "./LeaderboardTableRow.styles";
import PointComposition from "../point-composition/PointComposition";
import UserColumn from "../user-column/UserColumn";
import { LeaderModel } from "@models/leaderboard/leader-model";

const LeaderboardTableRow = ({
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

    formattedAddress,
    address,

    swapVolume,
    positionValue,
    stakingValue,

    pointSum,
    swapFeePoint,
    poolRewardPoint,
    stakingRewardPoint,
    referralRewardPoint,
  } = item;

  const Hover = isMe ? HoverSection : HoverOnBgSection;
  const TableWrapper = isMe ? WrapperHoverBackground : Wrapper;

  return (
    <TableWrapper>
      <TableColumn tdWidth={tdWidths.at(0)}>#{rank}</TableColumn>
      <Hover style={hide ? { cursor: "auto" } : {}}>
        <UserColumn
          rank={rank}
          user={formattedAddress}
          address={address}
          hide={hide}
          isMe={isMe}
          tdWidth={tdWidths.at(1)}
          style={{ justifyContent: "flex-start" }}
        />
      </Hover>
      <Hover style={{ cursor: "auto" }}>
        <TableColumn
          tdWidth={tdWidths.at(2)}
          style={{ justifyContent: "flex-start" }}
        >
          {swapVolume}
        </TableColumn>
        <TableColumn tdWidth={tdWidths.at(3)}>{positionValue}</TableColumn>
        <TableColumn tdWidth={tdWidths.at(4)}>{stakingValue}</TableColumn>
        <TableColumn tdWidth={tdWidths.at(5)}>
          <PointComposition
            points={pointSum}
            swapPoint={swapFeePoint}
            positionPoint={poolRewardPoint}
            stakingPoint={stakingRewardPoint}
            referralPoint={referralRewardPoint}
            isMobile={isMobile}
          />
        </TableColumn>
      </Hover>
    </TableWrapper>
  );
};

export default LeaderboardTableRow;
