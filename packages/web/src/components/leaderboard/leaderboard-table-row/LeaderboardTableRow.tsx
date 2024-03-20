import {
  HoverOnBgSection,
  HoverSection,
  TableColumn,
  Wrapper,
  WrapperHoverBackground,
} from "./LeaderboardTableRow.styles";
import PointComposition from "../point-composition/PointComposition";
import UserColumn from "../user-column/UserColumn";
import { Leader } from "@repositories/leaderboard/response/common/types";

const LeaderboardTableRow = ({
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
    volume,
    position,
    staking,
    points,
    swapPoint,
    positionPoint,
    stakingPoint,
    referralPoint,
  } = item;

  const Hover = me ? HoverSection : HoverOnBgSection;
  const TableWrapper = me ? WrapperHoverBackground : Wrapper;

  return (
    <TableWrapper>
      <TableColumn tdWidth={tdWidths.at(0)}>#{rank}</TableColumn>
      <Hover>
        <UserColumn
          rank={rank}
          user={user}
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
      </Hover>
    </TableWrapper>
  );
};

export default LeaderboardTableRow;
