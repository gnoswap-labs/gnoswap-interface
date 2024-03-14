import Switch from "@components/common/switch/Switch";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useConnection } from "@hooks/connection/use-connection";
import { useState } from "react";
import ConnectYourWallet from "../connect-your-wallet/ConnectYourWallet";
import HideMe from "../hide-me/HideMe";
import {
  Flex,
  Gray,
  Hover,
  Info,
  LeaderboardListHeaderWrapper,
  SwitchWrapper,
  TooltipContent,
} from "./LeaderboardListTable.styles";

const LeaderboardListHeader = () => {
  const [checked, setChecked] = useState(true);
  const { conneted } = useConnection();
  const { isMobile } = useWindowSize();

  return (
    <LeaderboardListHeaderWrapper>
      <Flex>
        {conneted ? (
          <>
            <Tooltip
              placement="top"
              FloatingContent={
                <TooltipContent>
                  Your username or address will be hidden. Other users will not
                  be able to see your positions.
                </TooltipContent>
              }
            >
              <HideMe isMobile={isMobile} />
            </Tooltip>
            <SwitchWrapper>
              <Switch checked={checked} onChange={() => setChecked(v => !v)} />
            </SwitchWrapper>
          </>
        ) : (
          <ConnectYourWallet isMobile={isMobile} />
        )}
      </Flex>

      <Tooltip
        placement="top"
        FloatingContent={
          <TooltipContent style={{ width: "314px" }}>
            The leaderboard is updated on an hourly basis.
          </TooltipContent>
        }
      >
        <Hover>
          <Flex>
            <Info />
            <Gray>Next update in 01:42:31</Gray>
          </Flex>
        </Hover>
      </Tooltip>
    </LeaderboardListHeaderWrapper>
  );
};

export default LeaderboardListHeader;
