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
  me = false,
}: {
  item: LeaderModel;
  tdWidths: number[];
  isMobile: boolean;
  me?: boolean;
}) => {
  const {
    rank,

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

  const Hover = me ? HoverSection : HoverOnBgSection;
  const TableWrapper = me ? WrapperHoverBackground : Wrapper;

  return (
    <TableWrapper>
      <TableColumn tdWidth={tdWidths.at(0)}>#{rank}</TableColumn>
      <Hover>
        <UserColumn
          rank={rank}
          user={formattedAddress}
          address={address}
          me={me}
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
