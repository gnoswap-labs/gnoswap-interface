import IconInfo from "@components/common/icons/IconInfo";
import Switch from "@components/common/switch/Switch";
import Tooltip from "@components/common/tooltip/Tooltip";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

// TODO: Resolve Unused vars errors and remove ESLint comments
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { useState } from "react";

const TooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  max-width: 268px;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background02};
`;

export const LeaderboardListHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "", "space-between")};
  width: 100%;
  color: ${({ theme }) => theme.color.text04};

  svg {
    cursor: default;
    width: 16px;
    height: 16px;
  }
  path {
    fill: ${({ theme }) => theme.color.icon03};
  }
`;

export const Flex = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 4px;
`;

export const Hover = styled.div`
  :hover {
    cursor: pointer;
  }
`;

const LeaderboardListHeader = () => {
  const [checked, setChecked] = useState(true);

  return (
    <LeaderboardListHeaderWrapper>
      <Flex>
        <Tooltip
          placement="top"
          FloatingContent={
            <TooltipContent>
              Your username or address will be hidden. Other users will not be
              able to see your positions.
            </TooltipContent>
          }
        >
          <Hover>
            <Flex>
              <IconInfo />
              {/* <p>Hide my address or username</p> */}
              <p>Hide me</p>
            </Flex>
          </Hover>
        </Tooltip>
        <Flex
          style={{
            paddingLeft: "16px",
          }}
        >
          <Switch
            checked={checked}
            onChange={() => {
              setChecked(v => !v);
            }}
          />
        </Flex>
      </Flex>

      <Tooltip
        placement="top"
        FloatingContent={
          <TooltipContent>
            The leaderboard is updated on an hourly basis.
          </TooltipContent>
        }
      >
        <Hover>
          <Flex>
            <IconInfo />
            <p>Next update in 01:42:31</p>
          </Flex>
        </Hover>
      </Tooltip>
    </LeaderboardListHeaderWrapper>
  );
};

export default LeaderboardListHeader;
