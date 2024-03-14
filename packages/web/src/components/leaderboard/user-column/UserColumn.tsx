import IconBronzeMedal from "@components/common/icons/IconBronzeMedal";
import IconGoldMedal from "@components/common/icons/IconGoldMedal";
import IconSilverMedal from "@components/common/icons/IconSilverMedal";
import styled from "@emotion/styled";
import { HTMLAttributes } from "react";
import { TableColumn } from "../leaderboard-info/LeaderboardInfo.styles";

const Flex = styled.div`
  gap: 1rem;
  display: flex;
`;

const UserColumn = ({
  rank,
  user,
  children,
  ...rest
}: {
  rank: number;
  user: string;
  children?: React.ReactNode;
  tdWidth?: number;
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <TableColumn {...rest}>
      <Flex>
        {rank === 1 && <IconGoldMedal />}
        {rank === 2 && <IconSilverMedal />}
        {rank === 3 && <IconBronzeMedal />}
        {user}
        {children}
      </Flex>
    </TableColumn>
  );
};

export default UserColumn;
