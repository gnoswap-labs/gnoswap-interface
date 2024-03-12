import { HoverSection, TableColumn, Wrapper } from "./LeaderboardInfo.styles";
import { LEADERBOARD_TD_WIDTH } from "@constants/skeleton.constant";
import { Leader } from "@containers/leaderboard-list-container/LeaderboardListContainer";
import IconGoldMedal from "@components/common/icons/IconGoldMedal";
import IconBronzeMedal from "@components/common/icons/IconBronzeMedal";
import IconSilverMedal from "@components/common/icons/IconSilverMedal";

const LeaderboardUserColumn = ({
  rank,
  user,
}: {
  rank: number;
  user: string;
}) => {
  return (
    <TableColumn tdWidth={LEADERBOARD_TD_WIDTH[1]}>
      <div style={{ gap: "1rem", display: "flex" }}>
        {rank === 1 && <IconGoldMedal />}
        {rank === 2 && <IconSilverMedal />}
        {rank === 3 && <IconBronzeMedal />}
        {user}
      </div>
    </TableColumn>
  );
};

const LeaderboardInfo = ({ item }: { item: Leader }) => {
  const { rank, user, volume, position, staking, points } = item;

  return (
    <Wrapper>
      <TableColumn tdWidth={LEADERBOARD_TD_WIDTH[0]}>#{rank}</TableColumn>
      <HoverSection>
        <LeaderboardUserColumn rank={rank} user={user} />
      </HoverSection>
      <HoverSection>
        <TableColumn tdWidth={LEADERBOARD_TD_WIDTH[2]}>{volume}</TableColumn>
        <TableColumn tdWidth={LEADERBOARD_TD_WIDTH[3]}>{position}</TableColumn>
        <TableColumn tdWidth={LEADERBOARD_TD_WIDTH[4]}>{staking}</TableColumn>
        <TableColumn tdWidth={LEADERBOARD_TD_WIDTH[5]}>{points}</TableColumn>
      </HoverSection>
    </Wrapper>
  );
};

export default LeaderboardInfo;
