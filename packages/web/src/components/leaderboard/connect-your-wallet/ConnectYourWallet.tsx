import Switch from "@components/common/switch/Switch";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useState } from "react";
import HideMe from "../hide-me/HideMe";
import {
  TooltipContent,
  Flex,
  SwitchWrapper,
} from "./ConnectYourWallet.styles";

const ConnectYourWallet = ({
  connected,
  isMobile,
}: {
  connected: boolean;
  isMobile: boolean;
}) => {
  const [checked, setChecked] = useState(true);
  return (
    <Flex>
      {connected ? (
        <>
          <Tooltip
            placement="top"
            FloatingContent={
              <TooltipContent>
                Your username or address will be hidden. Other users will not be
                able to see your positions.
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
        <>{!isMobile && "Connect your wallet to check your points"}</>
      )}
    </Flex>
  );
};

export default ConnectYourWallet;
