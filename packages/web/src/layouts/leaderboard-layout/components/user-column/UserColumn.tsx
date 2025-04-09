import IconBronzeMedal from "@components/common/icons/IconBronzeMedal";
import IconGoldMedal from "@components/common/icons/IconGoldMedal";
import IconMeLogo from "@components/common/icons/IconMeLogo";
import IconSilverMedal from "@components/common/icons/IconSilverMedal";
import Tooltip from "@components/common/tooltip/Tooltip";
import styled from "@emotion/styled";
import useRouter from "@hooks/common/use-custom-router";
import { LeaderboardUser } from "@repositories/leaderboard/response/common/types";
import { isLeaderboardHidden } from "@utils/leaderboard-utils";
import { formatAddress } from "@utils/string-utils";
import { HTMLAttributes } from "react";
import { TableColumn } from "../leaderboard-table-row/LeaderboardTableRow.styles";

const Flex = styled.div`
  gap: 1rem;
  display: flex;
`;

const UserColumn = ({
  myAddress,
  user,
  isMe = false,
  ...rest
}: {
  myAddress: string | undefined;
  user: LeaderboardUser;
  isMe?: boolean;
  tdWidth?: number;
} & HTMLAttributes<HTMLDivElement>) => {
  const { push } = useRouter();

  const formattedAddress = formatAddress(user.accountAddress || myAddress || "");
  return (
    <TableColumn
      {...rest}
      onClick={() => {
        if (!isLeaderboardHidden(user.hiddenYn)) push(`/earn?addr=${user.accountAddress}`);
      }}
    >
      <Flex>
        {user.rank == 1 && <IconGoldMedal />}
        {user.rank == 2 && <IconSilverMedal />}
        {user.rank == 3 && <IconBronzeMedal />}
        {!isLeaderboardHidden(user.hiddenYn) ? (
          <Tooltip
            placement="top"
            FloatingContent={<span style={{ fontSize: 14 }}>{user.accountAddress || myAddress}</span>}
          >
            <span>{formattedAddress}</span>
          </Tooltip>
        ) : (
          <span>{formattedAddress}</span>
        )}
        {isMe && <IconMeLogo />}
      </Flex>
    </TableColumn>
  );
};

export default UserColumn;
