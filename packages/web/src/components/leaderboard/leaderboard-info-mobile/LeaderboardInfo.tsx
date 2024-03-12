import { TableColumn, Wrapper } from "./LeaderboardInfo.styles";
import { MOBILE_LEADERBOARD_TD_WIDTH } from "@constants/skeleton.constant";
import { Leader } from "@containers/leaderboard-list-container/LeaderboardListContainer";
import IconGoldMedal from "@components/common/icons/IconGoldMedal";
import IconBronzeMedal from "@components/common/icons/IconBronzeMedal";
import IconSilverMedal from "@components/common/icons/IconSilverMedal";

const LeaderboardUserColumn = ({
  tdWidth,
  rank,
  user,
}: {
  tdWidth: number;
  rank: number;
  user: string;
}) => {
  return (
    <TableColumn tdWidth={tdWidth}>
      <div style={{ gap: "1rem", display: "flex" }}>
        {rank === 1 && <IconGoldMedal />}
        {rank === 2 && <IconSilverMedal />}
        {rank === 3 && <IconBronzeMedal />}
        {user}
      </div>
    </TableColumn>
  );
};

const LeaderboardInfoMobile = ({ item }: { item: Leader }) => {
  const { rank, user, points } = item;

  return (
    <Wrapper>
      <TableColumn tdWidth={MOBILE_LEADERBOARD_TD_WIDTH[0]}>
        #{rank}
      </TableColumn>
      <LeaderboardUserColumn
        tdWidth={MOBILE_LEADERBOARD_TD_WIDTH[1]}
        rank={rank}
        user={user}
      />
      <TableColumn tdWidth={MOBILE_LEADERBOARD_TD_WIDTH[2]}>
        {points}
      </TableColumn>
    </Wrapper>
  );
};

export default LeaderboardInfoMobile;
