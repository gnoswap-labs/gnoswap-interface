import IconBronzeMedal from "@components/common/icons/IconBronzeMedal";
import IconGoldMedal from "@components/common/icons/IconGoldMedal";
import IconMeLogo from "@components/common/icons/IconMeLogo";
import IconSilverMedal from "@components/common/icons/IconSilverMedal";
import styled from "@emotion/styled";
import useNavigate from "@hooks/common/use-navigate";
import { HTMLAttributes } from "react";
import { TableColumn } from "../leaderboard-table-row/LeaderboardTableRow.styles";

const Flex = styled.div`
  gap: 1rem;
  display: flex;
`;

const UserColumn = ({
  rank,
  user,
  address,
  me = false,
  ...rest
}: {
  rank: number;
  user: string;
  address: string;
  me?: boolean;
  tdWidth?: number;
} & HTMLAttributes<HTMLDivElement>) => {
  const { push } = useNavigate();
  return (
    <TableColumn
      {...rest}
      onClick={() => {
        push(`/earn?addr=${address}`);
      }}
    >
      <Flex>
        {rank === 1 && <IconGoldMedal />}
        {rank === 2 && <IconSilverMedal />}
        {rank === 3 && <IconBronzeMedal />}
        {user}
        {me && <IconMeLogo />}
      </Flex>
    </TableColumn>
  );
};

export default UserColumn;
